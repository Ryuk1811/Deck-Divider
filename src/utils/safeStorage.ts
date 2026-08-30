const inMemoryLocalStorage = new Map<string, string>();
const inMemorySessionStorage = new Map<string, string>();

export function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
  return inMemoryLocalStorage.get(key) ?? null;
}

export function safeSetItem(key: string, value: string): void {
  inMemoryLocalStorage.set(key, value);
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
}

export function safeRemoveItem(key: string): void {
  inMemoryLocalStorage.delete(key);
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
}

export function safeGetSessionItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && 'sessionStorage' in window) {
      const val = window.sessionStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
  return inMemorySessionStorage.get(key) ?? null;
}

export function safeSetSessionItem(key: string, value: string): void {
  inMemorySessionStorage.set(key, value);
  try {
    if (typeof window !== 'undefined' && 'sessionStorage' in window) {
      window.sessionStorage.setItem(key, value);
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
}

export function safeRemoveSessionItem(key: string): void {
  inMemorySessionStorage.delete(key);
  try {
    if (typeof window !== 'undefined' && 'sessionStorage' in window) {
      window.sessionStorage.removeItem(key);
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
}
