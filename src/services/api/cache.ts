import { CacheEntry } from '@/types';

class CacheManager {
    private cache: Map<string, CacheEntry<any>> = new Map();

    set<T>(key: string, data: T, expiresIn: number = 60000): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresIn,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > entry.expiresIn;

        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);

        if (!entry) return false;

        const isExpired = Date.now() - entry.timestamp > entry.expiresIn;

        if (isExpired) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    clear(key?: string): void {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    clearExpired(): void {
        const now = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.expiresIn) {
                this.cache.delete(key);
            }
        }
    }
}

export const cache = new CacheManager();

// Cached API wrapper
export async function cachedFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    expiresIn: number = 60000
): Promise<T> {
    // Check cache first
    const cached = cache.get<T>(key);
    if (cached !== null) {
        return cached;
    }

    // Fetch and cache
    try {
        const data = await fetchFn();
        cache.set(key, data, expiresIn);
        return data;
    } catch (error) {
        throw error;
    }
}
