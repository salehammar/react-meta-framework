# Todo App Example 📝

A comprehensive todo application built with React Meta Framework that demonstrates reactive state management, state machines, and best practices.

## 🎯 Features

- **Reactive State Management**: Automatic dependency tracking
- **State Machines**: Complex state transitions for todo operations
- **Derived State**: Computed values for filtering and statistics
- **Performance Optimizations**: Memoized selectors and batching
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling

## 🚀 Getting Started

```bash
# Create the todo app
npx react-meta create todo-app --template typescript

# Navigate to the project
cd todo-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
todo-app/
├── src/
│   ├── components/
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoForm.tsx
│   │   ├── TodoFilters.tsx
│   │   └── TodoStats.tsx
│   ├── stores/
│   │   └── todo-store.ts
│   ├── types/
│   │   └── todo.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## 🧠 State Management

### Todo Store

```tsx
// stores/todo-store.ts
import { createReactiveState, createStateMachine, createMemoizedSelector } from 'react-meta-framework';
import type { Todo, TodoFilter } from '../types/todo';

// Todo state machine
const todoMachine = createStateMachine('idle', {}, [
  { from: 'idle', to: 'loading', event: 'fetch' },
  { from: 'loading', to: 'success', event: 'resolve' },
  { from: 'loading', to: 'error', event: 'reject' },
  { from: 'success', to: 'loading', event: 'refetch' },
  { from: 'error', to: 'loading', event: 'retry' }
]);

// Reactive state
export const todoStore = {
  todos: createReactiveState<Todo[]>([]),
  filter: createReactiveState<TodoFilter>('all'),
  search: createReactiveState(''),
  isLoading: createReactiveState(false),
  error: createReactiveState<string | null>(null)
};

// Memoized selectors
export const todoSelectors = {
  // Filtered todos
  filteredTodos: createMemoizedSelector(
    [todoStore.todos, todoStore.filter, todoStore.search],
    (todos, filter, search) => {
      let filtered = todos;
      
      // Apply filter
      if (filter === 'active') {
        filtered = filtered.filter(todo => !todo.completed);
      } else if (filter === 'completed') {
        filtered = filtered.filter(todo => todo.completed);
      }
      
      // Apply search
      if (search) {
        filtered = filtered.filter(todo => 
          todo.text.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      return filtered;
    }
  ),
  
  // Statistics
  stats: createMemoizedSelector(todoStore.todos, todos => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, completed, active, completionRate };
  }),
  
  // Has todos
  hasTodos: createMemoizedSelector(todoStore.todos, todos => todos.length > 0),
  
  // All completed
  allCompleted: createMemoizedSelector(todoStore.todos, todos => 
    todos.length > 0 && todos.every(todo => todo.completed)
  )
};

// Actions
export const todoActions = {
  // Add todo
  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    todoStore.todos.setValue(prev => [...prev, newTodo]);
  },
  
  // Toggle todo
  toggleTodo: (id: string) => {
    todoStore.todos.setValue(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  },
  
  // Update todo
  updateTodo: (id: string, text: string) => {
    todoStore.todos.setValue(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, text: text.trim() }
          : todo
      )
    );
  },
  
  // Delete todo
  deleteTodo: (id: string) => {
    todoStore.todos.setValue(prev => 
      prev.filter(todo => todo.id !== id)
    );
  },
  
  // Clear completed
  clearCompleted: () => {
    todoStore.todos.setValue(prev => 
      prev.filter(todo => !todo.completed)
    );
  },
  
  // Toggle all
  toggleAll: () => {
    const allCompleted = todoSelectors.allCompleted();
    todoStore.todos.setValue(prev => 
      prev.map(todo => ({ ...todo, completed: !allCompleted }))
    );
  },
  
  // Set filter
  setFilter: (filter: TodoFilter) => {
    todoStore.filter.setValue(filter);
  },
  
  // Set search
  setSearch: (search: string) => {
    todoStore.search.setValue(search);
  }
};
```

### Todo Types

```tsx
// types/todo.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}
```

## 🎨 Components

### Todo List Component

```tsx
// components/TodoList.tsx
import React from 'react';
import { TodoItem } from './TodoItem';
import { todoSelectors, todoActions } from '../stores/todo-store';

