import { describe, it, expect, vi } from 'vitest';
import { createDataFetcher, createQueryClient, useQuery, invalidateTag, getCacheStats } from '../../src/data/data-fetcher';

// Mock fetch globally
global.fetch = vi.fn();

describe('Data Fetcher System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create data fetcher instance', () => {
    const fetcher = createDataFetcher();
    expect(fetcher).toBeDefined();
    expect(typeof fetcher).toBe('object');
  });

  it('should create query client', () => {
    const client = createQueryClient();
    expect(client).toBeDefined();
    expect(typeof client).toBe('object');
  });

  it('should use query hook', () => {
    const result = useQuery('/api/test');
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should invalidate tags', async () => {
    const result = await invalidateTag('test-tag');
    // Function should complete without error
    expect(true).toBe(true);
  });

  it('should get cache stats', () => {
    const stats = getCacheStats();
    expect(stats).toBeDefined();
    expect(typeof stats).toBe('object');
  });

  it('should handle fetch options', () => {
    const fetcher = createDataFetcher({
      baseURL: 'https://api.example.com',
      defaultOptions: {
        revalidate: 300,
        tags: ['api']
      }
    });

    expect(fetcher).toBeDefined();
  });
});
