# Routing Guide 🛣️

React Meta Framework provides a powerful filesystem-based routing system that automatically generates routes from your project structure, eliminating the need for manual route configuration.

## 🎯 Overview

The routing system provides:

- **📁 Filesystem-based Routing**: Automatic route generation from file structure
- **🔄 Dynamic Routes**: Support for dynamic segments and catch-all routes
- **⚡ Zero Configuration**: Works out of the box with sensible defaults
- **🎭 Route Parameters**: Automatic parameter extraction and validation
- **🔗 Navigation Utilities**: Built-in navigation and history management
- **📱 Nested Routes**: Support for complex nested routing structures

## 🚀 Quick Start

### Basic Setup

Create your pages in the `src/pages` directory:

```
src/pages/
├── index.tsx          # Route: /
├── about.tsx          # Route: /about
├── users/
│   ├── index.tsx      # Route: /users
│   └── [id].tsx       # Route: /users/:id
├── posts/
│   ├── index.tsx      # Route: /posts
│   ├── [id].tsx       # Route: /posts/:id
│   └── [...slug].tsx  # Route: /posts/* (catch-all)
└── layout.tsx         # Layout wrapper for all routes
```

### Router Creation

```tsx
import { createRouter, createRouteConfig } from 'react-meta-framework';

// Create route configuration
const routeConfig = createRouteConfig('./src/pages', {
  conventions: {
    dynamicSegments: /\[([^\]]+)\]/g,
    catchAllSegments: /\[\.\.\.([^\]]+)\]/g
  }
});

// Create router instance
const router = createRouter(routeConfig);

// Initialize router
router.initialize();
```

### Route Usage

```tsx
import { Route } from 'react-meta-framework';

function App() {
  return (
    <div>
      <nav>
        <button onClick={() => router.navigate('/')}>Home</button>
        <button onClick={() => router.navigate('/about')}>About</button>
        <button onClick={() => router.navigate('/users/123')}>User 123</button>
      </nav>
      
      <main>
        <Route router={router} />
      </main>
    </div>
  );
}
```

## 📁 Filesystem Conventions

### File Naming Rules

| File Pattern | Route | Description |
|--------------|-------|-------------|
| `index.tsx` | `/` | Default route for directory |
| `about.tsx` | `/about` | Static route |
| `[id].tsx` | `/users/:id` | Dynamic segment |
| `[...slug].tsx` | `/posts/*` | Catch-all route |
| `layout.tsx` | N/A | Layout wrapper |

### Directory Structure Examples

#### Simple Routes
```
src/pages/
├── index.tsx          # /
├── about.tsx          # /about
├── contact.tsx        # /contact
└── pricing.tsx        # /pricing
```

#### Dynamic Routes
```
src/pages/
├── users/
│   ├── index.tsx      # /users
│   ├── [id].tsx       # /users/:id
│   └── [id]/
│       ├── profile.tsx    # /users/:id/profile
│       ├── settings.tsx   # /users/:id/settings
│       └── posts.tsx      # /users/:id/posts
└── products/
    ├── index.tsx      # /products
    ├── [category].tsx # /products/:category
    └── [category]/
        └── [id].tsx   # /products/:category/:id
```

#### Catch-all Routes
```
src/pages/
├── blog/
│   ├── index.tsx      # /blog
│   ├── [year].tsx     # /blog/2024
│   ├── [year]/
│   │   └── [month].tsx    # /blog/2024/03
│   └── [...slug].tsx      # /blog/* (catches all other routes)
└── docs/
    ├── index.tsx      # /docs
    └── [...slug].tsx  # /docs/* (catches all documentation routes)
```

## 🔧 Route Configuration

### Basic Configuration

```tsx
import { createRouteConfig } from 'react-meta-framework';

const routeConfig = createRouteConfig('./src/pages', {
  // Custom conventions
  conventions: {
    dynamicSegments: /\[([^\]]+)\]/g,
    catchAllSegments: /\[\.\.\.([^\]]+)\]/g
  },
  
  // Route options
  options: {
    strictMode: true,
    caseSensitive: false,
    trailingSlash: false
  }
});
```

### Advanced Configuration

