import { describe, it, expect } from 'vitest';
import { createRouter, createRouteConfig, generateRoutes } from '../../src/routing/router';

describe('Router System', () => {
  it('should create route config', () => {
    const config = createRouteConfig('./src/pages', {
      conventions: {
        dynamicSegments: /\[([^\]]+)\]/g,
        catchAllSegments: /\[\.\.\.([^\]]+)\]/g
      }
    });

    expect(config).toBeDefined();
    expect(config.pagesDir).toBe('./src/pages');
    expect(config.conventions).toBeDefined();
  });

  it('should create router instance', () => {
    const config = createRouteConfig('./src/pages');
    const router = createRouter(config);

    expect(router).toBeDefined();
    expect(typeof router).toBe('object');
  });

  it('should generate routes from filesystem', async () => {
    // Mock filesystem structure
    const mockRoutes = await generateRoutes('./src/pages', {
      conventions: {
        dynamicSegments: /\[([^\]]+)\]/g,
        catchAllSegments: /\[\.\.\.([^\]]+)\]/g
      }
    });

    expect(Array.isArray(mockRoutes)).toBe(true);
  });

  it('should handle route configuration options', () => {
    const config = createRouteConfig('./src/pages', {
      conventions: {
        dynamicSegments: /\[([^\]]+)\]/g,
        catchAllSegments: /\[\.\.\.([^\]]+)\]/g
      }
    });

    expect(config).toBeDefined();
    expect(config.pagesDir).toBe('./src/pages');
  });
});
