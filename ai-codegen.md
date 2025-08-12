# AI-Assisted Code Generation 🤖

React Meta Framework's AI-assisted code generation system revolutionizes how you build React applications by automatically generating code from designs and APIs.

## 🎯 Overview

The AI codegen system provides revolutionary capabilities that go beyond traditional code generation:

1. **Design-to-Code**: Generate React components from Figma-like design data
2. **API-to-Code**: Generate API clients from OpenAPI specifications
3. **Intelligent Suggestions**: Code analysis and improvement recommendations
4. **Code Refactoring**: Automatic optimization and modernization
5. **Natural Language to State Machines**: Convert descriptions to XState-like statecharts
6. **Real-time Performance Profiling**: Predict re-render cascades before they happen
7. **Auto-generated Optimization Patches**: Generate performance improvement suggestions
8. **Advanced Compiler**: Context-aware transforms and bundle physics engine

## 🚀 Quick Start

### Installation

The AI codegen system is included with React Meta Framework. For YAML support, install:

```bash
npm install js-yaml @types/js-yaml
```

### Basic Usage

```bash
# Generate components from design
npx react-meta ai design design-spec.json

# Generate API client from OpenAPI spec
npx react-meta ai api api-spec.yaml

# Get code suggestions
npx react-meta ai suggest src/components/UserCard.tsx

# Refactor code
npx react-meta ai refactor src/components/SlowComponent.tsx
```

## 📐 Design-to-Code Generation

Generate React components from design specifications.

### Design Specification Format

```json
{
  "components": [
    {
      "type": "component",
      "name": "UserCard",
      "props": {
        "name": "string",
        "email": "string",
        "avatar": "string"
      },
      "children": [
        {
          "type": "button",
          "name": "Edit Profile"
        }
      ],
      "styles": {
        "backgroundColor": "#ffffff",
        "padding": "16px",
        "borderRadius": "8px"
      },
      "interactions": [
        {
          "type": "click",
          "action": "editProfile",
          "target": "Edit Profile"
        }
      ]
    }
  ]
}
```

### CLI Command

```bash
npx react-meta ai design design-spec.json [options]
```

**Options:**
- `--style <style>`: CSS approach (css, tailwind, styled-components) [default: tailwind]
- `--framework <framework>`: Target framework (react, next, remix) [default: react]
- `--tests`: Generate test files [default: false]
- `--docs`: Generate documentation [default: false]
- `--output <path>`: Output directory [default: ./generated]

### Generated Output

**Component:**
```tsx
import React from 'react';
import { createReactiveState } from 'react-meta-framework';
import type { UserCardProps } from './types';

export function UserCard({ name, email, avatar }: UserCardProps) {
  const [isActive, setIsActive] = createReactiveState(false);
  const [data, setData] = createReactiveState(null);
  
  return (
    <div className="bg-white p-4 rounded-lg">
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full" />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{email}</p>
      <button className="btn btn-primary">Edit Profile</button>
    </div>
  );
}
```

**Types:**
```tsx
export interface UserCardProps {
  name: string;
  email: string;
  avatar: string;
}
```

**Hooks:**
```tsx
import { createReactiveState, createStateMachine } from 'react-meta-framework';

export function useUserCardInteractions() {
  const [state, setState] = createReactiveState('idle');
  
  const handleClick = () => {
    setState('active');
  };
  
  const handleSubmit = (data: any) => {
    setState('loading');
    // API call logic here
    setState('success');
  };
  
  return {
    state,
    handleClick,
    handleSubmit
  };
}
```

## 🔌 API-to-Code Generation

Generate API clients from OpenAPI specifications.

### OpenAPI Specification Format

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
  description: User management API
paths:
  /users:
    get:
      operationId: getUsers
      responses:
        '200':
          description: List of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        '201':
          description: User created
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
      required:
        - name
        - email
```

### CLI Command

```bash
npx react-meta ai api api-spec.yaml [options]
```

**Options:**
- `--framework <framework>`: Target framework (react, next, remix) [default: react]
- `--tests`: Generate test files [default: false]
- `--docs`: Generate documentation [default: false]
- `--output <path>`: Output directory [default: ./generated]

### Generated Output

**API Types:**
```tsx
export interface User {
  id?: string;
  name: string;
  email: string;
}
```

**API Hooks:**
```tsx
import { createReactiveState, createStateMachine } from 'react-meta-framework';

export function useGetUsers() {
  const [data, setData] = createReactiveState(null);
  const [loading, setLoading] = createReactiveState(false);
  const [error, setError] = createReactiveState(null);
  
  const getUsers = async (params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    data,
    loading,
    error,
    getUsers
  };
}
```

**Example Components:**
```tsx
import React from 'react';
import { useGetUsers } from './hooks';

