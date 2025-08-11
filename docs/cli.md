# CLI Reference 🛠️

React Meta Framework provides a powerful command-line interface for creating projects, generating templates, and managing your development workflow.

## 🚀 Installation

The CLI is available as part of the React Meta Framework package:

```bash
# Install globally
npm install -g react-meta-framework

# Or use npx (recommended)
npx react-meta <command>
```

## 📋 Available Commands

### `create` - Create New Projects

Creates a new React Meta Framework project with the specified template.

```bash
npx react-meta create <project-name> [options]
```

**Arguments:**
- `project-name`: Name of the project to create

**Options:**
- `-t, --template <template>`: Template to use (default, typescript, minimal, ecommerce, dashboard)
- `-y, --yes`: Skip prompts and use defaults

**Examples:**

```bash
# Create a basic project
npx react-meta create my-app

# Create with TypeScript template
npx react-meta create my-app --template typescript

# Create an e-commerce application
npx react-meta create my-shop --template ecommerce

# Create a dashboard application
npx react-meta create my-admin --template dashboard

# Skip prompts
npx react-meta create my-app --yes
```

**Available Templates:**

| Template | Description |
|----------|-------------|
| `default` | Basic React + Vite setup |
| `typescript` | TypeScript-enabled project |
| `minimal` | Minimal setup for learning |
| `ecommerce` | Full e-commerce application |
| `dashboard` | Admin dashboard with analytics |

### `generate` - Generate Templates

Generates additional templates or components within an existing project.

```bash
npx react-meta generate <template-type> <project-name>
```

**Arguments:**
- `template-type`: Type of template to generate
- `project-name`: Name for the generated files/project

**Available Template Types:**

#### Project Templates
- `ecommerce`: Full e-commerce application with cart management
- `dashboard`: Admin dashboard with metrics and user management

#### Component Templates
- `component`: Basic React component with reactive state
- `page`: Page component with routing and state machines
- `store`: State management store with reactive primitives
- `api`: API client with state machines and error handling

**Examples:**

```bash
# Generate a full e-commerce project
npx react-meta generate ecommerce my-shop

# Generate a dashboard project
npx react-meta generate dashboard my-admin

# Generate a component template
npx react-meta generate component UserCard

# Generate a store template
npx react-meta generate store auth-store

# Generate an API client template
npx react-meta generate api user-api
```

### `list` - List Available Templates

Shows all available templates and their descriptions.

```bash
npx react-meta list
```

**Output:**
```
📋 Available Templates:

🔧 Component Templates:
  component - Basic React component
  page - Page component with routing
  store - State management store
  api - API integration template

🚀 Project Templates:
  ecommerce - Full e-commerce application
  dashboard - Admin dashboard with analytics

Usage: npx react-meta generate <template-type> <project-name>
```

### `ai` - AI-Assisted Code Generation

AI-powered code generation and analysis tools.

```bash
npx react-meta ai <command> [options]
```

#### `ai design` - Generate Components from Design

Generate React components from design specifications.

```bash
npx react-meta ai design <design-file> [options]
```

**Arguments:**
- `design-file`: Path to design specification file (JSON)

**Options:**
- `-s, --style <style>`: CSS approach (css, tailwind, styled-components) [default: tailwind]
- `-f, --framework <framework>`: Target framework (react, next, remix) [default: react]
- `--tests`: Generate test files [default: false]
- `--docs`: Generate documentation [default: false]
- `-o, --output <path>`: Output directory [default: ./generated]

**Examples:**
```bash
# Generate components from design spec
npx react-meta ai design design-spec.json

# Generate with tests and docs
npx react-meta ai design design-spec.json --tests --docs

# Generate with custom styling
npx react-meta ai design design-spec.json --style styled-components
```

#### `ai api` - Generate API Client

Generate API client from OpenAPI specification.

```bash
npx react-meta ai api <api-spec> [options]
```

**Arguments:**
- `api-spec`: Path to OpenAPI specification file (JSON/YAML)

**Options:**
- `-f, --framework <framework>`: Target framework (react, next, remix) [default: react]
- `--tests`: Generate test files [default: false]
- `--docs`: Generate documentation [default: false]
- `-o, --output <path>`: Output directory [default: ./generated]

