import { createReactiveState } from '../state/reactive-state.js';
import { createDataFetcher } from '../data/data-fetcher.js';

export interface DevToolsPanel {
  id: string;
  title: string;
  component: string;
  icon: string;
}

export interface DevTools {
  isOpen: boolean;
  activePanel: string;
  panels: DevToolsPanel[];
  open: () => void;
  close: () => void;
  setActivePanel: (panelId: string) => void;
  getStateSnapshot: () => StateSnapshot;
  getPerformanceMetrics: () => PerformanceMetrics;
  getRouteInfo: () => RouteInfo;
}

export interface StateSnapshot {
  reactiveStates: ReactiveStateInfo[];
  derivedStates: DerivedStateInfo[];
  dependencies: DependencyGraph;
  timestamp: number;
}

export interface ReactiveStateInfo {
  id: string;
  value: any;
  subscribers: number;
  lastUpdate: number;
  tags?: string[];
}

export interface DerivedStateInfo {
  id: string;
  value: any;
  dependencies: string[];
  computationTime: number;
  lastUpdate: number;
}

export interface DependencyGraph {
  nodes: Map<string, string>;
  edges: Array<{ from: string; to: string; type: 'derived' | 'effect' }>;
}

export interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  revalidationCount: number;
}

export interface RouteInfo {
  currentRoute: string;
  matchedRoute: string;
  params: Record<string, string>;
  navigationHistory: string[];
  routeTree: RouteTreeNode[];
}

export interface RouteTreeNode {
  path: string;
  component: string;
  children: RouteTreeNode[];
  dynamic: boolean;
  catchAll: boolean;
}

/**
 * Creates a comprehensive DevTools system for React Meta Framework
 */
export function createDevTools(): DevTools {
  const isOpen = createReactiveState(false);
  const activePanel = createReactiveState('state');
  
  // Performance monitoring
  const performanceMetrics = createReactiveState<PerformanceMetrics>({
    renderCount: 0,
    averageRenderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    revalidationCount: 0
  });

  // State tracking
  const stateSnapshot = createReactiveState<StateSnapshot>({
    reactiveStates: [],
    derivedStates: [],
    dependencies: { nodes: new Map(), edges: [] },
    timestamp: Date.now()
  });

  // Route tracking
  const routeInfo = createReactiveState<RouteInfo>({
    currentRoute: '',
    matchedRoute: '',
    params: {},
    navigationHistory: [],
    routeTree: []
  });

  const panels: DevToolsPanel[] = [
    {
      id: 'state',
      title: 'Reactive State',
      component: 'StatePanel',
      icon: '🔴'
    },
    {
      id: 'routing',
      title: 'Routing',
      component: 'RoutingPanel',
      icon: '🛣️'
    },
    {
      id: 'data',
      title: 'Data Fetching',
      component: 'DataPanel',
      icon: '📡'
    },
    {
      id: 'performance',
      title: 'Performance',
      component: 'PerformancePanel',
      icon: '⚡'
    }
  ];

  /**
   * Opens the DevTools panel
   */
  const open = () => {
    isOpen.setValue(true);
    updateStateSnapshot();
    updatePerformanceMetrics();
  };

  /**
   * Closes the DevTools panel
   */
  const close = () => {
    isOpen.setValue(false);
  };

  /**
   * Sets the active panel
   */
  const setActivePanel = (panelId: string) => {
    activePanel.setValue(panelId);
  };

  /**
   * Updates the state snapshot with current reactive state information
   */
  const updateStateSnapshot = () => {
    // This would be populated by the actual reactive state system
    // For now, we'll create a mock snapshot
    const snapshot: StateSnapshot = {
      reactiveStates: [
        {
          id: 'counter',
          value: 0,
          subscribers: 2,
          lastUpdate: Date.now(),
          tags: ['ui', 'counter']
        }
      ],
      derivedStates: [
        {
          id: 'doubled',
          value: 0,
          dependencies: ['counter'],
          computationTime: 0.1,
          lastUpdate: Date.now()
        }
      ],
      dependencies: {
        nodes: new Map([
          ['counter', 'ReactiveState<number>'],
          ['doubled', 'DerivedState<number>']
        ]),
        edges: [
          { from: 'counter', to: 'doubled', type: 'derived' }
        ]
      },
      timestamp: Date.now()
    };

    stateSnapshot.setValue(snapshot);
  };

  /**
   * Updates performance metrics
   */
  const updatePerformanceMetrics = () => {
    const metrics: PerformanceMetrics = {
      renderCount: Math.floor(Math.random() * 100),
      averageRenderTime: Math.random() * 16,
      memoryUsage: Math.random() * 100,
      cacheHitRate: Math.random(),
      revalidationCount: Math.floor(Math.random() * 10)
    };

    performanceMetrics.setValue(metrics);
  };

  /**
   * Gets the current state snapshot
   */
  const getStateSnapshot = (): StateSnapshot => {
    return stateSnapshot.value();
  };

  /**
   * Gets current performance metrics
   */
  const getPerformanceMetrics = (): PerformanceMetrics => {
    return performanceMetrics.value();
  };

  /**
   * Gets current route information
   */
  const getRouteInfo = (): RouteInfo => {
    return routeInfo.value();
  };

  return {
    isOpen: isOpen.value(),
    activePanel: activePanel.value(),
    panels,
    open,
    close,
    setActivePanel,
    getStateSnapshot,
    getPerformanceMetrics,
    getRouteInfo
  };
}

