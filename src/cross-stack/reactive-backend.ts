import { createReactiveState } from '../state/reactive-state.js';

export interface BackendConfig {
  type: 'cloudflare-d1' | 'postgres' | 'dynamodb' | 'mongodb' | 'redis';
  connectionString?: string;
  realtime: boolean;
  syncInterval?: number; // milliseconds
  conflictResolution?: 'last-write-wins' | 'crdt' | 'manual';
}

export interface SharedState<T> {
  value: T;
  lastSync: Date;
  isSyncing: boolean;
  conflicts: Array<{
    id: string;
    frontendValue: T;
    backendValue: T;
    timestamp: Date;
    resolved: boolean;
  }>;
}

export interface ReactiveBackendBinding<T> {
  get: () => T;
  set: (value: T) => Promise<void>;
  subscribe: (callback: (value: T) => void) => () => void;
  sync: () => Promise<void>;
  resolveConflict: (conflictId: string, resolution: 'frontend' | 'backend' | 'merge') => Promise<void>;
  getConflicts: () => Array<{
    id: string;
    frontendValue: T;
    backendValue: T;
    timestamp: Date;
    resolved: boolean;
  }>;
}

/**
 * Creates reactive backend bindings for shared state across frontend + backend
 * Supports real-time synchronization and conflict resolution
 */
export function createReactiveBackendBinding<T>(
  key: string,
  initialValue: T,
  config: BackendConfig
): ReactiveBackendBinding<T> {
  // Local reactive state
  const localState = createReactiveState<SharedState<T>>({
    value: initialValue,
    lastSync: new Date(),
    isSyncing: false,
    conflicts: []
  });
  
  // Backend connection (simulated for now)
  const backendConnection = createBackendConnection(config);
  
  // Sync state with backend
  const syncWithBackend = async (): Promise<void> => {
    try {
      localState.setValue(prev => ({ ...prev, isSyncing: true }));
      
      // Fetch from backend
      const backendValue = await backendConnection.get(key);
      
      if (backendValue !== undefined) {
        const currentValue = localState.value().value;
        
        // Check for conflicts
        if (backendValue !== currentValue && localState.value().lastSync > new Date(0)) {
          const conflict = {
            id: `${key}-${Date.now()}`,
            frontendValue: currentValue,
            backendValue,
            timestamp: new Date(),
            resolved: false
          };
          
          localState.setValue(prev => ({
            ...prev,
            conflicts: [...prev.conflicts, conflict]
          }));
        } else {
          // No conflict, update local state
          localState.setValue(prev => ({
            ...prev,
            value: backendValue,
            lastSync: new Date(),
            isSyncing: false
          }));
        }
      }
    } catch (error) {
      console.error('Backend sync failed:', error);
    } finally {
      localState.setValue(prev => ({ ...prev, isSyncing: false }));
    }
  };
  
  // Set value locally and sync to backend
  const setValue = async (value: T): Promise<void> => {
    // Update local state immediately
    localState.setValue(prev => ({ ...prev, value }));
    
    // Sync to backend
    try {
      await backendConnection.set(key, value);
      localState.setValue(prev => ({ ...prev, lastSync: new Date() }));
    } catch (error) {
      console.error('Backend set failed:', error);
      // Could implement retry logic here
    }
  };
  
  // Subscribe to changes
  const subscribe = (callback: (value: T) => void) => {
    return localState.subscribe(state => callback(state.value));
  };
  
  // Resolve a conflict
  const resolveConflict = async (
    conflictId: string,
    resolution: 'frontend' | 'backend' | 'merge'
  ): Promise<void> => {
    const currentState = localState.value();
    const conflict = currentState.conflicts.find(c => c.id === conflictId);
    
    if (!conflict) return;
    
    let resolvedValue: T;
    
    switch (resolution) {
      case 'frontend':
        resolvedValue = conflict.frontendValue;
        break;
      case 'backend':
        resolvedValue = conflict.backendValue;
        break;
      case 'merge':
        resolvedValue = mergeValues(conflict.frontendValue, conflict.backendValue);
        break;
      default:
        throw new Error(`Unknown resolution: ${resolution}`);
    }
    
    // Update local state
    localState.setValue(prev => ({
      ...prev,
      value: resolvedValue,
      conflicts: prev.conflicts.map(c => 
        c.id === conflictId ? { ...c, resolved: true } : c
      )
    }));
    
    // Sync resolved value to backend
    await setValue(resolvedValue);
  };
  
  // Get current conflicts
  const getConflicts = () => {
    return localState.value().conflicts.filter(c => !c.resolved);
  };
  
  // Initialize real-time sync if enabled
  if (config.realtime) {
    const syncInterval = config.syncInterval || 5000; // Default 5 seconds
    
    setInterval(() => {
      if (!localState.value().isSyncing) {
        syncWithBackend();
      }
    }, syncInterval);
  }
  
  // Initial sync
  syncWithBackend();
  
  return {
    get: () => localState.value().value,
    set: setValue,
    subscribe,
    sync: syncWithBackend,
    resolveConflict,
    getConflicts
  };
}