export function TodoList() {
  const todos = todoSelectors.filteredTodos();
  const hasTodos = todoSelectors.hasTodos();
  const allCompleted = todoSelectors.allCompleted();
  
  if (!hasTodos) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No todos yet. Add one to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {/* Toggle all */}
      <div className="flex items-center px-4 py-2 border-b">
        <input
          type="checkbox"
          checked={allCompleted}
          onChange={todoActions.toggleAll}
          className="mr-3"
        />
        <span className="text-sm text-gray-600">
          Toggle all ({todos.length} items)
        </span>
      </div>
      
      {/* Todo items */}
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

### Todo Item Component

```tsx
// components/TodoItem.tsx
import React, { useState } from 'react';
import { Todo } from '../types/todo';
import { todoActions } from '../stores/todo-store';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  
  const handleToggle = () => {
    todoActions.toggleTodo(todo.id);
  };
  
  const handleDelete = () => {
    todoActions.deleteTodo(todo.id);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };
  
  const handleSave = () => {
    if (editText.trim()) {
      todoActions.updateTodo(todo.id, editText);
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  return (
    <div className="flex items-center px-4 py-3 border-b hover:bg-gray-50">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="mr-3"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <span 
          className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
          onDoubleClick={handleEdit}
        >
          {todo.text}
        </span>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={handleEdit}
          className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
```

### Todo Form Component

```tsx
// components/TodoForm.tsx
import React, { useState } from 'react';
import { todoActions } from '../stores/todo-store';

export function TodoForm() {
  const [text, setText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim()) {
      todoActions.addTodo(text);
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </form>
  );
}
```

### Todo Filters Component

```tsx
// components/TodoFilters.tsx
import React from 'react';
import { TodoFilter } from '../types/todo';
import { todoStore, todoActions, todoSelectors } from '../stores/todo-store';

const filters: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' }
];

export function TodoFilters() {
  const currentFilter = todoStore.filter();
  const stats = todoSelectors.stats();
  const hasCompleted = stats.completed > 0;
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="flex space-x-2">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => todoActions.setFilter(filter.value)}
            className={`px-3 py-1 rounded ${
              currentFilter === filter.value
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      {hasCompleted && (
        <button
          onClick={todoActions.clearCompleted}
          className="text-sm text-gray-600 hover:text-red-600"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}
```

### Todo Stats Component

```tsx
// components/TodoStats.tsx
import React from 'react';
import { todoSelectors } from '../stores/todo-store';

export function TodoStats() {
  const stats = todoSelectors.stats();
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-3">Todo Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {stats.completionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Main App Component

```tsx
// App.tsx
import React from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import { TodoStats } from './components/TodoStats';
import { todoStore, todoActions } from './stores/todo-store';

function App() {
  const search = todoStore.search();
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">
              Todo App
            </h1>
            
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => todoActions.setSearch(e.target.value)}
                placeholder="Search todos..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Todo Form */}
            <TodoForm />
            
            {/* Todo Stats */}
            <TodoStats />
            
            {/* Todo List */}
            <TodoList />
            
            {/* Todo Filters */}
            <TodoFilters />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

## 🚀 Key Features Demonstrated

### 1. Reactive State Management
- Automatic dependency tracking with `createReactiveState`
- Derived state with `derive` method
- Memoized selectors with `createMemoizedSelector`

### 2. State Machines
- Complex state transitions for todo operations
- Loading, success, and error states

### 3. Performance Optimizations
- Memoized selectors for expensive computations
- Batching updates for better performance
- Conditional effects

### 4. TypeScript Integration
- Full type safety throughout the application
- Proper interfaces and type definitions

### 5. Modern UI/UX
- Responsive design with Tailwind CSS
- Keyboard shortcuts (Enter to save, Escape to cancel)
- Double-click to edit
- Hover states and transitions

## 🎯 Best Practices

1. **Separation of Concerns**: State logic separated from UI components
2. **Reusable Components**: Modular component architecture
3. **Type Safety**: Full TypeScript integration
4. **Performance**: Memoized selectors and optimized re-renders
5. **User Experience**: Intuitive interactions and feedback

## 🚀 Next Steps

This todo app demonstrates the core concepts of React Meta Framework. Try extending it with:

- **Persistence**: Save todos to localStorage or a backend
- **Categories**: Add todo categories and filtering
- **Due Dates**: Add due dates and reminders
- **Collaboration**: Share todos with other users
- **Offline Support**: Work offline with sync capabilities

---

**Ready to build your own todo app?** 🚀
