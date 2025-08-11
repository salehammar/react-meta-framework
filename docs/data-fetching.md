# Data Fetching Guide 📡

React Meta Framework provides intelligent data fetching strategies that automatically select the best approach (SSR, SSG, ISR) based on your data requirements, with built-in caching, revalidation, and React hooks.

## 🎯 Overview

The data fetching system provides:

- **🧠 Intelligent Strategy Selection**: Automatic SSR/SSG/ISR strategy detection
- **💾 Smart Caching**: Intelligent caching with automatic invalidation
- **🔄 Revalidation**: Background updates and cache refresh
- **⚡ React Hooks**: Seamless integration with React components
- **📊 Cache Analytics**: Monitor cache performance and hit rates
- **🎭 Tag-based Invalidation**: Precise cache control with tags
- **🌐 Universal Support**: Works in browser, Node.js, and edge environments

## 🚀 Quick Start

### Basic Data Fetching

```tsx
import { useQuery, createDataFetcher } from 'react-meta-framework';

function UserProfile({ userId }) {
  const { data, loading, error, refetch } = useQuery(
    `/api/users/${userId}`,
    {
      tags: ['users', `user:${userId}`],
      revalidate: 300, // 5 minutes
      fallback: { name: 'Loading...' }
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Advanced Data Fetcher

```tsx
import { createDataFetcher } from 'react-meta-framework';

const dataFetcher = createDataFetcher({
  baseURL: 'https://api.example.com',
  defaultOptions: {
    revalidate: 600, // 10 minutes
    tags: ['api'],
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
});

// Use the fetcher instance
const { data, loading, error } = dataFetcher.useQuery('/users', {
  tags: ['users'],
  revalidate: 300
});
```

## 🔧 Configuration

### Data Fetcher Options

```tsx
const dataFetcher = createDataFetcher({
  // Base configuration
  baseURL: 'https://api.example.com',
  
  // Default options for all requests
  defaultOptions: {
    revalidate: 600,
    tags: ['api'],
    headers: {
      'Content-Type': 'application/json'
    }
  },
  
  // Cache configuration
  cache: {
    maxSize: 1000,
    ttl: 3600000, // 1 hour
    strategy: 'lru'
  },
  
  // Revalidation configuration
  revalidation: {
    background: true,
    interval: 300000, // 5 minutes
    onError: (error) => console.error('Revalidation failed:', error)
  }
});
```

### Request Options

```tsx
const { data, loading, error } = useQuery('/api/posts', {
  // Cache configuration
  tags: ['posts', 'blog'],
  revalidate: 300, // 5 minutes
  staleWhileRevalidate: 600, // 10 minutes
  
  // Request configuration
  method: 'POST',
  body: JSON.stringify({ title: 'New Post' }),
  headers: {
    'Authorization': `Bearer ${token}`
  },
  
  // Cache behavior
  cache: 'force-cache', // 'force-cache', 'no-cache', 'reload'
  next: {
    revalidate: 300,
    tags: ['posts']
  }
});
```

## 💾 Caching Strategies

### Automatic Strategy Selection

The system automatically selects the best caching strategy:

```tsx
// Static data - cached indefinitely
const { data: staticData } = useQuery('/api/config', {
  tags: ['config'],
  revalidate: false
});

// Dynamic data - cached with revalidation
const { data: dynamicData } = useQuery('/api/users', {
  tags: ['users'],
  revalidate: 300
});

// Real-time data - minimal caching
const { data: realtimeData } = useQuery('/api/notifications', {
  tags: ['notifications'],
  revalidate: 0
});
```

### Tag-based Cache Management

```tsx
import { invalidateTag, getCacheStats } from 'react-meta-framework';

// Invalidate specific tags
await invalidateTag('users'); // Invalidate all user-related data
await invalidateTag('user:123'); // Invalidate specific user data

// Get cache statistics
const stats = getCacheStats();
console.log('Cache hits:', stats.hits);
console.log('Cache misses:', stats.misses);
console.log('Cache size:', stats.size);
console.log('Cache keys:', stats.keys);
```

### Cache Invalidation Patterns

```tsx
// Invalidate related data when user updates
const updateUser = async (userId, userData) => {
  await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
  
  // Invalidate related cache entries
  await invalidateTag(`user:${userId}`);
  await invalidateTag('users'); // User list
  await invalidateTag('dashboard'); // Dashboard stats
};

// Batch invalidation
const clearUserCache = async (userId) => {
  await Promise.all([
    invalidateTag(`user:${userId}`),
    invalidateTag('users'),
    invalidateTag('dashboard'),
    invalidateTag('analytics')
  ]);
};
```

## 🔄 Revalidation Strategies

### Background Revalidation

```tsx
const { data, loading, error } = useQuery('/api/posts', {
  tags: ['posts'],
  revalidate: 300, // Revalidate every 5 minutes
  background: true, // Update in background
  fallback: true // Show stale data while revalidating
});
```

### On-demand Revalidation

```tsx
import { revalidateTag } from 'react-meta-framework';

function PostEditor({ postId }) {
  const { data, loading, error, refetch } = useQuery(`/api/posts/${postId}`, {
    tags: ['posts', `post:${postId}`]
  });

  const handleSave = async (postData) => {
    await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    });
    
    // Revalidate related data
    await revalidateTag(`post:${postId}`);
    await revalidateTag('posts');
  };

  return (
    <form onSubmit={handleSave}>
      {/* Form fields */}
    </form>
  );
}
```

### Conditional Revalidation

```tsx
const { data, loading, error } = useQuery('/api/weather', {
  tags: ['weather'],
  revalidate: (data) => {
    // Revalidate based on data freshness
    if (!data || Date.now() - data.timestamp > 300000) {
      return 0; // Revalidate immediately
    }
    return 300; // Revalidate in 5 minutes
  }
});
```

## 🎭 React Hooks Integration

### useQuery Hook

```tsx
import { useQuery } from 'react-meta-framework';

