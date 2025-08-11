import { createReactiveState, createComputed } from '../state/reactive-state.js';

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  cache?: 'no-store' | 'force-cache' | 'default';
  revalidate?: number;
  strategy?: 'auto' | 'ssr' | 'ssg' | 'isr';
  tags?: string[];
}

export interface FetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isStale: boolean;
  revalidate: () => Promise<void>;
  mutate: (data: T) => void;
}

export interface DataFetcher {
  fetch: <T>(url: string, options?: FetchOptions) => Promise<T>;
  fetchSSR: <T>(url: string, options?: FetchOptions) => Promise<T>;
  fetchSSG: <T>(url: string, options?: FetchOptions) => Promise<T>;
  fetchISR: <T>(url: string, revalidateSeconds: number, options?: FetchOptions) => Promise<T>;
  useQuery: <T>(url: string, options?: FetchOptions) => FetchResult<T>;
  invalidateTag: (tag: string) => Promise<void>;
  getCacheStats: () => CacheStats;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  memoryUsage: number;
}

// Cache implementation
class DataCache {
  private cache = new Map<string, CacheEntry>();
  private hits = 0;
  private misses = 0;

  set(key: string, entry: CacheEntry) {
    this.cache.set(key, entry);
  }

  get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      this.hits++;
      return entry;
    }
    this.misses++;
    return undefined;
  }

  invalidateByTag(tag: string) {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags?.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): CacheStats {
    return {
      totalEntries: this.cache.size,
      hitRate: this.hits / (this.hits + this.misses),
      memoryUsage: this.cache.size * 100 // Rough estimate
    };
  }
}

interface CacheEntry {
  data: any;
  timestamp: number;
  revalidateAt?: number;
  tags?: string[];
  strategy: 'ssr' | 'ssg' | 'isr';
}

// Global cache instance
const globalCache = new DataCache();

/**
 * Creates a data fetcher with built-in SSR/SSG/ISR support
 * This automatically chooses the best strategy based on context and options
 */
