# Getting Started with React Meta Framework 🚀

React Meta Framework is a batteries-included meta-framework for React that eliminates ecosystem fragmentation and complexity. This guide will help you get up and running quickly.

## 🎯 What is React Meta Framework?

React Meta Framework is a **revolutionary batteries-included meta-framework** that eliminates React's ecosystem fragmentation and complexity. It provides:

- **🧠 Reactive State System**: Automatic dependency tracking without manual `useMemo`/`useCallback`
- **🔄 State Machines**: Native statechart functionality for complex logic
- **⚡ Zero-Config Performance**: Compiler-driven optimizations
- **🛣️ Filesystem Routing**: Automatic route generation
- **📡 Smart Data Fetching**: Automatic SSR/SSG/ISR strategy selection
- **🛠️ DevTools Integration**: Built-in debugging and performance monitoring
- **🤖 AI-Assisted Code Generation**: Generate code from designs and APIs
- **🧠 Enhanced AI Features**: Natural language to state machines, real-time performance profiling
- **⚡ Advanced Compiler**: Context-aware transforms and bundle physics engine
- **🌐 Cross-Stack Reactive Unification**: Shared state across frontend and backend

## 🚀 Quick Start

### 1. Create a New Project

```bash
# Create a new project with default template
npx react-meta create my-app

# Create with specific template
npx react-meta create my-ecommerce --template ecommerce
npx react-meta create my-dashboard --template dashboard

# Navigate to your project
cd my-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## 📚 Core Concepts

### Reactive State Management

React Meta Framework's reactive state system eliminates the need for manual dependency tracking:

```tsx
import { createReactiveState } from 'react-meta-framework';

