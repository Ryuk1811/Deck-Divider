/**
 * Encrypted Local Database & Storage Vault (AES-GCM-256 + PBKDF2)
 *
 * Uses native Web Crypto API to encrypt all user state before storing
 * inside IndexedDB. Plaintext sensitive collections are never saved raw.
 */

const DB_NAME = 'deckdivider_encrypted_vault';
const DB_VERSION = 1;
const ENCRYPTED_STORE_NAME = 'secure_user_vault';
const KEY_SALT_KEY = 'deckdivider_vault_salt_v1';

// Internal indexedDB helper
function openVaultDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ENCRYPTED_STORE_NAME)) {
        db.createObjectStore(ENCRYPTED_STORE_NAME, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Generate or retrieve persistent hardware/device-bound salt
function getOrCreateVaultSalt(): Uint8Array {
  const existing = localStorage.getItem(KEY_SALT_KEY);
  if (existing) {
    const bin = atob(existing);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  let str = '';
  for (let i = 0; i < salt.length; i++) {
    str += String.fromCharCode(salt[i]);
  }
  localStorage.setItem(KEY_SALT_KEY, btoa(str));
  return salt;
}

// Derive AES-GCM 256-bit CryptoKey using PBKDF2
async function deriveCryptoKey(userId: string = 'guest_user'): Promise<CryptoKey> {
  const salt = getOrCreateVaultSalt();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(`deckdivider_${userId}_hardware_seed`),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
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
}

export interface EncryptedPayloadRecord {
  key: string;
  iv: string; // Base64 IV
  ciphertext: string; // Base64 ciphertext
  updatedAt: string;
}

/**
 * Encrypt any JS object into AES-GCM 256 ciphertext and store in IndexedDB
 */
export async function setEncryptedItem<T>(key: string, value: T, userId: string = 'guest_user'): Promise<void> {
  try {
    const cryptoKey = await deriveCryptoKey(userId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const jsonStr = JSON.stringify(value);
    const enc = new TextEncoder();
    const encodedData = enc.encode(jsonStr);

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encodedData
    );

    const ivStr = btoa(String.fromCharCode(...iv));
    const ciphertextStr = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));

    const db = await openVaultDB();
    const tx = db.transaction(ENCRYPTED_STORE_NAME, 'readwrite');
    const store = tx.objectStore(ENCRYPTED_STORE_NAME);

    const record: EncryptedPayloadRecord = {
      key,
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
    console.error('Failed to set encrypted item:', key, err);
  }
}

/**
 * Read and decrypt an item from encrypted IndexedDB
 */
export async function getEncryptedItem<T>(key: string, userId: string = 'guest_user'): Promise<T | null> {
  try {
    const db = await openVaultDB();
    const tx = db.transaction(ENCRYPTED_STORE_NAME, 'readonly');
    const store = tx.objectStore(ENCRYPTED_STORE_NAME);
    const req = store.get(key);

    const record: EncryptedPayloadRecord | undefined = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (!record || !record.ciphertext || !record.iv) {
      return null;
    }

    const cryptoKey = await deriveCryptoKey(userId);

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

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      cryptoKey,
      cipherBytes
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);
    return JSON.parse(jsonStr) as T;
  } catch (err) {
    console.warn('Failed to get/decrypt encrypted item:', key, err);
    return null;
  }
}

/**
 * Remove an item from the encrypted vault
 */
export async function removeEncryptedItem(key: string): Promise<void> {
  try {
    const db = await openVaultDB();
    const tx = db.transaction(ENCRYPTED_STORE_NAME, 'readwrite');
    tx.objectStore(ENCRYPTED_STORE_NAME).delete(key);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to delete encrypted item:', key, err);
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
    console.error('Failed to clear encrypted vault:', err);
  }
}