function UserList() {
  const { data, loading, error, refetch, mutate } = useQuery('/api/users', {
    tags: ['users'],
    revalidate: 300
  });

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={refetch}>Refresh</button>
      <button onClick={() => mutate([...data, newUser])}>
        Add User
      </button>
    </div>
  );
}
```

### useMutation Hook

```tsx
import { useMutation } from 'react-meta-framework';

function CreateUser() {
  const { mutate, loading, error, data } = useMutation('/api/users', {
    method: 'POST',
    onSuccess: (data) => {
      console.log('User created:', data);
      // Invalidate related cache
      invalidateTag('users');
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    }
  });

  const handleSubmit = (userData) => {
    mutate(userData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### useInfiniteQuery Hook

```tsx
import { useInfiniteQuery } from 'react-meta-framework';

function PostList() {
  const {
    data,
    loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery('/api/posts', {
    tags: ['posts'],
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    revalidate: 300
  });

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## 📊 Cache Analytics

### Cache Statistics

```tsx
import { getCacheStats } from 'react-meta-framework';

function CacheAnalytics() {
  const stats = getCacheStats();
  
  return (
    <div>
      <h2>Cache Performance</h2>
      <div>
        <p>Hit Rate: {((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(2)}%</p>
        <p>Total Requests: {stats.hits + stats.misses}</p>
        <p>Cache Size: {stats.size} entries</p>
        <p>Memory Usage: {(stats.memoryUsage / 1024 / 1024).toFixed(2)} MB</p>
      </div>
      
      <h3>Top Cached Keys</h3>
      <ul>
        {stats.topKeys.map(({ key, hits, size }) => (
          <li key={key}>
            {key}: {hits} hits, {size} bytes
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Performance Monitoring

```tsx
import { createPerformanceMonitor } from 'react-meta-framework';

const monitor = createPerformanceMonitor();

// Monitor data fetching performance
const { data, loading, error } = useQuery('/api/large-dataset', {
  tags: ['large-dataset'],
  onSuccess: (data) => {
    monitor.trackDataFetch('/api/large-dataset', {
      size: JSON.stringify(data).length,
      time: Date.now()
    });
  }
});

// Get performance insights
const insights = monitor.getDataFetchInsights();
console.log('Average fetch time:', insights.averageFetchTime);
console.log('Slowest endpoints:', insights.slowestEndpoints);
```

## 🌐 Environment Support

### Browser Environment

```tsx
// Automatic browser caching
const { data } = useQuery('/api/users', {
  tags: ['users'],
  revalidate: 300,
  cache: 'force-cache' // Use browser cache
});
```

### Node.js Environment

```tsx
// Server-side rendering
export async function getServerSideProps() {
  const dataFetcher = createDataFetcher({
    baseURL: process.env.API_URL
  });
  
  const users = await dataFetcher.fetch('/api/users', {
    tags: ['users'],
    revalidate: 300
  });
  
  return {
    props: {
      users
    }
  };
}
```

### Edge Environment

```tsx
// Edge function with caching
export default async function handler(req) {
  const dataFetcher = createDataFetcher({
    baseURL: 'https://api.example.com'
  });
  
  const data = await dataFetcher.fetch('/api/data', {
    tags: ['edge-data'],
    revalidate: 60 // 1 minute for edge
  });
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60'
    }
  });
}
```

## 🎯 Best Practices

### Cache Strategy

1. **Use Appropriate Tags**: Tag data logically for precise invalidation
2. **Set Reasonable TTL**: Balance freshness with performance
3. **Background Updates**: Use background revalidation for better UX
4. **Stale-while-revalidate**: Show stale data while updating

### Performance

1. **Batch Requests**: Group related requests together
2. **Lazy Loading**: Load data only when needed
3. **Debounce Updates**: Avoid excessive revalidation
4. **Monitor Performance**: Track cache hit rates and response times

### Error Handling

1. **Graceful Degradation**: Show fallback data on errors
2. **Retry Logic**: Implement exponential backoff
3. **User Feedback**: Inform users of data status
4. **Offline Support**: Cache critical data for offline use

## 🚀 Advanced Features

### Custom Cache Adapters

```tsx
import { createDataFetcher } from 'react-meta-framework';

class RedisCacheAdapter {
  constructor(redisClient) {
    this.redis = redisClient;
  }
  
  async get(key) {
    return await this.redis.get(key);
  }
  
  async set(key, value, ttl) {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async delete(key) {
    await this.redis.del(key);
  }
}

const dataFetcher = createDataFetcher({
  cache: new RedisCacheAdapter(redisClient)
});
```

### Request Interceptors

```tsx
const dataFetcher = createDataFetcher({
  interceptors: {
    request: (config) => {
      // Add authentication header
      config.headers.Authorization = `Bearer ${getToken()}`;
      return config;
    },
    response: (response) => {
      // Log response times
      console.log(`Request took: ${response.time}ms`);
      return response;
    },
    error: (error) => {
      // Handle authentication errors
      if (error.status === 401) {
        redirectToLogin();
      }
      return Promise.reject(error);
    }
  }
});
```

### Optimistic Updates

```tsx
function UserEditor({ userId }) {
  const { data, mutate } = useQuery(`/api/users/${userId}`, {
    tags: ['users', `user:${userId}`]
  });

  const updateUser = async (updates) => {
    // Optimistically update the cache
    const optimisticData = { ...data, ...updates };
    mutate(optimisticData, false); // Don't revalidate

    try {
      // Make the actual request
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      // Revalidate to get the real data
      mutate();
    } catch (error) {
      // Revert on error
      mutate(data);
      throw error;
    }
  };

  return (
    <form onSubmit={updateUser}>
      {/* Form fields */}
    </form>
  );
}
```

## 🎉 Benefits

1. **🧠 Intelligent Caching**: Automatic strategy selection
2. **⚡ Performance**: Built-in caching and optimization
3. **🔄 Real-time Updates**: Background revalidation
4. **🎭 React Integration**: Seamless hook integration
5. **💾 Smart Invalidation**: Tag-based cache control
6. **📊 Analytics**: Performance monitoring and insights
7. **🌐 Universal**: Works everywhere React runs
8. **🔧 Configurable**: Flexible and extensible

---

**Ready to build lightning-fast, intelligent data fetching?** 📡✨
