# React Meta Framework 🚀

> **A revolutionary batteries-included meta-framework for React that eliminates ecosystem fragmentation and complexity**

[![npm version](https://badge.fury.io/js/react-meta-framework.svg)](https://badge.fury.io/js/react-meta-framework)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/salehammar/react-meta-framework/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/salehammar/react-meta-framework.svg)](https://github.com/salehammar/react-meta-framework/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/salehammar/react-meta-framework.svg)](https://github.com/salehammar/react-meta-framework/network)
[![CI/CD](https://github.com/salehammar/react-meta-framework/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/salehammar/react-meta-framework/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

---

## 🎯 **Vision**

React Meta Framework aims to solve React's core architectural tensions by providing a unified, opinionated approach that eliminates the complexity of choosing and integrating multiple libraries.

### **What We Solve:**
- ❌ **Ecosystem Fragmentation** → ✅ **Unified Architecture**
- ❌ **Manual Optimization** → ✅ **Automatic Compiler**
- ❌ **Complex Setup** → ✅ **Zero-Config Experience**
- ❌ **State Management Chaos** → ✅ **Reactive Primitives**
- ❌ **Performance Anxiety** → ✅ **Built-in Monitoring**

---

## ✨ **Key Features**

### 🧠 **Reactive State System**
```tsx
import { createReactiveState } from 'react-meta-framework';

// No more manual dependency tracking!
const counter = createReactiveState(0);
const doubled = counter.derive(value => value * 2);

// Automatic updates when dependencies change
<div>Count: {counter.value()}</div>
<div>Doubled: {doubled()}</div>
```

### 🔄 **State Machines**
```tsx
import { createStateMachine } from 'react-meta-framework';

const loadingMachine = createStateMachine('idle', {}, [
  { from: 'idle', to: 'loading', event: 'start' },
  { from: 'loading', to: 'success', event: 'complete' }
]);

// Visualize state flow in DevTools
<div>Status: {loadingMachine.currentState}</div>
```

### 🛣️ **Filesystem Routing**
```tsx
// Automatic route generation from file structure
// pages/
//   index.tsx          → /
//   users/
//     [id].tsx         → /users/:id
//     create.tsx       → /users/create
```

### 📡 **Smart Data Fetching**
```tsx
import { createDataFetcher } from 'react-meta-framework';

const fetcher = createDataFetcher();

// Automatic strategy selection (SSR/SSG/ISR)
const data = await fetcher.fetch('/api/users');
const ssrData = await fetcher.fetchSSR('/api/dynamic');
const cachedData = await fetcher.fetchSSG('/api/static');

// React hooks with automatic caching
const { data, isLoading, error, revalidate } = fetcher.useQuery('/api/users');
```

### 🤖 **AI-Assisted Code Generation**
```bash
# Generate React components from design data
npx react-meta ai design design-spec.json --style tailwind --tests --docs

# Generate API client from OpenAPI specification
npx react-meta ai api api-spec.yaml --framework react --tests --docs

# Get intelligent code suggestions
npx react-meta ai suggest src/components/UserCard.tsx --context component
```

---

## 🚀 **Quick Start**

### **1. Create a New Project**
```bash
npx react-meta create my-app
cd my-app
npm install
npm run dev
```

### **2. Use Reactive State**
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

### **3. Generate Templates**
```bash
# Generate component templates
npx react-meta generate component MyComponent

# Generate API client templates
npx react-meta generate api user-api

# Generate store templates
npx react-meta generate store auth-store
```

---

## 🏗️ **Architecture**

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
├── ai/              # AI-assisted codegen
│   ├── codegen.ts
│   └── state-machine-generator.ts
└── cli/            # Project generation tools
    ├── project-creator.ts
    └── template-generator.ts
```

---

## 🛠️ **Development**

### **Prerequisites**
- Node.js 18+
- TypeScript 5.0+
- pnpm/npm/yarn

### **Setup**
```bash
git clone https://github.com/salehammar/react-meta-framework
cd react-meta-framework
npm install
npm run dev
```

### **Available Scripts**
```bash
npm run build      # Build the project
npm test           # Run tests
npm run lint       # Lint code
npm run format     # Format code
npm run check      # Run all checks
```

---

## 📚 **Documentation**

### **📖 [Documentation Index](./docs/README.md)** - Complete documentation overview

### **Core Guides**
- [🚀 Getting Started Guide](./docs/getting-started.md) - Quick start and core concepts
- [🧠 State Management Guide](./docs/state-management.md) - Reactive state and state machines
- [🛠️ CLI Reference](./docs/cli.md) - Command-line tools and templates

### **Advanced Features**
- [🤖 AI Code Generation](./docs/ai-codegen.md) - AI-assisted code generation
- [⚡ Advanced Features Guide](./docs/advanced-features.md) - Revolutionary AI-powered features

### **System Features**
- [🛣️ Routing](./docs/routing.md) - Filesystem-based routing
- [📡 Data Fetching](./docs/data-fetching.md) - Smart data fetching strategies
- [⚡ Compiler](./docs/compiler.md) - Automatic optimizations

---

## 🎉 **Examples**

Check out our [examples directory](./examples/) for real-world usage patterns:

- [✅ Todo App](./examples/todo-app/) - Complete todo application with reactive state
- [🤖 AI Codegen](./examples/ai-codegen/) - AI-assisted code generation examples
- [🛒 E-commerce](./examples/ecommerce/) - Full e-commerce application (coming soon)
- [📊 Dashboard](./examples/dashboard/) - Admin dashboard with analytics (coming soon)

### **Project Templates**
```bash
# E-commerce Template
npx react-meta generate ecommerce my-shop

# Dashboard Template  
npx react-meta generate dashboard my-admin

# Component Templates
npx react-meta generate component <name>

# Store Templates
npx react-meta generate store <name>

# API Templates
npx react-meta generate api <name>
```

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### **🎯 Current Focus: Advanced Features Implementation**

We've successfully completed all short-term goals and most medium-term priorities! Now we're implementing advanced features that go beyond the original roadmap:

- **🤖 AI-assisted codegen**: ✅ **COMPLETED** - Generate code from designs and APIs
- **🧠 Enhanced AI Features**: ✅ **COMPLETED** - Natural language to state machines, real-time performance profiler, auto-generated optimization patches
- **⚡ Advanced Compiler**: ✅ **COMPLETED** - Context-aware code transforms, bundle physics engine, advanced code transformations
- **🌐 Cross-Stack Features**: 🚧 **IN PROGRESS** - Reactive backend bindings, automatic data sync engine, visual architecture studio, reactive deployment fabric

### **Development Roadmap**

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

---

## 📄 **License**

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 **Acknowledgments**

- Inspired by [SolidJS](https://solidjs.com/) reactive primitives
- Built on [React](https://reactjs.org/) ecosystem
- Learning from [Next.js](https://nextjs.org/) and [Remix](https://remix.run/) patterns
- Compiler approach inspired by [React Forget](https://github.com/facebook/react/tree/main/packages/react-forget)

---

<div align="center">

**Made with ❤️ by [Saleh Ammar](https://github.com/salehammar)**

*Building the future of React development, one optimization at a time.*

[![GitHub followers](https://img.shields.io/github/followers/salehammar?label=Follow&style=social)](https://github.com/salehammar)

</div>