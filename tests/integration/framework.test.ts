import { describe, it, expect } from 'vitest';
import { 
  createReactiveState, 
  createStateMachine, 
  createRouter, 
  createRouteConfig,
  createDataFetcher 
} from '../../src/index';

describe('Framework Integration', () => {
  it('should integrate reactive state with state machines', () => {
    // Create reactive state
    const appState = createReactiveState({
      user: null,
      isAuthenticated: false
    });

    // Create authentication state machine
    const authMachine = createStateMachine({
      initial: 'unauthenticated',
      states: {
        unauthenticated: {
          on: { LOGIN: 'authenticating' }
        },
        authenticating: {
          on: { SUCCESS: 'authenticated', ERROR: 'unauthenticated' }
        },
        authenticated: {
          on: { LOGOUT: 'unauthenticated' }
        }
      }
    });

    expect(appState).toBeDefined();
    expect(authMachine).toBeDefined();
    expect(appState.value().isAuthenticated).toBe(false);
  });

  it('should integrate routing with state management', () => {
    // Create route config
    const routeConfig = createRouteConfig('./src/pages');
    
    // Create router
    const router = createRouter(routeConfig);
    
    // Create app state
    const appState = createReactiveState({
      currentRoute: '/',
      navigationHistory: []
    });

    expect(router).toBeDefined();
    expect(appState).toBeDefined();
    expect(appState.value().currentRoute).toBe('/');
  });

  it('should integrate data fetching with state management', () => {
    // Create data fetcher
    const dataFetcher = createDataFetcher();
    
    // Create app state
    const appState = createReactiveState({
      data: null,
      loading: false,
      error: null
    });

    expect(dataFetcher).toBeDefined();
    expect(appState).toBeDefined();
    expect(appState.value().loading).toBe(false);
  });

  it('should handle complete workflow', () => {
    // Create all systems
    const appState = createReactiveState({
      user: null,
      currentRoute: '/',
      data: null
    });

    const authMachine = createStateMachine({
      initial: 'unauthenticated',
      states: {
        unauthenticated: { on: { LOGIN: 'authenticated' } },
        authenticated: { on: { LOGOUT: 'unauthenticated' } }
      }
    });

    const routeConfig = createRouteConfig('./src/pages');
    const router = createRouter(routeConfig);
    const dataFetcher = createDataFetcher();

    // Test integration
    expect(appState).toBeDefined();
    expect(authMachine).toBeDefined();
    expect(router).toBeDefined();
    expect(dataFetcher).toBeDefined();
  });
});
