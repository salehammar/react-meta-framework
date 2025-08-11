# State Management Guide 🧠

React Meta Framework's reactive state system eliminates the need for manual dependency tracking and provides automatic optimizations. This guide covers everything you need to know about state management.

## 🎯 Overview

The reactive state system is inspired by SolidJS and provides:

- **Automatic Dependency Tracking**: No more manual `useMemo`/`useCallback`
- **Derived State**: Computed values that update automatically
- **Reactive Effects**: Side effects that run when dependencies change
- **Performance Optimizations**: Built-in memoization and batching
- **Cross-Stack Synchronization**: Share state between frontend and backend
- **AI-Powered State Generation**: Create state machines from natural language

## 🚀 Basic Usage

### Creating Reactive State

```tsx
import { createReactiveState } from 'react-meta-framework';

function Counter() {
  // Create reactive state with initial value
  const [count, setCount] = createReactiveState(0);
  
  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Accessing State Values

```tsx
// Read the current value
const currentValue = count();

// Update the value
setCount(42);

// Update based on previous value
setCount(prev => prev + 1);
```

## 🔄 Derived State

Derived state automatically updates when its dependencies change:

```tsx
function UserProfile() {
  const [user, setUser] = createReactiveState({ name: 'John', age: 30 });
  
  // Derived state - automatically updates when user changes
  const displayName = user.derive(u => u.name.toUpperCase());
  const isAdult = user.derive(u => u.age >= 18);
  const greeting = user.derive(u => `Hello, ${u.name}!`);
  
  return (
    <div>
      <h1>{greeting()}</h1>
      <p>Name: {displayName()}</p>
      <p>Age: {user().age}</p>
      <p>Status: {isAdult() ? 'Adult' : 'Minor'}</p>
      
      <button onClick={() => setUser(u => ({ ...u, age: u.age + 1 }))}>
        Have Birthday
      </button>
    </div>
  );
}
```

### Complex Derived State

```tsx
function ShoppingCart() {
  const [items, setItems] = createReactiveState([
    { id: 1, name: 'Product A', price: 10, quantity: 2 },
    { id: 2, name: 'Product B', price: 15, quantity: 1 }
  ]);
  
  // Multiple derived values
  const totalItems = items.derive(items => 
    items.reduce((sum, item) => sum + item.quantity, 0)
  );
  
  const totalPrice = items.derive(items => 
    items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  const hasItems = items.derive(items => items.length > 0);
  
  const averagePrice = items.derive(items => {
    if (items.length === 0) return 0;
    return totalPrice() / totalItems();
  });
  
  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Items: {totalItems()}</p>
      <p>Total: ${totalPrice()}</p>
      <p>Average: ${averagePrice().toFixed(2)}</p>
      
      {hasItems() ? (
        <button onClick={() => setItems([])}>Clear Cart</button>
      ) : (
        <p>Cart is empty</p>
      )}
    </div>
  );
}
```

## ⚡ Reactive Effects

Reactive effects run automatically when their dependencies change:

```tsx
import { createReactiveEffect } from 'react-meta-framework';

function UserTracker() {
  const [user, setUser] = createReactiveState({ id: 1, name: 'John' });
  const [lastSeen, setLastSeen] = createReactiveState(new Date());
  
  // Effect that runs when user changes
  createReactiveEffect(() => {
    console.log(`User changed to: ${user().name}`);
    
    // Update last seen timestamp
    setLastSeen(new Date());
    
    // Analytics tracking
    analytics.track('user_changed', { userId: user().id });
  });
  
  return (
    <div>
      <p>Current User: {user().name}</p>
      <p>Last Seen: {lastSeen().toLocaleTimeString()}</p>
      
      <button onClick={() => setUser({ id: 2, name: 'Jane' })}>
        Switch to Jane
      </button>
    </div>
  );
}
```

## 🎯 Selectors and Memoization

### Creating Selectors

Selectors provide memoized access to specific parts of state:

```tsx
import { createSelector, createMemoizedSelector } from 'react-meta-framework';