function Counter() {
  // Create reactive state
  const [count, setCount] = createReactiveState(0);
  
  // Derived state - automatically updates when count changes
  const doubled = count.derive(value => value * 2);
  const isEven = count.derive(value => value % 2 === 0);
  
  return (
    <div>
      <p>Count: {count()}</p>
      <p>Doubled: {doubled()}</p>
      <p>Is Even: {isEven() ? 'Yes' : 'No'}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### AI-Assisted Development

Generate state machines from natural language descriptions:

```tsx
import { createStateMachineFromPrompt } from 'react-meta-framework';

// Convert natural language to state machine
const cartMachine = createStateMachineFromPrompt(
  "Cart should handle: guest checkout, logged-in user, and payment failure states"
);

console.log('Generated States:', cartMachine.states);
console.log('Generated Events:', cartMachine.events);
console.log('Generated Code:', cartMachine.code);
```

### Real-time Performance Profiling

Predict performance issues before they happen:

```tsx
import { createPerformanceProfiler } from 'react-meta-framework';

const profiler = createPerformanceProfiler();

// Start profiling a component
profiler.startProfiling('UserList', ['users', 'filters']);

// End profiling and get insights
profiler.endProfiling('UserList', 25);

const insights = profiler.getPerformanceInsights();
console.log('Performance Score:', insights.performanceScore);
console.log('High Risk Components:', insights.highRiskComponents);
```

### Cross-Stack Reactive State

Share state between frontend and backend:

```tsx
import { useSharedState } from 'react-meta-framework';

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
```

### State Machines

Handle complex application logic with state machines:

```tsx
import { createStateMachine } from 'react-meta-framework';

const loadingMachine = createStateMachine('idle', {}, [
  { from: 'idle', to: 'loading', event: 'start' },
  { from: 'loading', to: 'success', event: 'complete' },
  { from: 'loading', to: 'error', event: 'error' }
]);

function DataFetcher() {
  const [data, setData] = createReactiveState(null);
  
  const fetchData = async () => {
    loadingMachine.send('start');
    try {
      const result = await fetch('/api/data');
      const json = await result.json();
      setData(json);
      loadingMachine.send('complete');
    } catch (error) {
      loadingMachine.send('error');
    }
  };
  
  return (
    <div>
      <p>State: {loadingMachine.currentState}</p>
      {loadingMachine.currentState === 'loading' && <p>Loading...</p>}
      {loadingMachine.currentState === 'success' && <p>Data: {JSON.stringify(data())}</p>}
      {loadingMachine.currentState === 'error' && <p>Error occurred</p>}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

### Smart Data Fetching

Automatic strategy selection for optimal performance:

```tsx
import { createDataFetcher } from 'react-meta-framework';

const fetcher = createDataFetcher();

// Automatic strategy selection
const data = await fetcher.fetch('/api/users');

// Explicit strategies
const ssrData = await fetcher.fetchSSR('/api/dynamic');
const cachedData = await fetcher.fetchSSG('/api/static');

// React hooks with caching
const { data, isLoading, error, revalidate } = fetcher.useQuery('/api/users');
```

## 🛠️ Development Tools

### DevTools Integration

Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) to open DevTools:

```tsx
import { createDevTools } from 'react-meta-framework';

// DevTools are automatically initialized in development
const devTools = createDevTools();

// Access state snapshots
const snapshot = devTools.getStateSnapshot();

// View performance metrics
const metrics = devTools.getPerformanceMetrics();
```

### Performance Monitoring

Built-in performance tracking and optimization suggestions:

```tsx
import { createPerformanceMonitor } from 'react-meta-framework';

const monitor = createPerformanceMonitor();

// Start monitoring
monitor.startMonitoring();

// Get performance report
const report = monitor.getPerformanceReport();
console.log(`Performance Grade: ${report.summary.grade}`);

// Get optimization suggestions
const suggestions = monitor.getOptimizationSuggestions();
```

### Advanced Compiler

The advanced compiler automatically optimizes your code:

```tsx
import { createAdvancedCompiler } from 'react-meta-framework';

const compiler = createAdvancedCompiler();

const result = await compiler.compile(componentCode, {
  target: 'web',
  performanceBudget: 80
});

console.log('Performance Score:', result.performanceScore);
console.log('Applied Transforms:', result.transforms.length);
console.log('Bundle Analysis:', result.bundleAnalysis);
```

### Auto-Generated Optimization Patches

Get intelligent performance suggestions:

```tsx
import { createOptimizationPatches } from 'react-meta-framework';

const patches = createOptimizationPatches();

const optimizationPatches = await patches.generateOptimizationPatches(
  componentCode,
  'UserList',
  performanceMetrics
);

optimizationPatches.forEach(patch => {
  console.log(`${patch.type}: ${patch.description} (${patch.impact} impact)`);
});
```

## 📁 Project Structure

A typical React Meta Framework project looks like this:

```
my-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components (auto-routed)
│   ├── stores/             # State management
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── package.json
├── vite.config.ts          # Build configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.js      # Styling configuration
```

## 🎨 Styling

React Meta Framework projects come with Tailwind CSS pre-configured:

```tsx
function StyledComponent() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to React Meta Framework
      </h1>
      <p className="text-gray-600">
        Start building amazing applications with ease!
      </p>
    </div>
  );
}
```

## 🔧 Configuration

### Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

## 🚀 Next Steps

Now that you have the basics, explore:

1. **[State Management Guide](./state-management.md)** - Deep dive into reactive state
2. **[Routing Guide](./routing.md)** - Filesystem-based routing
3. **[Data Fetching Guide](./data-fetching.md)** - Smart data fetching strategies
4. **[Performance Guide](./performance.md)** - Optimization and monitoring
5. **[CLI Reference](./cli.md)** - Command-line tools and templates

## 🆘 Getting Help

- **Documentation**: Check the guides in the `docs/` directory
- **Examples**: See the `examples/` directory for real-world usage
- **Issues**: Report bugs on GitHub
- **Discussions**: Join the community discussions

---

**Ready to build something amazing?** 🚀
