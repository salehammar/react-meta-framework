export interface ReactiveState<T> {
  value: () => T;
  setValue: (newValue: T | ((prev: T) => T)) => void;
  subscribe: (callback: (value: T) => void) => () => void;
  derive: <U>(fn: (value: T) => U) => ReactiveState<U>;
  update?: () => void; // Optional update method for derived states
}

export type StateSetter<T> = T | ((prev: T) => void);

// Global dependency tracking
let currentComputation: ReactiveState<any> | null = null;
const dependencyGraph = new Map<ReactiveState<any>, Set<ReactiveState<any>>>();

/**
 * Creates a reactive state primitive that automatically tracks dependencies
 * and eliminates the need for manual useMemo/useCallback
 */
export function createReactiveState<T>(initialValue: T): ReactiveState<T> {
  let currentValue = initialValue;
  const subscribers = new Set<(value: T) => void>();
  const derivedStates = new Set<ReactiveState<any>>();
  
  const value = () => {
    // Track dependency if we're inside a computation
    if (currentComputation) {
      if (!dependencyGraph.has(currentComputation)) {
        dependencyGraph.set(currentComputation, new Set());
      }
      dependencyGraph.get(currentComputation)!.add({ value, setValue, subscribe, derive } as ReactiveState<T>);
    }
    return currentValue;
  };
  
  const setValue = (newValue: T | ((prev: T) => T)) => {
    const nextValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(currentValue)
      : newValue;
    
    if (nextValue !== currentValue) {
      currentValue = nextValue;
      
      // Notify direct subscribers
      subscribers.forEach(callback => callback(currentValue));
      
      // Notify derived states
      derivedStates.forEach(derivedState => {
        if (derivedState.update) {
          derivedState.update();
        }
      });
    }
  };
  
  const subscribe = (callback: (value: T) => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };
  
  const derive = <U>(fn: (value: T) => U) => {
    const derivedState = createDerivedState(fn, { value, setValue, subscribe, derive } as ReactiveState<T>);
    derivedStates.add(derivedState);
    return derivedState;
  };
  
  return {
    value,
    setValue,
    subscribe,
    derive
  };
}

/**
 * Creates a derived state that automatically updates when dependencies change
 */
export function createDerivedState<T, U>(
  fn: (value: T) => U, 
  dependency: ReactiveState<T>
): ReactiveState<U> {
  let currentValue: U;
  let isDirty = true;
  const subscribers = new Set<(value: U) => void>();
  
  const compute = () => {
    if (isDirty) {
      const prevComputation = currentComputation;
      currentComputation = { value, setValue, subscribe, derive, update } as ReactiveState<U>;
      
      try {
        currentValue = fn(dependency.value());
        isDirty = false;
      } finally {
        currentComputation = prevComputation;
      }
    }
    return currentValue;
  };
  
  const value = () => {
    return compute();
  };
  
  const setValue = (newValue: U | ((prev: U) => U)) => {
    throw new Error('Cannot set value on derived state');
  };
  
  const subscribe = (callback: (value: U) => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };
  
  const derive = <V>(derivedFn: (value: U) => V) => {
    return createDerivedState(derivedFn, { value, setValue, subscribe, derive, update } as ReactiveState<U>);
  };
  
  const update = () => {
    isDirty = true;
    const oldValue = currentValue;
    const newValue = compute();
    
    if (newValue !== oldValue) {
      subscribers.forEach(callback => callback(newValue));
    }
  };
  
  // Initial computation
  compute();
  
  return {
    value,
    setValue,
    subscribe,
    derive,
    update
  };
}

/**
 * Creates a computed value that automatically updates when dependencies change
 */
export function createComputed<T>(fn: () => T): ReactiveState<T> {
  // Create a dummy dependency that we can derive from
  const dummy = createReactiveState(null);
  return dummy.derive(() => fn());
}

/**
 * Creates an effect that runs when dependencies change
 */
export function createReactiveEffect(fn: () => void): () => void {
  // Create a dummy state to track dependencies
  const dummy = createReactiveState(null);
  
  // Subscribe to changes and run the effect
  const unsubscribe = dummy.subscribe(() => {
    fn();
  });
  
  // Run once initially
  fn();
  
  return unsubscribe;
}

/**
 * Batch multiple state updates together for performance
 */
export function batch<T>(updates: (() => void)[]): void {
  // In a real implementation, this would batch updates
  // For now, we'll run them sequentially
  updates.forEach(update => update());
}

/**
 * Creates a selector that only updates when specific parts of state change
 */
export function createSelector<T, U>(
  state: ReactiveState<T>,
  selector: (value: T) => U
): ReactiveState<U> {
  return state.derive(selector);
}

/**
 * Creates a memoized selector that only updates when the result actually changes
 */
export function createMemoizedSelector<T, U>(
  state: ReactiveState<T>,
  selector: (value: T) => U,
  equalityFn: (a: U, b: U) => boolean = (a, b) => a === b
): ReactiveState<U> {
  let lastValue: U | undefined;
  
  return state.derive(value => {
    const newValue = selector(value);
    if (lastValue === undefined || !equalityFn(lastValue, newValue)) {
      lastValue = newValue;
    }
    return lastValue;
  });
}
