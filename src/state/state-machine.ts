export interface StateTransition<T extends string, E extends string> {
  from: T;
  to: T;
  event: E;
  guard?: (context: any) => boolean;
  action?: (context: any) => void;
}

export interface StateMachine<T extends string, E extends string, C = any> {
  currentState: T;
  context: C;
  can: (event: E) => boolean;
  send: (event: E, payload?: any) => void;
  subscribe: (callback: (state: T, context: C) => void) => () => void;
  reset: () => void;
}

/**
 * Creates a state machine with automatic state transitions and guards
 */
export function createStateMachine<T extends string, E extends string, C = any>(
  initialState: T,
  initialContext: C,
  transitions: StateTransition<T, E>[],
  onStateChange?: (from: T, to: T, context: C) => void
): StateMachine<T, E, C> {
  let currentState = initialState;
  let context = initialContext;
  const subscribers = new Set<(state: T, context: C) => void>();
  
  const can = (event: E): boolean => {
    return transitions.some(t => 
      t.from === currentState && 
      t.event === event && 
      (!t.guard || t.guard(context))
    );
  };
  
  const send = (event: E, payload?: any) => {
    const transition = transitions.find(t => 
      t.from === currentState && 
      t.event === event
    );
    
    if (!transition) {
      throw new Error(`Cannot send event '${event}' from state '${currentState}'`);
    }
    
    if (transition.guard && !transition.guard(context)) {
      throw new Error(`Guard failed for event '${event}' from state '${currentState}'`);
    }
    
    const fromState = currentState;
    currentState = transition.to;
    
    if (transition.action) {
      transition.action(context);
    }
    
    if (onStateChange) {
      onStateChange(fromState, currentState, context);
    }
    
    // Notify subscribers
    subscribers.forEach(callback => callback(currentState, context));
  };
  
  const subscribe = (callback: (state: T, context: C) => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };
  
  const reset = () => {
    currentState = initialState;
    context = initialContext;
    subscribers.forEach(callback => callback(currentState, context));
  };
  
  return {
    get currentState() { return currentState; },
    get context() { return context; },
    can,
    send,
    subscribe,
    reset
  };
}

/**
 * Creates a simple toggle state machine
 */
export function createToggleMachine(initialState: boolean = false) {
  return createStateMachine<'on' | 'off', 'toggle', boolean>(
    initialState ? 'on' : 'off',
    initialState,
    [
      { from: 'off', to: 'on', event: 'toggle' },
      { from: 'on', to: 'off', event: 'toggle' }
    ]
  );
}

/**
 * Creates a loading state machine
 */
export function createLoadingMachine() {
  return createStateMachine<'idle' | 'loading' | 'success' | 'error', 'start' | 'complete' | 'error', any>(
    'idle',
    {},
    [
      { from: 'idle', to: 'loading', event: 'start' },
      { from: 'loading', to: 'success', event: 'complete' },
      { from: 'loading', to: 'error', event: 'error' },
      { from: 'success', to: 'idle', event: 'start' },
      { from: 'error', to: 'idle', event: 'start' }
    ]
  );
}
