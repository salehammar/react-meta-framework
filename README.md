# React Meta Framework 🚀

> A batteries-included meta-framework for React that eliminates ecosystem fragmentation and complexity

## 🎯 Vision

React Meta Framework aims to solve React's core architectural tensions by providing:

- **Unified State Management**: Reactive primitives that eliminate manual `useMemo`/`useCallback`
- **Built-in State Machines**: Native statechart functionality for complex logic
- **Zero-Config Performance**: Compiler-driven optimizations and bundle splitting
- **Standardized Patterns**: Opinionated conventions for routing, data fetching, and more
- **Developer Experience**: AI-assisted codegen and intelligent tooling

## ✨ Key Features

### 🧠 Reactive State System
```tsx
import { createReactiveState } from 'react-meta-framework';

// No more manual dependency tracking!
const counter = createReactiveState(0);
const doubled = counter.derive(value => value * 2);

// Automatic updates when dependencies change
<div>Count: {counter.value()}</div>
<div>Doubled: {doubled()}</div>
```

### 🔄 State Machines
```tsx
import { createStateMachine } from 'react-meta-framework';

const loadingMachine = createStateMachine('idle', {}, [
  { from: 'idle', to: 'loading', event: 'start' },
  { from: 'loading', to: 'success', event: 'complete' }
]);

// Visualize state flow in DevTools
<div>Status: {loadingMachine.currentState}</div>
```

### 🛣️ Filesystem Routing
```tsx
// Automatic route generation from file structure
// pages/
//   index.tsx          → /
//   users/
//     [id].tsx         → /users/:id
//     create.tsx       → /users/create
```

### 📡 Smart Data Fetching
```tsx
import { createDataFetcher } from 'react-meta-framework';

const fetcher = createDataFetcher();

// Automatic strategy selection (SSR/SSG/ISR)
const data = await fetcher.fetch('/api/users');
const ssrData = await fetcher.fetchSSR('/api/dynamic');
const cachedData = await fetcher.fetchSSG('/api/static');

// React hooks with automatic caching
const { data, isLoading, error, revalidate } = fetcher.useQuery('/api/users');

// Advanced query client with batching and cache invalidation
const queryClient = createQueryClient();
await queryClient.invalidateTag('users');
```

### 🛠️ DevTools Integration
```tsx
import { createDevTools, performanceMonitor } from 'react-meta-framework';

// Multiple panels: State, Routing, Data Fetching, Performance
const devTools = createDevTools();

// Performance monitoring out of the box
performanceMonitor.trackRender('UserList', 8.2);
performanceMonitor.trackCache(true, 'users:list');

// Press Ctrl+Shift+D to open DevTools in development
```

### ⚡ Automatic Compiler Optimizations
```tsx
// No more manual useMemo/useCallback - the compiler handles it all!
function ExpensiveComponent({ data }) {
  // This gets automatically optimized by the compiler
  const processedData = data.map(item => ({
    ...item,
    computed: heavyComputation(item)
  }));
  
  return <div>{/* Your JSX */}</div>;
}

// The compiler automatically:
// - Removes unnecessary useMemo/useCallback
// - Adds React.memo where beneficial
// - Optimizes dependency arrays
// - Suggests performance improvements
```

### 📊 Enterprise Performance Monitoring
```tsx
import { createPerformanceMonitor } from 'react-meta-framework';

const monitor = createPerformanceMonitor();

// Automatic performance tracking
monitor.startMonitoring();

// Real-time insights
const report = monitor.getPerformanceReport();
console.log(`Performance Grade: ${report.summary.grade}`); // A, B, C, D, F

// Automatic optimization suggestions
monitor.suggestOptimizations();
```

### 🎨 Project Templates
```bash
# Generate full project templates
npx react-meta generate ecommerce my-shop
npx react-meta generate dashboard my-admin

# Generate component templates
npx react-meta generate component UserCard
npx react-meta generate store auth-store
npx react-meta generate api user-api
```

**Available Templates:**
- **E-commerce App**: Full-featured shopping application with cart management
- **Dashboard App**: Admin panel with metrics and user management
- **Component Templates**: React components with React Meta Framework integration
- **Store Templates**: State management stores with reactive primitives
- **API Templates**: API client with state machines and error handling

