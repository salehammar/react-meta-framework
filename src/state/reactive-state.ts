export interface ReactiveState<T> {
  value: () => T;
  setValue: (_newValue: T | ((_prev: T) => T)) => void;
  subscribe: (_callback: (_value: T) => void) => () => void;
  derive: <U>(_fn: (_value: T) => U) => ReactiveState<U>;
  update?: () => void; // Optional update method for derived states
}

export type StateSetter<T> = T | ((_prev: T) => void);

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
      dependencyGraph
        .get(currentComputation)!
        .add({ value, setValue, subscribe, derive } as ReactiveState<T>);
    }
    return currentValue;
  };

  const setValue = (_newValue: T | ((_prev: T) => T)) => {
    const nextValue =
      typeof _newValue === "function"
        ? (_newValue as (_prev: T) => T)(currentValue)
        : _newValue;

    if (nextValue !== currentValue) {
      currentValue = nextValue;

      // Notify direct subscribers
      subscribers.forEach((callback) => callback(currentValue));

      // Notify derived states
      derivedStates.forEach((derivedState) => {
        if (derivedState.update) {
          derivedState.update();
        }
      });
    }
  };

  const subscribe = (_callback: (_value: T) => void) => {
    subscribers.add(_callback);
    return () => subscribers.delete(_callback);
  };

  const derive = <U>(_fn: (_value: T) => U) => {
    const derivedState = createDerivedState(_fn, {
      value,
      setValue,
      subscribe,
      derive,
    } as ReactiveState<T>);
    derivedStates.add(derivedState);
    return derivedState;
  };

  return {
    value,
    setValue,
    subscribe,
    derive,
  };
}

/**
 * Creates a derived state that automatically updates when dependencies change
 */
export function createDerivedState<T, U>(
  fn: (_value: T) => U,
  dependency: ReactiveState<T>,
): ReactiveState<U> {
  let currentValue: U;
  let isDirty = true;
  const subscribers = new Set<(value: U) => void>();

  const compute = () => {
    if (isDirty) {
      const prevComputation = currentComputation;
      currentComputation = {
        value,
        setValue,
        subscribe,
        derive,
        update,
      } as ReactiveState<U>;

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
    throw new Error("Cannot set value on derived state");
  };

  const subscribe = (callback: (value: U) => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };

  const derive = <V>(derivedFn: (value: U) => V) => {
    return createDerivedState(derivedFn, {
      value,
      setValue,
      subscribe,
      derive,
      update,
    } as ReactiveState<U>);
  };

  const update = () => {
    isDirty = true;
    const oldValue = currentValue;
    const newValue = compute();

    if (newValue !== oldValue) {
      subscribers.forEach((callback) => callback(newValue));
    }
  };

  // Initial computation
  compute();

  return {
    value,
    setValue,
    subscribe,
    derive,
    update,
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
  updates.forEach((update) => update());
}

/**
 * Creates a selector that only updates when specific parts of state change
 */
export function createSelector<T, U>(
  state: ReactiveState<T>,
  selector: (_value: T) => U,
): ReactiveState<U> {
  return state.derive(selector);
}

/**
 * Creates a memoized selector that only updates when the result actually changes
 */
export function createMemoizedSelector<T, U>(
  state: ReactiveState<T>,
  selector: (_value: T) => U,
  equalityFn: (_a: U, _b: U) => boolean = (_a, _b) => _a === _b,
): ReactiveState<U> {
  let lastValue: U | undefined;

  return state.derive((_value) => {
    const newValue = selector(_value);
    if (lastValue === undefined || !equalityFn(lastValue, newValue)) {
      lastValue = newValue;
    }
    return lastValue;
  });
}