export function createDataFetcher(): DataFetcher {
  
  /**
   * Determines the best fetching strategy based on context
   */
  const determineStrategy = (options?: FetchOptions): 'ssr' | 'ssg' | 'isr' => {
    if (options?.strategy && options.strategy !== 'auto') {
      return options.strategy;
    }

    // Auto-detect based on context
    if (typeof window === 'undefined') {
      // Server-side: prefer SSR for dynamic data, SSG for static
      return options?.revalidate ? 'isr' : 'ssr';
    } else {
      // Client-side: prefer ISR for revalidation, SSG for static
      return options?.revalidate ? 'isr' : 'ssg';
    }
  };

  /**
   * Generates a cache key for the request
   */
  const generateCacheKey = (url: string, options?: FetchOptions): string => {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  };

  /**
   * Smart fetch that automatically chooses the best strategy
   */
  const smartFetch = async <T>(url: string, options?: FetchOptions): Promise<T> => {
    const strategy = determineStrategy(options);
    const cacheKey = generateCacheKey(url, options);
    
    // Check cache first
    const cached = globalCache.get(cacheKey);
    if (cached && cached.revalidateAt && Date.now() < cached.revalidateAt) {
      return cached.data;
    }

    // Fetch with determined strategy
    switch (strategy) {
      case 'ssr':
        return fetchSSR<T>(url, options);
      case 'ssg':
        return fetchSSG<T>(url, options);
      case 'isr':
        return fetchISR<T>(url, options?.revalidate || 3600, options);
      default:
        return fetchSSR<T>(url, options);
    }
  };

  /**
   * Server-side rendering data fetching
   */
  const fetchSSR = async <T>(url: string, options?: FetchOptions): Promise<T> => {
    const cacheKey = generateCacheKey(url, options);
    
    try {
      const response = await fetch(url, {
        ...options,
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      globalCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        strategy: 'ssr',
        tags: options?.tags
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Static site generation data fetching
   */
  const fetchSSG = async <T>(url: string, options?: FetchOptions): Promise<T> => {
    const cacheKey = generateCacheKey(url, options);
    
    // Check cache first
    const cached = globalCache.get(cacheKey);
    if (cached && cached.strategy === 'ssg') {
      return cached.data;
    }

    try {
      const response = await fetch(url, {
        ...options,
        cache: 'force-cache',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result permanently
      globalCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        strategy: 'ssg',
        tags: options?.tags
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Incremental static regeneration data fetching
   */
  const fetchISR = async <T>(url: string, revalidateSeconds: number, options?: FetchOptions): Promise<T> => {
    const cacheKey = generateCacheKey(url, options);
    
    // Check cache first
    const cached = globalCache.get(cacheKey);
    if (cached && cached.revalidateAt && Date.now() < cached.revalidateAt) {
      return cached.data;
    }

    try {
      const response = await fetch(url, {
        ...options,
        cache: 'default',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache with revalidation time
      globalCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        revalidateAt: Date.now() + (revalidateSeconds * 1000),
        strategy: 'isr',
        tags: options?.tags
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * React hook for data fetching with automatic caching and revalidation
   */
  const useQuery = <T>(url: string, options?: FetchOptions): FetchResult<T> => {
    const data = createReactiveState<T | null>(null);
    const error = createReactiveState<string | null>(null);
    const isLoading = createReactiveState(true);
    const isStale = createReactiveState(false);

    // Check cache on mount
    const cacheKey = generateCacheKey(url, options);
    const cached = globalCache.get(cacheKey);
    if (cached) {
      data.setValue(cached.data);
      isLoading.setValue(false);
      
      // Check if data is stale
      if (cached.revalidateAt && Date.now() >= cached.revalidateAt) {
        isStale.setValue(true);
      }
    }

    const fetchData = async () => {
      try {
        isLoading.setValue(true);
        error.setValue(null);
        
        const result = await smartFetch<T>(url, options);
        data.setValue(result);
        isStale.setValue(false);
      } catch (err) {
        error.setValue(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        isLoading.setValue(false);
      }
    };

    const revalidate = async () => {
      await fetchData();
    };

    const mutate = (newData: T) => {
      data.setValue(newData);
      // Update cache
      globalCache.set(cacheKey, {
        data: newData,
        timestamp: Date.now(),
        strategy: determineStrategy(options),
        tags: options?.tags
      });
    };

    // Fetch data if not cached
    if (!cached) {
      fetchData();
    }

    return {
      data: data.value(),
      error: error.value(),
      isLoading: isLoading.value(),
      isStale: isStale.value(),
      revalidate,
      mutate
    };
  };

  /**
   * Invalidate cache entries by tag
   */
  const invalidateTag = async (tag: string): Promise<void> => {
    globalCache.invalidateByTag(tag);
  };

  /**
   * Get cache statistics
   */
  const getCacheStats = (): CacheStats => {
    return globalCache.getStats();
  };

  return {
    fetch: smartFetch,
    fetchSSR,
    fetchSSG,
    fetchISR,
    useQuery,
    invalidateTag,
    getCacheStats
  };
}

/**
 * Utility functions for common data fetching patterns
 */
export const createQueryClient = () => {
  const fetcher = createDataFetcher();
  
  return {
    ...fetcher,
    
    // Prefetch data for better UX
    prefetch: async <T>(url: string, options?: FetchOptions) => {
      return fetcher.fetch<T>(url, options);
    },
    
    // Batch multiple requests
    batchFetch: async <T>(requests: Array<{ url: string; options?: FetchOptions }>) => {
      const promises = requests.map(({ url, options }) => fetcher.fetch<T>(url, options));
      return Promise.all(promises);
    },
    
    // Optimistic updates
    optimisticUpdate: <T>(url: string, data: T, options?: FetchOptions) => {
      const cacheKey = generateCacheKey(url, options);
      globalCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        strategy: 'ssr',
        tags: options?.tags
      });
    }
  };
};

// Helper function for cache key generation
function generateCacheKey(url: string, options?: FetchOptions): string {
  const method = options?.method || 'GET';
  const body = options?.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
}

// Standalone functions for direct import
export const useQuery = <T>(url: string, options?: FetchOptions): FetchResult<T> => {
  const fetcher = createDataFetcher();
  return fetcher.useQuery<T>(url, options);
};

export const invalidateTag = async (tag: string): Promise<void> => {
  const fetcher = createDataFetcher();
  return fetcher.invalidateTag(tag);
};

export const getCacheStats = (): CacheStats => {
  const fetcher = createDataFetcher();
  return fetcher.getCacheStats();
};