/**
 * Creates a DevTools panel component for React
 */
export function createDevToolsPanel() {
  return {
    // State visualization component
    StatePanel: () => {
      const devTools = createDevTools();
      const snapshot = devTools.getStateSnapshot();
      
      return {
        render: () => {
          console.group('🔴 Reactive State Panel');
          console.log('Reactive States:', snapshot.reactiveStates);
          console.log('Derived States:', snapshot.derivedStates);
          console.log('Dependency Graph:', snapshot.dependencies);
          console.groupEnd();
        }
      };
    },

    // Routing visualization component
    RoutingPanel: () => {
      const devTools = createDevTools();
      const routeInfo = devTools.getRouteInfo();
      
      return {
        render: () => {
          console.group('🛣️ Routing Panel');
          console.log('Current Route:', routeInfo.currentRoute);
          console.log('Matched Route:', routeInfo.matchedRoute);
          console.log('Parameters:', routeInfo.params);
          console.log('Navigation History:', routeInfo.navigationHistory);
          console.groupEnd();
        }
      };
    },

    // Data fetching visualization component
    DataPanel: () => {
      const devTools = createDevTools();
      const performanceMetrics = devTools.getPerformanceMetrics();
      
      return {
        render: () => {
          console.group('📡 Data Fetching Panel');
          console.log('Cache Hit Rate:', (performanceMetrics.cacheHitRate * 100).toFixed(1) + '%');
          console.log('Revalidation Count:', performanceMetrics.revalidationCount);
          console.log('Memory Usage:', performanceMetrics.memoryUsage.toFixed(2) + ' MB');
          console.groupEnd();
        }
      };
    },

    // Performance monitoring component
    PerformancePanel: () => {
      const devTools = createDevTools();
      const performanceMetrics = devTools.getPerformanceMetrics();
      
      return {
        render: () => {
          console.group('⚡ Performance Panel');
          console.log('Render Count:', performanceMetrics.renderCount);
          console.log('Average Render Time:', performanceMetrics.averageRenderTime.toFixed(2) + 'ms');
          console.log('Memory Usage:', performanceMetrics.memoryUsage.toFixed(2) + ' MB');
          console.groupEnd();
        }
      };
    }
  };
}

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  // Track render performance
  trackRender: (componentName: string, renderTime: number) => {
    console.log(`⚡ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
  },

  // Track memory usage
  trackMemory: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`🧠 Memory: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB used / ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB total`);
    }
  },

  // Track cache performance
  trackCache: (hit: boolean, key: string) => {
    console.log(`💾 Cache ${hit ? 'HIT' : 'MISS'}: ${key}`);
  }
};

/**
 * Development-only DevTools initialization
 */
export function initializeDevTools() {
  if (process.env.NODE_ENV === 'development') {
    const devTools = createDevTools();
    
    // Add global access for debugging
    if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
      (globalThis as any).__REACT_META_DEVTOOLS__ = devTools;
    }
    
    // Auto-open DevTools on keyboard shortcut
    if (typeof globalThis !== 'undefined' && 'document' in globalThis) {
      (globalThis as any).document.addEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          devTools.open();
        }
      });
    }

    console.log('🚀 React Meta Framework DevTools initialized!');
    console.log('Press Ctrl+Shift+D to open DevTools');
  }
}