### 🤖 AI-Assisted Code Generation
```bash
# Generate React components from design data
npx react-meta ai design design-spec.json --style tailwind --tests --docs

# Generate API client from OpenAPI specification
npx react-meta ai api api-spec.yaml --framework react --tests --docs

# Get intelligent code suggestions
npx react-meta ai suggest src/components/UserCard.tsx --context component

# Refactor code automatically
npx react-meta ai refactor src/components/SlowComponent.tsx --type optimize-performance
```

**AI Codegen Features:**
- **Design-to-Code**: Generate React components from Figma-like design data
- **API-to-Code**: Generate API clients from OpenAPI specifications
- **Intelligent Suggestions**: Code analysis and improvement recommendations
- **Code Refactoring**: Automatic optimization and modernization

### 🧠 Enhanced AI Features
```tsx
// Natural language to state machines
const cartMachine = createStateMachineFromPrompt(
  "Cart should handle: guest checkout, logged-in user, and payment failure states"
);

// Real-time performance profiler
const profiler = createPerformanceProfiler();
profiler.predictRerenderCascade(componentTree);

// Auto-generated optimization patches
const patches = await generateOptimizationPatches(componentCode);
// "Your product list causes 47 unnecessary re-renders - apply fix?"
```

**Enhanced AI Features:**
- **Natural Language to State Machines**: Convert descriptions to XState-like statecharts
- **Real-time Performance Profiler**: Predict re-render cascades before they happen
- **Auto-generated Optimization Patches**: Generate performance improvement suggestions

### ⚡ Advanced Compiler
```tsx
// Context-aware code transforms
const compiler = createAdvancedCompiler();
compiler.detectLayoutShiftRisks(code);
compiler.injectCSSContainment(code);

// Bundle physics engine
const physics = createBundlePhysicsEngine();
const impact = physics.predictTTIImpact('@library/analytics');
// "Estimated bundle impact: +12kb → TTI +300ms (not recommended)"
```

**Advanced Compiler Features:**
- **Context-Aware Code Transforms**: Detect layout shift risks and inject CSS containment
- **Bundle Physics Engine**: Predict TTI impact of dependencies
- **Advanced Code Transformations**: Convert useState → useReducer when needed

### 🌐 Cross-Stack Reactive Unification
```tsx
// Shared reactive state across frontend + backend
const [globalInventory, setInventory] = useSharedState('products', { 
  backend: 'cloudflare-d1', 
  realtime: true 
});

// Automatic data sync with conflict resolution
const binding = createReactiveBackendBinding('users', [], {
  type: 'postgres',
  realtime: true,
  conflictResolution: 'crdt'
});
```

**Cross-Stack Features:**
- **Reactive Backend Bindings**: Shared state across frontend + Node.js/Edge
- **Automatic Data Sync**: Bi-directional sync with databases using reactive queries
- **Conflict Resolution**: CRDT-based conflict resolution under the hood

## 🚀 Quick Start

### 1. Create a New Project
```bash
npx react-meta create my-app
cd my-app
npm install
npm run dev
```

### 2. Use Reactive State
```tsx
import { createReactiveState } from 'react-meta-framework';

function Counter() {
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

### 3. Generate Templates
```bash
# Generate component templates
npx react-meta generate component MyComponent

# Generate API client templates
npx react-meta generate api user-api

# Generate store templates
npx react-meta generate store auth-store
```

## 🏗️ Architecture

```
src/
├── state/           # Reactive state primitives
│   ├── reactive-state.ts
│   └── state-machine.ts
├── routing/         # Filesystem-based routing
│   └── router.ts
├── data/            # Smart data fetching
│   └── data-fetcher.ts
├── compiler/        # Automatic optimizations
│   └── compiler.ts
└── cli/            # Project generation tools
    ├── project-creator.ts
    └── template-generator.ts
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- TypeScript 5.0+
- pnpm/npm/yarn

