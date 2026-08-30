import { safeGetItem, safeSetItem } from './safeStorage';
import { setLiveExchangeRates } from './formatters';

const LAST_SYNC_KEY = 'tcg_forex_last_sync_timestamp';
const SIX_HOURS_MS = 6 * 60 * 60 * 1000; // 4 times per day (24h / 4 = 6h)

let isFetching = false;

export async function syncExchangeRatesIfNeeded(force: boolean = false): Promise<void> {
  if (isFetching) return;

  const now = Date.now();
  const lastSyncStr = safeGetItem(LAST_SYNC_KEY);
  const lastSync = lastSyncStr ? parseInt(lastSyncStr, 10) : 0;

  // Sync if forced or if 6 hours have passed since the last sync
  if (force || !lastSync || now - lastSync >= SIX_HOURS_MS) {
    try {
      isFetching = true;
      const res = await fetch('/api/exchange-rates');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          setLiveExchangeRates(data.rates);
          safeSetItem(LAST_SYNC_KEY, now.toString());
        }
      }
    } catch (err) {
      console.warn('Forex Metronome: Failed to sync exchange rates', err);
    } finally {
      isFetching = false;
    }
  }
}

/**
 * Initializes the 4-times-a-day metronome timer.
 * Checks on boot, and runs a light interval check to trigger exactly every 6 hours.
 */
export function initForexMetronome(): void {
  syncExchangeRatesIfNeeded();

  // Check every 15 minutes if a 6-hour interval window has elapsed
  setInterval(() => {
    syncExchangeRatesIfNeeded();
  }, 15 * 60 * 1000);
}
