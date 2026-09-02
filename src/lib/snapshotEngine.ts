/**
 * Gzip Compression and Single-Document Snapshot Sync Engine
 *
 * Compresses the entire user portfolio, decks, lists, and settings into
 * a micro-footprint gzipped payload for space-efficient single-document
 * Firestore overwrite.
 */

import { Deck, CustomList, PortfolioSealedEntry, PortfolioCardEntry, AccountTier } from '../types';

export interface UserCompressedSnapshotState {
  version: number;
  userId: string;
  updatedAt: string;
  profile: {
    displayName?: string;
    email?: string;
    tier: AccountTier;
    currency: string;
    settings?: Record<string, any>;
    isPublicProfile?: boolean;
    publicProfileShareCode?: string;
  };
  decks: Deck[];
  customLists: CustomList[];
  sealedEntries: PortfolioSealedEntry[];
  soldEntries: PortfolioCardEntry[];
  recentActivities: any[];
}

export interface CompressedSnapshotDoc {
  version: number;
  userId: string;
  updatedAt: string;
  byteSize: number;
  rawSize: number;
  compressionRatio: string;
  isPublicProfile?: boolean;
  publicProfileShareCode?: string;
  summary: {
    deckCount: number;
    cardCount: number;
    sealedCount: number;
    listCount: number;
    soldCount: number;
  };
  compressedPayload: string; // Base64 gzipped JSON string
}

/**
 * Compresses string to Base64 using gzip (supports CompressionStream with fallback)
 */
export async function compressStringToBase64(input: string): Promise<string> {
  const enc = new TextEncoder();
  const uncompressedBytes = enc.encode(input);

  if (typeof CompressionStream !== 'undefined') {
    const cs = new CompressionStream('gzip');
    const writer = cs.writable.getWriter();
    writer.write(uncompressedBytes);
    writer.close();

    const response = new Response(cs.readable);
    const compressedBuffer = await response.arrayBuffer();
    const compressedBytes = new Uint8Array(compressedBuffer);

    let binary = '';
    for (let i = 0; i < compressedBytes.byteLength; i++) {
      binary += String.fromCharCode(compressedBytes[i]);
    }
    return btoa(binary);
  }

  // Fallback if CompressionStream unavailable
  let binary = '';
  for (let i = 0; i < uncompressedBytes.byteLength; i++) {
    binary += String.fromCharCode(uncompressedBytes[i]);
  }
  return btoa(binary);
}

/**
 * Decompresses Base64 gzip string back to UTF-8 text
 */
export async function decompressBase64ToString(base64: string): Promise<string> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  if (typeof DecompressionStream !== 'undefined') {
    try {
      const ds = new DecompressionStream('gzip');
      const writer = ds.writable.getWriter();
      writer.write(bytes);
      writer.close();

      const response = new Response(ds.readable);
      const decompressedBuffer = await response.arrayBuffer();
      const dec = new TextDecoder();
      return dec.decode(decompressedBuffer);
    } catch {
      // If not gzip compressed (plain base64 fallback)
      const dec = new TextDecoder();
      return dec.decode(bytes);
    }
  }

  const dec = new TextDecoder();
  return dec.decode(bytes);
}

/**
 * Create a lightweight single-document snapshot ready for Firestore overwrite
 */
export async function packageUserSnapshot(state: UserCompressedSnapshotState): Promise<CompressedSnapshotDoc> {
  const jsonStr = JSON.stringify(state);
  const rawSize = new TextEncoder().encode(jsonStr).byteLength;

  const compressedPayload = await compressStringToBase64(jsonStr);
  const byteSize = compressedPayload.length;
  const ratio = `${Math.max(1, Math.round((1 - byteSize / rawSize) * 100))}% reduction`;

  const totalCards = state.decks.reduce(
    (acc, d) => acc + d.entries.reduce((sum, e) => sum + e.quantity, 0),
    0
  );

  return {
    version: 2,
    userId: state.userId,
    updatedAt: new Date().toISOString(),
    byteSize,
    rawSize,
    compressionRatio: ratio,
    isPublicProfile: state.profile.isPublicProfile,
    publicProfileShareCode: state.profile.publicProfileShareCode,
    summary: {
      deckCount: state.decks.length,
      cardCount: totalCards,
      sealedCount: state.sealedEntries.length,
      listCount: state.customLists.length,
      soldCount: state.soldEntries.length,
    },
    compressedPayload,
  };
}

/**
 * Unpack snapshot document from Firestore back into user application state
 */
export async function unpackUserSnapshot(docData: CompressedSnapshotDoc): Promise<UserCompressedSnapshotState | null> {
  try {
    if (!docData || !docData.compressedPayload) {
      return null;
    }
    const jsonStr = await decompressBase64ToString(docData.compressedPayload);
    return JSON.parse(jsonStr) as UserCompressedSnapshotState;
  } catch (err) {
    console.error('Failed to unpack user snapshot payload:', err);
    return null;
  }
}