**Examples:**
```bash
# Generate API client from OpenAPI spec
npx react-meta ai api api-spec.yaml

# Generate with tests and docs
npx react-meta ai api api-spec.yaml --tests --docs
```

#### `ai suggest` - Code Suggestions

Generate intelligent code suggestions and improvements.

```bash
npx react-meta ai suggest <code-file> [options]
```

**Arguments:**
- `code-file`: Path to code file to analyze

**Options:**
- `-c, --context <context>`: Analysis context (component, hook, api, performance) [default: component]

**Examples:**
```bash
# Analyze component for improvements
npx react-meta ai suggest src/components/UserCard.tsx

# Analyze for performance optimizations
npx react-meta ai suggest src/hooks/useData.ts --context performance

# Analyze API integration code
npx react-meta ai suggest src/api/client.ts --context api
```

#### `ai refactor` - Code Refactoring

Intelligent code refactoring and optimization.

```bash
npx react-meta ai refactor <code-file> [options]
```

**Arguments:**
- `code-file`: Path to code file to refactor

**Options:**
- `-t, --type <type>`: Refactoring type (extract-component, extract-hook, optimize-performance, modernize-syntax) [default: optimize-performance]
- `-o, --output <path>`: Output file path

**Examples:**
```bash
# Optimize performance
npx react-meta ai refactor src/components/SlowComponent.tsx

# Extract component
npx react-meta ai refactor src/components/ComplexComponent.tsx --type extract-component

# Extract hook
npx react-meta ai refactor src/components/DataComponent.tsx --type extract-hook

# Save to specific file
npx react-meta ai refactor src/components/OldComponent.tsx --output src/components/NewComponent.tsx
```

## 📁 Generated Project Structure

### Default Template

```
my-app/
├── src/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── README.md
```

### E-commerce Template

```
my-shop/
├── src/
│   ├── components/
│   │   └── ProductCard.tsx
│   ├── stores/
│   │   └── cart-store.ts
│   ├── types/
│   │   └── ecommerce.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── README.md
```

### Dashboard Template

```
my-admin/
├── src/
│   ├── components/
│   │   ├── MetricCard.tsx
│   │   └── UserTable.tsx
│   ├── stores/
│   │   └── dashboard-store.ts
│   ├── types/
│   │   └── dashboard.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── README.md
```

## 🔧 Template Details

### Component Template

Generates a React component with React Meta Framework integration:

```tsx
import React from 'react';
import { createReactiveState } from 'react-meta-framework';

interface ComponentProps {
  title: string;
  initialValue?: number;
}

export function Component({ title, initialValue = 0 }: ComponentProps) {
  const [value, setValue] = createReactiveState(initialValue);
  
  const handleIncrement = () => {
    setValue(prev => prev + 1);
  };
  
  const handleDecrement = () => {
    setValue(prev => prev - 1);
  };
  
  return (
    <div className="component">
      <h3>{title}</h3>
      <div className="value-display">
        Current Value: {value()}
      </div>
      <div className="controls">
        <button onClick={handleDecrement}>-</button>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
}
```

### Page Template

Generates a page component with routing and state machines:

```tsx
import React from 'react';
import { createReactiveState, createStateMachine } from 'react-meta-framework';

// Page state machine
const pageState = createStateMachine('loading', {}, [
  { from: 'loading', to: 'ready', event: 'loaded' },
  { from: 'ready', to: 'error', event: 'error' }
]);

// Page data
const pageData = createReactiveState<any>(null);
const isLoading = createReactiveState(true);

export function Page() {
  // Simulate data loading
  React.useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        pageData.setValue({ message: 'Page loaded successfully!' });
        pageState.send('loaded');
        isLoading.setValue(false);
      } catch (error) {
        pageState.send('error');
        isLoading.setValue(false);
      }
    };
    
    loadData();
  }, []);
  
  if (isLoading()) {
    return <div>Loading...</div>;
  }
  
  if (pageState.currentState === 'error') {
    return <div>Error loading page</div>;
  }
  
  return (
    <div className="page">
      <h1>Page Component</h1>
      <p>{pageData()?.message}</p>
      <p>Current State: {pageState.currentState}</p>
    </div>
  );
}
```