export function GetUsersExample() {
  const { data, loading, error, getUsers } = useGetUsers();
  
  React.useEffect(() => {
    getUsers();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Users</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

## 💡 Intelligent Code Suggestions

Analyze existing code for improvements and best practices.

### CLI Command

```bash
npx react-meta ai suggest <code-file> [options]
```

**Options:**
- `--context <context>`: Analysis context (component, hook, api, performance) [default: component]

### Analysis Contexts

#### Component Analysis
```bash
npx react-meta ai suggest src/components/UserCard.tsx --context component
```

**Suggestions:**
- Component structure improvements
- Prop optimization
- State management recommendations
- Performance optimizations

#### Hook Analysis
```bash
npx react-meta ai suggest src/hooks/useData.ts --context hook
```

**Suggestions:**
- Hook extraction opportunities
- Dependency optimization
- Error handling improvements
- Performance enhancements

#### API Analysis
```bash
npx react-meta ai suggest src/api/client.ts --context api
```

**Suggestions:**
- Caching strategies
- Error boundary implementation
- Request optimization
- Type safety improvements

#### Performance Analysis
```bash
npx react-meta ai suggest src/components/SlowComponent.tsx --context performance
```

**Suggestions:**
- Memoization opportunities
- Render optimization
- Bundle size reduction
- Memory leak prevention

## 🔧 Code Refactoring

Automatically refactor code for better performance and maintainability.

### CLI Command

```bash
npx react-meta ai refactor <code-file> [options]
```

**Options:**
- `--type <type>`: Refactoring type (extract-component, extract-hook, optimize-performance, modernize-syntax) [default: optimize-performance]
- `--output <path>`: Output file path

### Refactoring Types

#### Extract Component
```bash
npx react-meta ai refactor src/components/ComplexComponent.tsx --type extract-component
```

Extracts reusable components from complex components.

#### Extract Hook
```bash
npx react-meta ai refactor src/components/DataComponent.tsx --type extract-hook
```

Extracts custom hooks from component logic.

#### Optimize Performance
```bash
npx react-meta ai refactor src/components/SlowComponent.tsx --type optimize-performance
```

Applies performance optimizations using the compiler.

#### Modernize Syntax
```bash
npx react-meta ai refactor src/components/OldComponent.tsx --type modernize-syntax
```

Updates code to use modern React patterns.

## 🎨 Advanced Design Patterns

### Complex Layout Generation

```json
{
  "components": [
    {
      "type": "layout",
      "name": "DashboardLayout",
      "children": [
        {
          "type": "component",
          "name": "Sidebar",
          "children": [
            { "type": "navigation", "name": "Menu" }
          ]
        },
        {
          "type": "component",
          "name": "MainContent",
          "children": [
            { "type": "card", "name": "StatsCard" },
            { "type": "card", "name": "ChartCard" }
          ]
        }
      ]
    }
  ]
}
```

### Interactive Components

```json
{
  "components": [
    {
      "type": "component",
      "name": "InteractiveForm",
      "props": {
        "onSubmit": "function",
        "initialData": "object"
      },
      "children": [
        { "type": "input", "name": "Name Input" },
        { "type": "input", "name": "Email Input" },
        { "type": "button", "name": "Submit" }
      ],
      "interactions": [
        {
          "type": "submit",
          "action": "handleSubmit",
          "target": "Submit"
        },
        {
          "type": "focus",
          "action": "validateField",
          "target": "Name Input"
        }
      ]
    }
  ]
}
```

## 🔌 Advanced API Patterns

### Complex API Specifications

```yaml
openapi: 3.0.0
info:
  title: E-commerce API
  version: 1.0.0
paths:
  /products:
    get:
      operationId: getProducts
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
  /products/{id}:
    get:
      operationId: getProduct
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        price:
          type: number
        category:
          type: string
        images:
          type: array
          items:
            type: string
      required:
        - id
        - name
        - price
    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        pages:
          type: integer
```

## 🎯 Best Practices

### Design Specifications

1. **Clear Naming**: Use descriptive component and prop names
2. **Type Definitions**: Define all props with proper types
3. **Interaction Patterns**: Include interaction specifications for better hook generation
4. **Styling Consistency**: Use consistent styling patterns
5. **Component Hierarchy**: Structure components logically

### API Specifications

1. **Operation IDs**: Use descriptive operation IDs
2. **Schema Definitions**: Define comprehensive schemas
3. **Required Fields**: Clearly mark required vs optional fields
4. **Response Schemas**: Include proper response definitions
5. **Error Handling**: Define error response schemas

### Code Analysis

1. **Regular Analysis**: Run suggestions on complex components
2. **Performance Focus**: Use performance context for optimization
3. **API Integration**: Analyze API integration code regularly
4. **Refactoring**: Apply refactoring to maintain code quality

## 🔧 Configuration

### Environment Variables

```bash
# Enable detailed logging
REACT_META_AI_DEBUG=true

# Set default output directory
REACT_META_AI_OUTPUT_DIR=./generated

# Configure default styling
REACT_META_AI_DEFAULT_STYLE=tailwind
```

### Custom Templates

You can customize the generated code by modifying the template functions in the AI codegen system.

## 🚀 Integration with React Meta Framework

The AI codegen system integrates seamlessly with all React Meta Framework features:

### Reactive State Integration
```tsx
// Generated components automatically use reactive state
const [isActive, setIsActive] = createReactiveState(false);
const [data, setData] = createReactiveState(null);
```

### State Machine Integration
```tsx
// Complex interactions use state machines
const stateMachine = createStateMachine({
  initial: 'idle',
  states: {
    idle: { on: { CLICK: 'loading' } },
    loading: { on: { SUCCESS: 'success', ERROR: 'error' } },
    success: { on: { RESET: 'idle' } },
    error: { on: { RETRY: 'loading' } }
  }
});
```

### Compiler Optimization
```tsx
// Generated code is automatically optimized
const optimizedCode = compiler.compile(generatedCode, {
  target: 'es2022',
  optimize: true,
  analyzeDependencies: true
});
```

### Performance Monitoring
```tsx
// Built-in performance tracking
const monitor = createPerformanceMonitor();
monitor.trackComponent('GeneratedComponent');
```

### DevTools Integration
```tsx
// Full debugging support
const devTools = createDevTools();
devTools.initialize();
```

## 🎉 Benefits

1. **🚀 Faster Development**: Generate boilerplate code automatically
2. **🎯 Consistency**: Enforce coding standards and patterns
3. **💡 Best Practices**: Apply React Meta Framework conventions
4. **⚡ Performance**: Automatic optimization and monitoring
5. **🔧 Maintainability**: Clean, well-structured generated code
6. **🔄 Integration**: Seamless integration with existing features

## 📚 Examples

See the [AI Codegen Examples](./examples/ai-codegen/) for complete working examples.

## 🆘 Troubleshooting

### Common Issues

1. **Design File Not Found**: Ensure the design file path is correct
2. **Invalid JSON**: Validate your design specification JSON
3. **OpenAPI Parse Error**: Check your OpenAPI specification format
4. **TypeScript Errors**: Ensure all required dependencies are installed

### Debug Mode

Enable debug mode for detailed logging:

```bash
REACT_META_AI_DEBUG=true npx react-meta ai design design-spec.json
```

## 🧠 Enhanced AI Features

### Natural Language to State Machines

Convert natural language descriptions into fully functional state machines.

```tsx
import { createStateMachineFromPrompt } from 'react-meta-framework';

// Generate state machine from description
const cartMachine = createStateMachineFromPrompt(
  "Cart should handle: guest checkout, logged-in user, and payment failure states"
);

console.log('Generated States:', cartMachine.states);
console.log('Generated Events:', cartMachine.events);
console.log('Generated Code:', cartMachine.code);
```

### Real-time Performance Profiling

Predict performance issues before they happen with intelligent profiling.

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

### Auto-generated Optimization Patches

Get intelligent performance suggestions and automatically apply optimizations.

```tsx
import { createOptimizationPatches } from 'react-meta-framework';

const patches = createOptimizationPatches();

const optimizationPatches = await patches.generateOptimizationPatches(
  componentCode,
  'UserList',
  performanceMetrics
);

optimizationPatches.forEach(patch => {
  console.log(`${patch.type}: ${patch.description}`);
  console.log(`Impact: ${patch.impact}`);
  console.log(`Confidence: ${patch.confidence * 100}%`);
});
```

### Advanced Compiler

The advanced compiler automatically optimizes your code with context-aware transforms.

```tsx
import { createAdvancedCompiler } from 'react-meta-framework';

const compiler = createAdvancedCompiler();

const result = await compiler.compile(componentCode, {
  target: 'web',
  performanceBudget: 80,
  bundleSize: 100
});

console.log('Performance Score:', result.performanceScore);
console.log('Applied Transforms:', result.transforms.length);
console.log('Bundle Analysis:', result.bundleAnalysis);
```

---

**Ready to revolutionize your React development workflow with AI-assisted code generation?** 🤖