```tsx
const advancedConfig = createRouteConfig('./src/pages', {
  conventions: {
    dynamicSegments: /\[([^\]]+)\]/g,
    catchAllSegments: /\[\.\.\.([^\]]+)\]/g
  },
  
  options: {
    strictMode: true,
    caseSensitive: false,
    trailingSlash: false
  },
  
  // Custom route processing
  processRoute: (route) => {
    // Add metadata to routes
    if (route.path.includes('admin')) {
      route.meta = { requiresAuth: true, role: 'admin' };
    }
    return route;
  },
  
  // Route validation
  validateRoute: (route) => {
    // Custom validation logic
    if (route.path.includes('private') && !route.meta?.requiresAuth) {
      throw new Error('Private routes must require authentication');
    }
    return true;
  }
});
```

## 🎭 Route Parameters

### Accessing Parameters

```tsx
// src/pages/users/[id].tsx
import { useRouteParams } from 'react-meta-framework';

function UserProfile() {
  const { id } = useRouteParams();
  
  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {id}</p>
    </div>
  );
}
```

### Multiple Parameters

```tsx
// src/pages/products/[category]/[id].tsx
import { useRouteParams } from 'react-meta-framework';

function ProductDetail() {
  const { category, id } = useRouteParams();
  
  return (
    <div>
      <h1>Product Detail</h1>
      <p>Category: {category}</p>
      <p>Product ID: {id}</p>
    </div>
  );
}
```

### Catch-all Parameters

```tsx
// src/pages/blog/[...slug].tsx
import { useRouteParams } from 'react-meta-framework';

function BlogPost() {
  const { slug } = useRouteParams();
  
  // slug will be an array: ['2024', '03', '15', 'my-post']
  const [year, month, day, title] = slug;
  
  return (
    <div>
      <h1>Blog Post: {title}</h1>
      <p>Date: {year}-{month}-{day}</p>
    </div>
  );
}
```

## 🔗 Navigation

### Programmatic Navigation

```tsx
import { useRouter } from 'react-meta-framework';

function NavigationComponent() {
  const router = useRouter();
  
  const handleNavigation = () => {
    // Navigate to a specific route
    router.navigate('/users/123');
    
    // Navigate with state
    router.navigate('/users/123', { 
      state: { from: 'dashboard' } 
    });
    
    // Navigate with query parameters
    router.navigate('/search?q=react&page=1');
  };
  
  const handleGoBack = () => {
    router.goBack();
  };
  
  const handleGoForward = () => {
    router.goForward();
  };
  
  return (
    <div>
      <button onClick={handleNavigation}>Go to User</button>
      <button onClick={handleGoBack}>Back</button>
      <button onClick={handleGoForward}>Forward</button>
    </div>
  );
}
```

### Link Component

```tsx
import { Link } from 'react-meta-framework';

function NavigationMenu() {
  return (
    <nav>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/about" className="nav-link">About</Link>
      <Link to="/users/123" className="nav-link">User Profile</Link>
      <Link to="/search?q=react" className="nav-link">Search</Link>
    </nav>
  );
}
```

### Active Route Detection

```tsx
import { useActiveRoute } from 'react-meta-framework';

function NavigationMenu() {
  const activeRoute = useActiveRoute();
  
  return (
    <nav>
      <Link 
        to="/" 
        className={`nav-link ${activeRoute === '/' ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        className={`nav-link ${activeRoute === '/about' ? 'active' : ''}`}
      >
        About
      </Link>
    </nav>
  );
}
```

## 🏗️ Layouts and Nested Routes

### Basic Layout

```tsx
// src/pages/layout.tsx
import { Outlet } from 'react-meta-framework';

function RootLayout() {
  return (
    <div className="app">
      <header>
        <h1>My App</h1>
        <NavigationMenu />
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer>
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  );
}
```

### Nested Layouts

```tsx
// src/pages/admin/layout.tsx
import { Outlet, useRouteParams } from 'react-meta-framework';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <AdminNavigation />
      </aside>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

// src/pages/admin/users/index.tsx
function AdminUsers() {
  return (
    <div>
      <h1>User Management</h1>
      <UserTable />
    </div>
  );
}
```

### Route Guards

```tsx
// src/pages/admin/layout.tsx
import { Outlet, useRouter } from 'react-meta-framework';
import { useEffect } from 'react';

function AdminLayout() {
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate('/login');
      return;
    }
    
    if (userRole !== 'admin') {
      router.navigate('/unauthorized');
      return;
    }
  }, [isAuthenticated, userRole]);
  
  if (!isAuthenticated || userRole !== 'admin') {
    return null;
  }
  
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