### Store Template

Generates a state management store with reactive primitives:

```tsx
import { createReactiveState } from 'react-meta-framework';

// Global application store
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

### API Template

Generates an API client with state machines and error handling:

```tsx
import { createReactiveState, createStateMachine } from 'react-meta-framework';

// API request state machine
const requestState = createStateMachine('idle', {}, [
  { from: 'idle', to: 'loading', event: 'start' },
  { from: 'loading', to: 'success', event: 'complete' },
  { from: 'loading', to: 'error', event: 'error' },
  { from: 'success', to: 'idle', event: 'reset' },
  { from: 'error', to: 'idle', event: 'reset' }
]);

// API response data
const responseData = createReactiveState<any>(null);
const responseError = createReactiveState<string | null>(null);

export function createApiClient(baseURL: string) {
  const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    // Reset state
    requestState.reset();
    responseError.setValue(null);
    
    try {
      requestState.send('start');
      
      const response = await fetch(`${baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      responseData.setValue(data);
      requestState.send('complete');
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      responseError.setValue(errorMessage);
      requestState.send('error');
      throw error;
    }
  };
  
  return {
    // GET request
    get: <T>(endpoint: string) => makeRequest<T>(endpoint),
    
    // POST request
    post: <T>(endpoint: string, data: any) => makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
    // PUT request
    put: <T>(endpoint: string, data: any) => makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
    // DELETE request
    delete: <T>(endpoint: string) => makeRequest<T>(endpoint, {
      method: 'DELETE'
    }),
    
    // State getters
    get isLoading() { return requestState.currentState === 'loading'; },
    get isSuccess() { return requestState.currentState === 'success'; },
    get isError() { return requestState.currentState === 'error'; },
    get data() { return responseData(); },
    get error() { return responseError(); },
    
    // Reset state
    reset: () => {
      requestState.reset();
      responseData.setValue(null);
      responseError.setValue(null);
    }
  };
}

// Example usage:
// const api = createApiClient('https://api.example.com');
// const users = await api.get('/users');
// const newUser = await api.post('/users', { name: 'John' });
```

## 🚀 Quick Start Workflow

### 1. Create a New Project

```bash
# Create a new project
npx react-meta create my-app

# Navigate to the project
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Generate Additional Components

```bash
# Generate a component
npx react-meta generate component UserProfile

# Generate a store
npx react-meta generate store user-store

# Generate an API client
npx react-meta generate api user-api
```

### 3. Build and Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Package.json Scripts

Generated projects include these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

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

## 🚀 Advanced Features

### Performance Profiling

Use the built-in performance profiler to analyze your application:

```bash
# Start performance profiling
npx react-meta profile start

# Stop profiling and generate report
npx react-meta profile stop --output performance-report.json

# Analyze specific component
npx react-meta profile component UserList --threshold 16ms
```

### Advanced Compiler

Use the advanced compiler for automatic optimizations:

```bash
# Compile with performance optimizations
npx react-meta compile src/components/ --target web --performance-budget 80

# Analyze bundle impact
npx react-meta compile src/components/ --analyze-bundle

# Generate optimization patches
npx react-meta compile src/components/ --generate-patches
```

### Cross-Stack Development

Set up reactive backend bindings:

```bash
# Initialize backend binding
npx react-meta backend init --type postgres --realtime

# Sync state between frontend and backend
npx react-meta backend sync --key users --conflict-resolution crdt

# Monitor conflicts
npx react-meta backend conflicts --key users
```

## 🆘 Troubleshooting

### Common Issues

**1. Permission Denied**
```bash
# Use npx instead of global installation
npx react-meta create my-app
```

**2. Template Not Found**
```bash
# List available templates
npx react-meta list
```

**3. Project Creation Fails**
```bash
# Check if directory exists
ls -la

# Remove existing directory if needed
rm -rf my-app

# Try again
npx react-meta create my-app
```

### Getting Help

- **Documentation**: Check the guides in the `docs/` directory
- **Examples**: See the `examples/` directory for real-world usage
- **Issues**: Report bugs on GitHub
- **Discussions**: Join the community discussions

---

**Next:** Learn about [State Management](./state-management.md) or [Getting Started](./getting-started.md)
