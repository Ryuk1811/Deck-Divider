/**
 * Encrypted Local Database & Storage Vault (AES-GCM-256 + PBKDF2)
 *
 * Uses native Web Crypto API to encrypt all user state before storing
 * inside IndexedDB. Fallback to safeStorage if IndexedDB or Web Crypto is unavailable.
 */

const DB_NAME = 'deckdivider_encrypted_vault';
const DB_VERSION = 1;
const ENCRYPTED_STORE_NAME = 'secure_user_vault';
const KEY_SALT_KEY = 'deckdivider_vault_salt_v1';

import { safeGetItem, safeSetItem } from '../utils/safeStorage';

// Internal indexedDB helper
function openVaultDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === 'undefined') {
        return reject(new Error('Server environment'));
      }
      let hasIDB = false;
      try {
        hasIDB = typeof window.indexedDB !== 'undefined' && !!window.indexedDB;
      } catch (e) {
        hasIDB = false;
      }
      if (!hasIDB) {
        return reject(new Error('IndexedDB not supported or insecure context'));
      }

      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(ENCRYPTED_STORE_NAME)) {
          db.createObjectStore(ENCRYPTED_STORE_NAME, { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
    } catch (err) {
      reject(err);
    }
  });
}

// Generate or retrieve persistent hardware/device-bound salt
function getOrCreateVaultSalt(): Uint8Array {
  try {
    const existing = safeGetItem(KEY_SALT_KEY);
    if (existing) {
      const bin = atob(existing);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        arr[i] = bin.charCodeAt(i);
      }
      return arr;
    }
  } catch (err) {
    // Fallthrough to generation
  }

  const salt = new Uint8Array(16);
  try {
    if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
      crypto.getRandomValues(salt);
    } else {
      for (let i = 0; i < 16; i++) {
        salt[i] = Math.floor(Math.random() * 256);
      }
    }
  } catch (err) {
    for (let i = 0; i < 16; i++) {
      salt[i] = Math.floor(Math.random() * 256);
    }
  }

  try {
    let str = '';
    for (let i = 0; i < salt.length; i++) {
      str += String.fromCharCode(salt[i]);
    }
    safeSetItem(KEY_SALT_KEY, btoa(str));
  } catch (err) {
    // Fail silent
  }

  return salt;
}

// Helper to get SubtleCrypto safely without throwing SecurityError
function getSubtleCrypto(): SubtleCrypto | null {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      return window.crypto.subtle;
    }
  } catch (e) {
    // Insecure context or restricted frame
  }
  return null;
}

// Derive AES-GCM 256-bit CryptoKey using PBKDF2
async function deriveCryptoKey(userId: string = 'guest_user'): Promise<CryptoKey | null> {
  try {
    const subtleObj = getSubtleCrypto();
    if (!subtleObj) return null;

    const salt = getOrCreateVaultSalt();
    const enc = new TextEncoder();
    const keyMaterial = await subtleObj.importKey(
      'raw',
      enc.encode(`deckdivider_${userId}_hardware_seed`),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await subtleObj.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  } catch (err) {
    console.warn('deriveCryptoKey fallback:', err);
    return null;
  }
}

export interface EncryptedPayloadRecord {
  key: string;
  iv: string; // Base64 IV
  ciphertext: string; // Base64 ciphertext
  updatedAt: string;
}

/**
 * Encrypt any JS object into AES-GCM 256 ciphertext and store in IndexedDB or safeStorage
 */
export async function setEncryptedItem<T>(key: string, value: T, userId: string = 'guest_user'): Promise<void> {
  try {
    const cryptoKey = await deriveCryptoKey(userId);
    const subtleObj = getSubtleCrypto();

    if (!cryptoKey || !subtleObj) {
      // Safe fallback store
      safeSetItem(`vault_fallback_${userId}_${key}`, JSON.stringify(value));
      return;
    }

    const iv = new Uint8Array(12);
    try {
      if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
        crypto.getRandomValues(iv);
      } else {
        for (let i = 0; i < 12; i++) iv[i] = Math.floor(Math.random() * 256);
      }
    } catch (e) {
      for (let i = 0; i < 12; i++) iv[i] = Math.floor(Math.random() * 256);
    }

    const jsonStr = JSON.stringify(value);
    const enc = new TextEncoder();
    const encodedData = enc.encode(jsonStr);

    const encryptedBuffer = await subtleObj.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encodedData
    );

    const ivStr = btoa(String.fromCharCode(...iv));
    const ciphertextStr = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));

    const db = await openVaultDB();
    const tx = db.transaction(ENCRYPTED_STORE_NAME, 'readwrite');
    const store = tx.objectStore(ENCRYPTED_STORE_NAME);

    const scopedKey = `${userId}::${key}`;
    const record: EncryptedPayloadRecord = {
      key: scopedKey,
      iv: ivStr,
      ciphertext: ciphertextStr,
      updatedAt: new Date().toISOString(),
    };

    store.put(record);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('setEncryptedItem non-fatal fallback:', key, err);
    try {
      safeSetItem(`vault_fallback_${userId}_${key}`, JSON.stringify(value));
    } catch (_) {}
  }
}

