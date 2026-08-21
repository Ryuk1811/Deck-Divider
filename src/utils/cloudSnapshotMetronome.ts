/**
 * 6-Hour Automated Cloud Snapshot Metronome
 * Automatically triggers user state cloud snapshots every 6 hours in the background.
 */

const SNAPSHOT_LAST_SYNC_KEY = 'tcg_cloud_snapshot_last_sync_timestamp';
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export function getStoredSnapshotTimestamp(): string | null {
  const ts = localStorage.getItem(SNAPSHOT_LAST_SYNC_KEY);
  return ts ? new Date(parseInt(ts, 10)).toISOString() : null;
}

export function recordSnapshotCompleted(): void {
  localStorage.setItem(SNAPSHOT_LAST_SYNC_KEY, Date.now().toString());
}

export function isSnapshotDue(): boolean {
  const lastSyncStr = localStorage.getItem(SNAPSHOT_LAST_SYNC_KEY);
  const lastSync = lastSyncStr ? parseInt(lastSyncStr, 10) : 0;
  return !lastSync || Date.now() - lastSync >= SIX_HOURS_MS;
}

/**
 * Initializes the 6-hour metronome ticker.
 * Checks on boot and every 10 minutes.
 */
export function initSnapshotMetronome(triggerSnapshot: () => void | Promise<void>): () => void {
  // If due on load, trigger immediately
  if (isSnapshotDue()) {
    triggerSnapshot();
  }

  // Interval check every 10 minutes to see if 6-hour threshold reached
  const intervalId = setInterval(() => {
    if (isSnapshotDue()) {
      triggerSnapshot();
    }
  }, 10 * 60 * 1000);

  return () => clearInterval(intervalId);
}
