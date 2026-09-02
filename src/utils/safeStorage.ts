const inMemoryLocalStorage = new Map<string, string>();
const inMemorySessionStorage = new Map<string, string>();

export function safeGetItem(key: string): string | null {
  try {
    let hasLS = false;
    try { hasLS = typeof window !== 'undefined' && !!window.localStorage; } catch (e) {}
    if (hasLS) {
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
    let hasLS = false;
    try { hasLS = typeof window !== 'undefined' && !!window.localStorage; } catch (e) {}
    if (hasLS) {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
}

export function safeRemoveItem(key: string): void {
  inMemoryLocalStorage.delete(key);
  try {
    let hasLS = false;
    try { hasLS = typeof window !== 'undefined' && !!window.localStorage; } catch (e) {}
    if (hasLS) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
}

export function safeGetSessionItem(key: string): string | null {
  try {
    let hasSS = false;
    try { hasSS = typeof window !== 'undefined' && !!window.sessionStorage; } catch (e) {}
    if (hasSS) {
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
    let hasSS = false;
    try { hasSS = typeof window !== 'undefined' && !!window.sessionStorage; } catch (e) {}
    if (hasSS) {
      window.sessionStorage.setItem(key, value);
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
}

export function safeRemoveSessionItem(key: string): void {
  inMemorySessionStorage.delete(key);
  try {
    let hasSS = false;
    try { hasSS = typeof window !== 'undefined' && !!window.sessionStorage; } catch (e) {}
    if (hasSS) {
      window.sessionStorage.removeItem(key);
    }
  } catch (err) {
    // Ignore SecurityError / blocked storage
  }
}
