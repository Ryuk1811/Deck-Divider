/**
 * Recurring Backup & Point-in-Time Collection Recovery Engine
 *
 * Provides continuous background backup management, point-in-time cloud & local
 * snapshot archives, automated retention pruning, and 1-click collection restoration.
 */

import { doc, setDoc, getDocs, collection, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { UserCompressedSnapshotState, packageUserSnapshot, unpackUserSnapshot, CompressedSnapshotDoc } from './snapshotEngine';
import { Deck, CustomList, PortfolioSealedEntry, PortfolioCardEntry } from '../types';

export interface BackupPoint {
  id: string;
  userId: string;
  timestamp: string;
  origin: 'cloud' | 'local';
  summary: {
    deckCount: number;
    cardCount: number;
    sealedCount: number;
    listCount: number;
    soldCount: number;
  };
  byteSize: number;
  compressionRatio: string;
  docData?: CompressedSnapshotDoc;
  rawPayload?: UserCompressedSnapshotState;
}

import { setEncryptedItem, getEncryptedItem } from './encryptedVault';

const LOCAL_BACKUPS_STORAGE_KEY = 'tcg_rolling_local_backups_v1';
const MAX_CLOUD_BACKUPS = 10;
const MAX_LOCAL_BACKUPS = 5;

/**
 * Save a rolling local backup to encrypted vault as an offline safety fallback
 */
export async function saveRollingLocalBackup(state: UserCompressedSnapshotState): Promise<BackupPoint | null> {
  try {
    const backupId = `local_backup_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const totalCards = state.decks.reduce(
      (acc, d) => acc + d.entries.reduce((sum, e) => sum + e.quantity, 0),
      0
    );

    const backupPoint: BackupPoint = {
      id: backupId,
      userId: state.userId,
      timestamp,
      origin: 'local',
      summary: {
        deckCount: state.decks.length,
        cardCount: totalCards,
        sealedCount: state.sealedEntries.length,
        listCount: state.customLists.length,
        soldCount: state.soldEntries.length,
      },
      byteSize: new TextEncoder().encode(JSON.stringify(state)).byteLength,
      compressionRatio: 'uncompressed',
      rawPayload: state,
    };

    let existingBackups = (await getEncryptedItem<BackupPoint[]>(LOCAL_BACKUPS_STORAGE_KEY, state.userId)) || [];

    // Prepend new backup
    existingBackups.unshift(backupPoint);

    // Prune old local backups exceeding max limit
    if (existingBackups.length > MAX_LOCAL_BACKUPS) {
      existingBackups = existingBackups.slice(0, MAX_LOCAL_BACKUPS);
    }

    await setEncryptedItem(LOCAL_BACKUPS_STORAGE_KEY, existingBackups, state.userId);
    return backupPoint;
  } catch (err) {
    console.warn('Local rolling backup warning:', err);
    return null;
  }
}

/**
 * Fetch all local rolling backups from encrypted vault
 */
export async function getLocalRollingBackups(userId: string): Promise<BackupPoint[]> {
  try {
    const backups = await getEncryptedItem<BackupPoint[]>(LOCAL_BACKUPS_STORAGE_KEY, userId);
    if (!backups || !Array.isArray(backups)) return [];
    return backups.filter((b) => b.userId === userId);
  } catch (err) {
    console.warn('Failed to parse local backups:', err);
    return [];
  }
}

/**
 * Save a timestamped cloud backup point in Firestore under /users/{userId}/backups/{timestamp}
 */
export async function createCloudBackupPoint(
  state: UserCompressedSnapshotState
): Promise<BackupPoint | null> {
  if (!state.userId || state.userId === 'guest_user') {
    // For guest users, save local backup only
    return await saveRollingLocalBackup(state);
  }

  try {
    // Save local rolling backup first as failsafe
    await saveRollingLocalBackup(state);

    const packed = await packageUserSnapshot(state);
    const backupDocId = `backup_${Date.now()}`;
    const backupRef = doc(db, 'users', state.userId, 'backups', backupDocId);

    await setDoc(backupRef, packed);

    // Prune old cloud backups if over MAX_CLOUD_BACKUPS
    pruneOldCloudBackups(state.userId);

    return {
      id: backupDocId,
      userId: state.userId,
      timestamp: packed.updatedAt,
      origin: 'cloud',
      summary: packed.summary,
      byteSize: packed.byteSize,
      compressionRatio: packed.compressionRatio,
      docData: packed,
    };
  } catch (err) {
    console.warn('Cloud backup point creation warning:', err);
    return null;
  }
}

/**
 * Prune historical cloud backups exceeding max limit to save Firestore storage
 */
async function pruneOldCloudBackups(userId: string): Promise<void> {
  try {
    const backupsRef = collection(db, 'users', userId, 'backups');
    const q = query(backupsRef, orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);

    if (snap.docs.length > MAX_CLOUD_BACKUPS) {
      const docsToDelete = snap.docs.slice(MAX_CLOUD_BACKUPS);
      for (const d of docsToDelete) {
        await deleteDoc(d.ref);
      }
    }
  } catch (err) {
    console.warn('Pruning old cloud backups warning:', err);
  }
}

/**
 * Fetch all available point-in-time cloud backups for a user
 */
export async function getCloudBackupPoints(userId: string): Promise<BackupPoint[]> {
  if (!userId || userId === 'guest_user') return [];

  try {
    const backupsRef = collection(db, 'users', userId, 'backups');
    const q = query(backupsRef, orderBy('updatedAt', 'desc'), limit(MAX_CLOUD_BACKUPS));
    const snap = await getDocs(q);

    const cloudBackups: BackupPoint[] = [];
    for (const d of snap.docs) {
      const docData = d.data() as CompressedSnapshotDoc;
      cloudBackups.push({
        id: d.id,
        userId: docData.userId,
        timestamp: docData.updatedAt,
        origin: 'cloud',
        summary: docData.summary,
        byteSize: docData.byteSize,
        compressionRatio: docData.compressionRatio,
        docData,
      });
    }

    return cloudBackups;
  } catch (err) {
    console.warn('Error fetching cloud backup points:', err);
    return [];
  }
}

/**
 * Validate and parse an imported backup JSON string
 */
export function validateAndParseBackupJSON(jsonString: string): UserCompressedSnapshotState {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON file format. Could not parse portfolio backup file.');
  }

  // Support direct state export format or wrapped backup format
  const targetState = parsed.rawPayload || parsed.state || parsed;

  if (!targetState || typeof targetState !== 'object') {
    throw new Error('Invalid portfolio structure: root state object is missing.');
  }

  if (!Array.isArray(targetState.decks)) {
    throw new Error('Invalid backup schema: "decks" array is required.');
  }

  return {
    version: targetState.version || 2,
    userId: targetState.userId || 'restored_user',
    updatedAt: targetState.updatedAt || new Date().toISOString(),
    profile: targetState.profile || {
      tier: 'FREE',
      currency: 'USD',
    },
    decks: targetState.decks || [],
    customLists: Array.isArray(targetState.customLists) ? targetState.customLists : [],
    sealedEntries: Array.isArray(targetState.sealedEntries) ? targetState.sealedEntries : [],
    soldEntries: Array.isArray(targetState.soldEntries) ? targetState.soldEntries : [],
    recentActivities: Array.isArray(targetState.recentActivities) ? targetState.recentActivities : [],
  };
}
