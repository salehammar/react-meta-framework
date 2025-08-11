# AI-Assisted Code Generation Example 🤖

This example demonstrates React Meta Framework's AI-assisted code generation capabilities, including design-to-code and API-to-code generation.

## 🎯 Features Demonstrated

- **Design-to-Code**: Generate React components from Figma-like design data
- **API-to-Code**: Generate API clients from OpenAPI specifications
- **Intelligent Suggestions**: Code analysis and improvement suggestions
- **Code Refactoring**: Automatic code optimization and modernization

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install js-yaml @types/js-yaml
```

### 2. Design-to-Code Generation

Create a design specification file:

```json
// design-spec.json
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

Generate React components:

```bash
npx react-meta ai design design-spec.json --style tailwind --tests --docs
```

### 3. API-to-Code Generation

Create an OpenAPI specification:

```yaml
# api-spec.yaml
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

Generate API client:

```bash
npx react-meta ai api api-spec.yaml --framework react --tests --docs
```

### 4. Code Suggestions

Analyze existing code for improvements:

```bash
npx react-meta ai suggest src/components/UserCard.tsx --context component
```

### 5. Code Refactoring

Refactor existing code:

```bash
npx react-meta ai refactor src/components/UserCard.tsx --type optimize-performance --output src/components/UserCard.optimized.tsx
```

## 📁 Generated Output

### Design-to-Code Output

```tsx
// Generated Component
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

```tsx
// Generated Types
export interface UserCardProps {
  name: string;
  email: string;
  avatar: string;
}
```

```tsx
// Generated Hooks
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

### API-to-Code Output

```tsx
// Generated API Types
export interface User {
  id?: string;
  name: string;
  email: string;
}
```

```tsx
// Generated API Hooks
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

export function useCreateUser() {
  const [data, setData] = createReactiveState(null);
  const [loading, setLoading] = createReactiveState(false);
  const [error, setError] = createReactiveState(null);
  
  const createUser = async (userData: User) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
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
    createUser
  };
}
```

```tsx
// Generated Example Components
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

## 🎯 Advanced Features

### 1. Complex Design Analysis

The AI codegen system can analyze complex design structures:

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

### 2. Intelligent Code Suggestions

The system provides context-aware suggestions:

```bash
# Component analysis
npx react-meta ai suggest src/components/Dashboard.tsx --context component

# Performance analysis
npx react-meta ai suggest src/hooks/useData.ts --context performance

# API integration analysis
npx react-meta ai suggest src/api/client.ts --context api
```

### 3. Code Refactoring Options

Multiple refactoring strategies:

```bash
# Extract reusable component
npx react-meta ai refactor src/components/ComplexComponent.tsx --type extract-component

# Extract custom hook
npx react-meta ai refactor src/components/DataComponent.tsx --type extract-hook

# Optimize performance
npx react-meta ai refactor src/components/SlowComponent.tsx --type optimize-performance

# Modernize syntax
npx react-meta ai refactor src/components/OldComponent.tsx --type modernize-syntax
```

## 🔧 Configuration Options

### Design Generation Options

- `--style`: CSS approach (css, tailwind, styled-components)
- `--framework`: Target framework (react, next, remix)
- `--tests`: Generate test files
- `--docs`: Generate documentation

### API Generation Options

- `--framework`: Target framework (react, next, remix)
- `--tests`: Generate test files
- `--docs`: Generate documentation

### Suggestion Analysis Options

- `--context`: Analysis context (component, hook, api, performance)

### Refactoring Options

- `--type`: Refactoring type (extract-component, extract-hook, optimize-performance, modernize-syntax)
- `--output`: Output file path

## 🎯 Best Practices

### 1. Design Specifications

- Use clear, descriptive component names
- Define all required props and their types
- Include interaction patterns for better hook generation
- Specify styling preferences for accurate CSS generation

### 2. API Specifications

- Use descriptive operation IDs
- Include comprehensive schema definitions
- Define required vs optional fields
- Add proper response schemas

### 3. Code Analysis

- Run suggestions on complex components
- Use performance context for optimization opportunities
- Analyze API integration code for best practices

### 4. Refactoring

- Start with performance optimization for existing code
- Extract components for better reusability
- Modernize syntax for better maintainability

## 🚀 Integration with React Meta Framework

The AI codegen system integrates seamlessly with React Meta Framework's features:

- **Reactive State**: Generated components use `createReactiveState`
- **State Machines**: Complex interactions use state machines
- **Compiler Optimizations**: Generated code is automatically optimized
- **Performance Monitoring**: Built-in performance tracking
- **DevTools Integration**: Full debugging support

## 🎉 Benefits

1. **Faster Development**: Generate boilerplate code automatically
2. **Consistency**: Enforce coding standards and patterns
3. **Best Practices**: Apply React Meta Framework conventions
4. **Performance**: Automatic optimization and monitoring
5. **Maintainability**: Clean, well-structured generated code

---

**Ready to revolutionize your React development workflow?** 🚀