function TodoApp() {
  const [todos, setTodos] = createReactiveState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build app', completed: true },
    { id: 3, text: 'Deploy', completed: false }
  ]);
  
  // Simple selector
  const completedTodos = createSelector(todos, todos => 
    todos.filter(todo => todo.completed)
  );
  
  // Memoized selector for expensive computations
  const todoStats = createMemoizedSelector(todos, todos => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, completed, pending, completionRate };
  });
  
  return (
    <div>
      <h2>Todo Stats</h2>
      <p>Total: {todoStats().total}</p>
      <p>Completed: {todoStats().completed}</p>
      <p>Pending: {todoStats().pending}</p>
      <p>Completion Rate: {todoStats().completionRate.toFixed(1)}%</p>
      
      <h3>Completed Todos:</h3>
      <ul>
        {completedTodos().map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🔄 State Machines

State machines help manage complex application states:

```tsx
import { createStateMachine } from 'react-meta-framework';

function DataFetcher() {
  const [data, setData] = createReactiveState(null);
  const [error, setError] = createReactiveState(null);
  
  // Define state machine
  const fetchMachine = createStateMachine('idle', {}, [
    { from: 'idle', to: 'loading', event: 'fetch' },
    { from: 'loading', to: 'success', event: 'resolve' },
    { from: 'loading', to: 'error', event: 'reject' },
    { from: 'success', to: 'loading', event: 'refetch' },
    { from: 'error', to: 'loading', event: 'retry' }
  ]);
  
  const fetchData = async () => {
    fetchMachine.send('fetch');
    setError(null);
    
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      
      setData(result);
      fetchMachine.send('resolve');
    } catch (err) {
      setError(err.message);
      fetchMachine.send('reject');
    }
  };
  
  const retry = () => {
    fetchMachine.send('retry');
    fetchData();
  };
  
  return (
    <div>
      <p>State: {fetchMachine.currentState}</p>
      
      {fetchMachine.currentState === 'idle' && (
        <button onClick={fetchData}>Fetch Data</button>
      )}
      
      {fetchMachine.currentState === 'loading' && (
        <div>Loading...</div>
      )}
      
      {fetchMachine.currentState === 'success' && (
        <div>
          <h3>Data Loaded:</h3>
          <pre>{JSON.stringify(data(), null, 2)}</pre>
          <button onClick={() => fetchMachine.send('refetch')}>
            Refresh
          </button>
        </div>
      )}
      
      {fetchMachine.currentState === 'error' && (
        <div>
          <h3>Error:</h3>
          <p>{error()}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
    </div>
  );
}
```

## 🏪 Global State Management

### Creating Global Stores

```tsx
// stores/app-store.ts
import { createReactiveState } from 'react-meta-framework';

export const appStore = {
  // User state
  user: createReactiveState<{ id: string; name: string } | null>(null),
  
  // Theme state
  theme: createReactiveState<'light' | 'dark'>('light'),
  
  // Navigation state
  currentRoute: createReactiveState<string>('/'),
  
  // Loading states
  isLoading: createReactiveState(false),
  
  // Error state
  error: createReactiveState<string | null>(null)
};

// Store actions
export const storeActions = {
  // User actions
  setUser: (user: { id: string; name: string } | null) => {
    appStore.user.setValue(user);
  },
  
  // Theme actions
  toggleTheme: () => {
    appStore.theme.setValue(prev => prev === 'light' ? 'dark' : 'light');
  },
  
  // Navigation actions
  navigate: (route: string) => {
    appStore.currentRoute.setValue(route);
  },
  
  // Loading actions
  setLoading: (loading: boolean) => {
    appStore.isLoading.setValue(loading);
  },
  
  // Error actions
  setError: (error: string | null) => {
    appStore.error.setValue(error);
  }
};

// Computed values
export const computedValues = {
  isAuthenticated: () => appStore.user() !== null,
  isDarkMode: () => appStore.theme() === 'dark',
  hasError: () => appStore.error() !== null
};
```

### Using Global State

```tsx
// components/Header.tsx
import { appStore, storeActions, computedValues } from '../stores/app-store';

function Header() {
  return (
    <header className={`header ${computedValues.isDarkMode() ? 'dark' : 'light'}`}>
      <h1>My App</h1>
      
      {computedValues.isAuthenticated() ? (
        <div>
          <span>Welcome, {appStore.user()?.name}</span>
          <button onClick={() => storeActions.setUser(null)}>
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => storeActions.setUser({ id: '1', name: 'John' })}>
          Login
        </button>
      )}
      
      <button onClick={storeActions.toggleTheme}>
        Toggle Theme
      </button>
    </header>
  );
}
```

## ⚡ Performance Optimizations

### Batching Updates

```tsx
import { batch } from 'react-meta-framework';

function BatchExample() {
  const [user, setUser] = createReactiveState({ name: 'John', age: 30 });
  const [profile, setProfile] = createReactiveState({ bio: 'Developer' });
  
  const updateUser = () => {
    // Batch multiple updates together
    batch(() => {
      setUser(u => ({ ...u, age: u.age + 1 }));
      setProfile(p => ({ ...p, bio: 'Senior Developer' }));
    });
  };
  
  return (
    <div>
      <p>Name: {user().name}, Age: {user().age}</p>
      <p>Bio: {profile().bio}</p>
      <button onClick={updateUser}>Update User</button>
    </div>
  );
}
```

### Conditional Effects

```tsx
function ConditionalEffect() {
  const [user, setUser] = createReactiveState(null);
  const [shouldTrack, setShouldTrack] = createReactiveState(true);
  
  // Effect only runs when both conditions are met
  createReactiveEffect(() => {
    if (shouldTrack() && user()) {
      analytics.track('user_viewed', { userId: user()?.id });
    }
  });
  
  return (
    <div>
      <button onClick={() => setUser({ id: '1', name: 'John' })}>
        Set User
      </button>
      <button onClick={() => setShouldTrack(!shouldTrack())}>
        Toggle Tracking
      </button>
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Keep State Minimal

```tsx
// ❌ Don't store derived data
const [user, setUser] = createReactiveState({ name: 'John', age: 30 });
const [userDisplayName, setUserDisplayName] = createReactiveState('JOHN');

// ✅ Use derived state instead
const [user, setUser] = createReactiveState({ name: 'John', age: 30 });
const userDisplayName = user.derive(u => u.name.toUpperCase());
```

### 2. Use Memoized Selectors for Expensive Computations

```tsx
// ❌ Expensive computation runs on every render
const expensiveValue = data.derive(items => 
  items.reduce((acc, item) => acc + heavyComputation(item), 0)
);

// ✅ Use memoized selector
const expensiveValue = createMemoizedSelector(data, items => 
  items.reduce((acc, item) => acc + heavyComputation(item), 0)
);
```

### 3. Structure State Logically

```tsx
// ✅ Group related state together
const [todos, setTodos] = createReactiveState([]);
const [todoFilters, setTodoFilters] = createReactiveState({
  status: 'all',
  priority: 'all',
  search: ''
});

// Derived state for filtered todos
const filteredTodos = createMemoizedSelector(
  [todos, todoFilters],
  (todos, filters) => {
    return todos.filter(todo => {
      if (filters.status !== 'all' && todo.status !== filters.status) return false;
      if (filters.priority !== 'all' && todo.priority !== filters.priority) return false;
      if (filters.search && !todo.text.includes(filters.search)) return false;
      return true;
    });
  }
);
```

### 4. Use State Machines for Complex Logic

```tsx
// ✅ Use state machines for complex state transitions
const formMachine = createStateMachine('idle', {}, [
  { from: 'idle', to: 'editing', event: 'edit' },
  { from: 'editing', to: 'saving', event: 'save' },
  { from: 'saving', to: 'success', event: 'resolve' },
  { from: 'saving', to: 'error', event: 'reject' },
  { from: 'success', to: 'idle', event: 'reset' },
  { from: 'error', to: 'editing', event: 'retry' }
]);
```

## 🔧 API Reference

### `createReactiveState<T>(initialValue: T)`

Creates a reactive state with an initial value.

**Returns:**
- `value()`: Function to get current value
- `setValue(newValue: T | (prev: T) => T)`: Function to update value
- `derive<U>(fn: (value: T) => U)`: Create derived state
- `subscribe(callback: (value: T) => void)`: Subscribe to changes

### `createDerivedState<T, U>(fn: (value: T) => U, dependency: ReactiveState<T>)`

Creates derived state that automatically updates when dependencies change.

### `createReactiveEffect(effect: () => void | (() => void))`

Creates a reactive effect that runs when dependencies change.

**Returns:** Cleanup function (optional)

### `createSelector<T, R>(source: ReactiveState<T>, selector: (value: T) => R)`

Creates a selector for accessing specific parts of state.

### `createMemoizedSelector<T, R>(source: ReactiveState<T>, selector: (value: T) => R)`

Creates a memoized selector for expensive computations.

### `batch(updates: () => void)`

Batches multiple state updates together for better performance.

## 🤖 AI-Powered State Management

### Natural Language to State Machines

Generate state machines from natural language descriptions:

```tsx
import { createStateMachineFromPrompt } from 'react-meta-framework';

// Generate a cart state machine
const cartMachine = createStateMachineFromPrompt({
  description: "Cart should handle: guest checkout, logged-in user, and payment failure states",
  complexity: "medium"
});

console.log('Generated States:', cartMachine.states);
console.log('Generated Events:', cartMachine.events);
console.log('Generated Code:', cartMachine.code);
console.log('Suggestions:', cartMachine.suggestions);
```

### Batch State Machine Generation

Generate multiple state machines at once:

```tsx
import { generateMultipleStateMachines } from 'react-meta-framework';

const descriptions = [
  "User authentication flow with login, logout, and password reset",
  "Product search with filters, sorting, and pagination",
  "Order processing with payment, shipping, and delivery tracking"
];

const stateMachines = generateMultipleStateMachines(descriptions);
```

### State Machine Validation

Validate generated state machines:

```tsx
import { validateStateMachine } from 'react-meta-framework';

const validation = validateStateMachine(cartMachine);

if (validation.isValid) {
  console.log('✅ State machine is valid');
} else {
  console.log('❌ Validation errors:', validation.errors);
  console.log('⚠️ Warnings:', validation.warnings);
}
```

## 🌐 Cross-Stack Reactive State

### Shared State Between Frontend and Backend

```tsx
import { useSharedState, createReactiveBackendBinding } from 'react-meta-framework';

// React hook for shared state
function App() {
  const [globalInventory, setInventory] = useSharedState('products', [], {
    type: 'cloudflare-d1',
    realtime: true,
    conflictResolution: 'crdt'
  });

  return (
    <div>
      <p>Global Inventory: {globalInventory.length} items</p>
      <button onClick={() => setInventory(prev => [...prev, newItem])}>
        Add Item
      </button>
    </div>
  );
}

// Direct backend binding
const userBinding = createReactiveBackendBinding('users', [], {
  type: 'postgres',
  realtime: true,
  syncInterval: 3000
});

// Subscribe to changes
userBinding.subscribe(users => {
  console.log('Users updated:', users);
});

// Set value (automatically syncs to backend)
await userBinding.set([...users, newUser]);
```

### Conflict Resolution

Handle conflicts between frontend and backend:

```tsx
// Get current conflicts
const conflicts = userBinding.getConflicts();

conflicts.forEach(conflict => {
  console.log('Conflict detected:');
  console.log('Frontend value:', conflict.frontendValue);
  console.log('Backend value:', conflict.backendValue);
  console.log('Timestamp:', conflict.timestamp);
});

// Resolve conflicts
await userBinding.resolveConflict(conflictId, 'merge');
// Options: 'frontend', 'backend', 'merge'
```

### Batch Backend Operations

```tsx
import { batchBackendOperations } from 'react-meta-framework';

const operations = [
  { key: 'users', value: users, operation: 'set' },
  { key: 'products', value: products, operation: 'set' },
  { key: 'orders', value: orders, operation: 'get' }
];

const results = await batchBackendOperations(operations);

results.forEach(result => {
  if (result.success) {
    console.log(`✅ ${result.key}: ${result.value}`);
  } else {
    console.log(`❌ ${result.key}: ${result.error}`);
  }
});
```

---

**Next:** Learn about [Routing](./routing.md) or [Data Fetching](./data-fetching.md)