### Setup
```bash
git clone https://github.com/salehammar/react-meta-framework
cd react-meta-framework
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Development Scripts
```bash
# Use our development helper script
./scripts/dev.sh build      # Build the project
./scripts/dev.sh watch      # Watch mode
./scripts/dev.sh create     # Create new project
./scripts/dev.sh demo       # Run demo
./scripts/dev.sh clean      # Clean build artifacts
./scripts/dev.sh help       # Show all commands
```

## 📚 Documentation

**[📖 Documentation Index](./docs/README.md)** - Complete documentation overview

### **Core Guides**
- [Getting Started Guide](./docs/getting-started.md) - Quick start and core concepts
- [State Management Guide](./docs/state-management.md) - Reactive state and state machines
- [CLI Reference](./docs/cli.md) - Command-line tools and templates

### **Advanced Features**
- [AI Code Generation](./docs/ai-codegen.md) - AI-assisted code generation 🤖
- [Advanced Features Guide](./docs/advanced-features.md) - Revolutionary AI-powered features 🚀

### **System Features**
- [Routing](./docs/routing.md) - Filesystem-based routing 🛣️
- [Data Fetching](./docs/data-fetching.md) - Smart data fetching strategies 📡
- [Compiler](./docs/compiler.md) - Automatic optimizations ⚡

## 🎉 Examples

Check out our [examples directory](./examples/) for real-world usage patterns:

- [Todo App](./examples/todo-app/) - Complete todo application with reactive state
- [AI Codegen](./examples/ai-codegen/) - AI-assisted code generation examples
- [E-commerce](./examples/ecommerce/) - Full e-commerce application (coming soon)
- [Dashboard](./examples/dashboard/) - Admin dashboard with analytics (coming soon)
- [API Integration](./examples/api-integration/) - API integration patterns (coming soon)

**Project Templates:**
- **E-commerce Template**: `npx react-meta generate ecommerce my-shop`
- **Dashboard Template**: `npx react-meta generate dashboard my-admin`
- **Component Templates**: `npx react-meta generate component <name>`
- **Store Templates**: `npx react-meta generate store <name>`
- **API Templates**: `npx react-meta generate api <name>`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### 🎯 **Current Focus: Advanced Features Implementation**

We've successfully completed all short-term goals and most medium-term priorities! Now we're implementing advanced features that go beyond the original roadmap:

- **🤖 AI-assisted codegen**: ✅ **COMPLETED** - Generate code from designs and APIs
- **🧠 Enhanced AI Features**: ✅ **COMPLETED** - Natural language to state machines, real-time performance profiler, auto-generated optimization patches
- **⚡ Advanced Compiler**: ✅ **COMPLETED** - Context-aware code transforms, bundle physics engine, advanced code transformations
- **🌐 Cross-Stack Features**: 🚧 **IN PROGRESS** - Reactive backend bindings, automatic data sync engine, visual architecture studio, reactive deployment fabric

### Development Roadmap

#### ✅ **Completed (MVP)**
- [x] Project structure and CLI foundation
- [x] Reactive state primitives (basic implementation)
- [x] State machine system
- [x] Project templates (Vite + React)
- [x] CLI tools for project creation
- [x] Template generation system
- [x] Development scripts and tooling

#### ✅ **Immediate (Next 2-4 weeks) - COMPLETED!**
- [x] ~~Fix derived value reactivity in state system~~ ✅ **COMPLETED**
- [x] ~~Implement filesystem-based routing~~ ✅ **COMPLETED**
- [x] ~~Add smart data fetching strategies~~ ✅ **COMPLETED**
- [x] ~~Create DevTools integration~~ ✅ **COMPLETED**

#### ✅ **Short Term (1-2 months) - COMPLETED!**
- [x] ~~Compiler optimizations (React Forget-like)~~ ✅ **COMPLETED**
- [x] ~~Performance monitoring~~ ✅ **COMPLETED**
- [x] ~~More project templates~~ ✅ **COMPLETED**
- [x] ~~**Documentation and examples**~~ ✅ **COMPLETED**

#### 🎯 **Medium Term (3-6 months) - COMPLETED!**
- [x] ~~AI-assisted codegen~~ ✅ **COMPLETED**
- [x] ~~Enhanced AI Features~~ ✅ **COMPLETED**
- [x] ~~Advanced Compiler~~ ✅ **COMPLETED**

#### 🚀 **Advanced Features (Beyond Roadmap)**
- [x] ~~Reactive Backend Bindings~~ ✅ **COMPLETED**
- [ ] Automatic Data Sync Engine
- [ ] Visual Architecture Studio
- [ ] Reactive Deployment Fabric

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by [SolidJS](https://solidjs.com/) reactive primitives
- Built on [React](https://reactjs.org/) ecosystem
- Learning from [Next.js](https://nextjs.org/) and [Remix](https://remix.run/) patterns
- Compiler approach inspired by [React Forget](https://github.com/facebook/react/tree/main/packages/react-forget)

---

**Made with ❤️ by the Saleh Ammar**

*Building the future of React development, one optimization at a time.*