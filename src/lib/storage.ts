/**
 * Safe Storage utility for iframe sandboxing, private browsing, and restricted environments.
 * Prevents fatal DOMException / SecurityError crashes when accessing localStorage in iframes.
 */
class SafeStorage {
  private memoryStore: Map<string, string> = new Map();

  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Storage access blocked in iframe sandbox
    }
    return this.memoryStore.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Storage access blocked in iframe sandbox
    }
    this.memoryStore.set(key, value);
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Storage access blocked in iframe sandbox
    }
    this.memoryStore.delete(key);
  }
}

export const safeStorage = new SafeStorage();