## 🔍 Route Generation

### Automatic Route Generation

```tsx
import { generateRoutes } from 'react-meta-framework';

// Generate routes from filesystem
const routes = await generateRoutes('./src/pages', {
  conventions: {
    dynamicSegments: /\[([^\]]+)\]/g,
    catchAllSegments: /\[\.\.\.([^\]]+)\]/g
  }
});

console.log('Generated Routes:', routes);
```

### Custom Route Generation

```tsx
import { createRouter } from 'react-meta-framework';

const router = createRouter(routeConfig);

// Generate routes manually
const routes = await router.generateRoutes('./src/pages');

// Add custom routes
router.addRoute({
  path: '/custom',
  component: CustomComponent,
  meta: { custom: true }
});

// Remove routes
router.removeRoute('/old-route');
```

## 📊 Route Information

### Route Metadata

```tsx
import { useRouteInfo } from 'react-meta-framework';

function RouteInfo() {
  const routeInfo = useRouteInfo();
  
  return (
    <div>
      <h2>Route Information</h2>
      <p>Path: {routeInfo.path}</p>
      <p>Params: {JSON.stringify(routeInfo.params)}</p>
      <p>Query: {JSON.stringify(routeInfo.query)}</p>
      <p>Meta: {JSON.stringify(routeInfo.meta)}</p>
    </div>
  );
}
```

### Route History

```tsx
import { useRouteHistory } from 'react-meta-framework';

function RouteHistory() {
  const history = useRouteHistory();
  
  return (
    <div>
      <h2>Route History</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {entry.path} - {entry.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 🎯 Best Practices

### File Organization

1. **Group Related Routes**: Keep related routes in the same directory
2. **Use Descriptive Names**: Make route names self-explanatory
3. **Consistent Naming**: Follow consistent naming conventions
4. **Avoid Deep Nesting**: Keep route nesting to a reasonable depth

### Performance

1. **Lazy Loading**: Use dynamic imports for large components
2. **Route Splitting**: Split routes by feature or page
3. **Caching**: Cache route components when appropriate
4. **Preloading**: Preload critical routes

### Security

1. **Route Guards**: Implement authentication and authorization
2. **Parameter Validation**: Validate route parameters
3. **Access Control**: Control access to sensitive routes
4. **Input Sanitization**: Sanitize user inputs

## 🚀 Advanced Features

### Custom Route Matchers

```tsx
const customConfig = createRouteConfig('./src/pages', {
  conventions: {
    // Custom dynamic segment pattern
    dynamicSegments: /:([^\/]+)/g,
    
    // Custom catch-all pattern
    catchAllSegments: /\*\*([^\/]+)/g
  }
});
```

### Route Middleware

```tsx
const router = createRouter(routeConfig);

// Add middleware
router.use((route, next) => {
  // Log route access
  console.log(`Accessing: ${route.path}`);
  
  // Add timing
  const start = performance.now();
  next();
  const end = performance.now();
  console.log(`Route took: ${end - start}ms`);
});

// Add authentication middleware
router.use((route, next) => {
  if (route.meta?.requiresAuth && !isAuthenticated()) {
    router.navigate('/login');
    return;
  }
  next();
});
```

### Route Transitions

```tsx
import { useRouteTransition } from 'react-meta-framework';

function App() {
  const { isTransitioning, transitionType } = useRouteTransition();
  
  return (
    <div className={`app ${isTransitioning ? 'transitioning' : ''}`}>
      {isTransitioning && (
        <div className={`transition-overlay ${transitionType}`}>
          <LoadingSpinner />
        </div>
      )}
      
      <Route router={router} />
    </div>
  );
}
```

## 🎉 Benefits

1. **🚀 Zero Configuration**: Works out of the box
2. **📁 Intuitive Structure**: Routes follow your file structure
3. **⚡ Automatic Generation**: No manual route definitions
4. **🔄 Dynamic Support**: Built-in dynamic and catch-all routes
5. **🎭 Parameter Handling**: Automatic parameter extraction
6. **🔗 Navigation Utilities**: Built-in navigation helpers
7. **🏗️ Layout Support**: Nested layouts and route composition
8. **📊 Route Information**: Access to route metadata and history

---

**Ready to build powerful, scalable routing with zero configuration?** 🛣️✨