/**
 * Read and decrypt an item from encrypted IndexedDB or safeStorage
 */
export async function getEncryptedItem<T>(key: string, userId: string = 'guest_user'): Promise<T | null> {
  try {
    const cryptoKey = await deriveCryptoKey(userId);
    const subtleObj = getSubtleCrypto();

    if (!cryptoKey || !subtleObj) {
      const fallbackVal = safeGetItem(`vault_fallback_${userId}_${key}`);
      return fallbackVal ? (JSON.parse(fallbackVal) as T) : null;
    }

    let record: EncryptedPayloadRecord | undefined;
    try {
      const db = await openVaultDB();
      const tx = db.transaction(ENCRYPTED_STORE_NAME, 'readonly');
      const store = tx.objectStore(ENCRYPTED_STORE_NAME);
      const scopedKey = `${userId}::${key}`;
      const req = store.get(scopedKey);

      record = await new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } catch (dbErr) {
      // DB failed
    }

    if (!record || !record.ciphertext || !record.iv) {
      const fallbackVal = safeGetItem(`vault_fallback_${userId}_${key}`);
      return fallbackVal ? (JSON.parse(fallbackVal) as T) : null;
    }

    const ivBytes = new Uint8Array(
      atob(record.iv)
        .split('')
        .map((c) => c.charCodeAt(0))
    );
    const cipherBytes = new Uint8Array(
      atob(record.ciphertext)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    const decryptedBuffer = await subtleObj.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      cryptoKey,
      cipherBytes
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);
    return JSON.parse(jsonStr) as T;
  } catch (err) {
    try {
      const fallbackVal = safeGetItem(`vault_fallback_${userId}_${key}`);
      return fallbackVal ? (JSON.parse(fallbackVal) as T) : null;
    } catch (_) {
      return null;
    }
  }
}

/**
 * Remove an item from the encrypted vault
 */
export async function removeEncryptedItem(key: string, userId: string = 'guest_user'): Promise<void> {
  try {
    safeSetItem(`vault_fallback_${userId}_${key}`, '');
    const db = await openVaultDB();
    const tx = db.transaction(ENCRYPTED_STORE_NAME, 'readwrite');
    const scopedKey = `${userId}::${key}`;
    tx.objectStore(ENCRYPTED_STORE_NAME).delete(scopedKey);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    // Non-fatal
  }
}

/**
 * Clear all records in the encrypted vault
 */
export async function clearEncryptedVault(): Promise<void> {
  try {
    const db = await openVaultDB();
    const tx = db.transaction(ENCRYPTED_STORE_NAME, 'readwrite');
    tx.objectStore(ENCRYPTED_STORE_NAME).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    // Non-fatal
  }
}