/**
 * Creates a backend connection based on configuration
 */
function createBackendConnection(config: BackendConfig) {
  // Simulated backend connections
  // In a real implementation, these would connect to actual databases
  
  const connections: Record<string, Map<string, any>> = {
    'cloudflare-d1': new Map(),
    'postgres': new Map(),
    'dynamodb': new Map(),
    'mongodb': new Map(),
    'redis': new Map()
  };
  
  const connection = connections[config.type] || connections['cloudflare-d1'];
  
  return {
    async get(key: string): Promise<any> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 50));
      return connection.get(key);
    },
    
    async set(key: string, value: any): Promise<void> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      connection.set(key, value);
    }
  };
}

/**
 * Merges two values (simple implementation)
 */
function mergeValues<T>(frontend: T, backend: T): T {
  if (typeof frontend === 'object' && typeof backend === 'object') {
    if (Array.isArray(frontend) && Array.isArray(backend)) {
      // Merge arrays
      return [...new Set([...frontend, ...backend])] as T;
    } else if (frontend && backend && !Array.isArray(frontend) && !Array.isArray(backend)) {
      // Merge objects
      return { ...backend, ...frontend } as T;
    }
  }
  
  // Default to frontend value
  return frontend;
}

/**
 * Creates a shared state hook for React components
 */
export function useSharedState<T>(
  key: string,
  initialValue: T,
  config: BackendConfig
): [T, (value: T) => Promise<void>, {
  isSyncing: boolean;
  conflicts: Array<any>;
  resolveConflict: (conflictId: string, resolution: 'frontend' | 'backend' | 'merge') => Promise<void>;
  sync: () => Promise<void>;
}] {
  const binding = createReactiveBackendBinding(key, initialValue, config);
  
  // This would integrate with React's useState in a real implementation
  // For now, we'll return the binding interface
  
  return [
    binding.get(),
    binding.set,
    {
      isSyncing: false, // Would be reactive in React
      conflicts: binding.getConflicts(),
      resolveConflict: binding.resolveConflict,
      sync: binding.sync
    }
  ];
}

/**
 * Batch multiple backend operations
 */
export async function batchBackendOperations<T>(
  operations: Array<{ key: string; value: T; operation: 'get' | 'set' }>
): Promise<Array<{ key: string; value: T; success: boolean; error?: string }>> {
  const results = [];
  
  for (const op of operations) {
    try {
      if (op.operation === 'get') {
        // Simulate get operation
        const value = await new Promise<T>(resolve => 
          setTimeout(() => resolve(op.value as T), 50)
        );
        results.push({ key: op.key, value, success: true });
      } else {
        // Simulate set operation
        await new Promise(resolve => setTimeout(resolve, 100));
        results.push({ key: op.key, value: op.value, success: true });
      }
    } catch (error) {
      results.push({ 
        key: op.key, 
        value: op.value, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  
  return results;
}

/**
 * Create a reactive backend binding with CRDT support
 */
export function createCRDTBackendBinding<T>(
  key: string,
  initialValue: T,
  config: BackendConfig
): ReactiveBackendBinding<T> {
  // CRDT implementation would go here
  // For now, we'll use the standard binding
  return createReactiveBackendBinding(key, initialValue, {
    ...config,
    conflictResolution: 'crdt'
  });
}
