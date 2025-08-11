import fs from 'fs-extra';
import path from 'path';

export interface Route {
  path: string;
  component: string;
  params?: Record<string, string>;
  children?: Route[];
  dynamic?: boolean;
  catchAll?: boolean;
  layout?: boolean;
  index?: boolean;
}

export interface Router {
  routes: Route[];
  currentRoute: Route | null;
  navigate: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  generateRoutes: (pagesDir: string) => Promise<Route[]>;
  matchRoute: (pathname: string) => Route | null;
}

export interface RouteConfig {
  pagesDir: string;
  layoutsDir?: string;
  conventions?: {
    dynamicSegments?: string[];
    catchAllSegments?: string[];
    layoutFiles?: string[];
    indexFiles?: string[];
  };
}

/**
 * Creates a filesystem-based router with strict conventions
 * This automatically generates routes from file structure
 */
export function createRouter(config: RouteConfig): Router {
  const {
    pagesDir,
    layoutsDir = 'layouts',
    conventions = {
      dynamicSegments: ['[id]', '[slug]', '[param]'],
      catchAllSegments: ['[...slug]', '[...param]'],
      layoutFiles: ['layout.tsx', 'layout.jsx', 'layout.ts', 'layout.js'],
      indexFiles: ['index.tsx', 'index.jsx', 'index.ts', 'index.js']
    }
  } = config;

  let routes: Route[] = [];
  let currentRoute: Route | null = null;
  const history: string[] = [];
  let currentIndex = -1;

  /**
   * Generates routes from filesystem structure
   */
  const generateRoutes = async (pagesDir: string): Promise<Route[]> => {
    if (!await fs.pathExists(pagesDir)) {
      console.warn(`Pages directory does not exist: ${pagesDir}`);
      return [];
    }

    const generatedRoutes: Route[] = [];
    
    try {
      await scanDirectory(pagesDir, '', generatedRoutes, conventions);
      console.log(`Generated ${generatedRoutes.length} routes from ${pagesDir}`);
      
      // Update the router's routes array
      routes = generatedRoutes;
      
      return generatedRoutes;
    } catch (error) {
      console.error('Error generating routes:', error);
      return [];
    }
  };

  /**
   * Scans directory recursively to build route tree
   */
  const scanDirectory = async (
    dirPath: string, 
    routePath: string, 
    routes: Route[], 
    conventions: NonNullable<RouteConfig['conventions']>
  ) => {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        // Handle directory-based routing
        const segment = file;
        const isDynamic = conventions.dynamicSegments?.includes(segment);
        const isCatchAll = conventions.catchAllSegments?.includes(segment);
        
        let newRoutePath = routePath;
        if (isDynamic) {
          // Extract parameter name from [param] format
          const paramName = segment.slice(1, -1);
          newRoutePath = routePath ? `${routePath}/:${paramName}` : `:${paramName}`;
        } else if (isCatchAll) {
          // Extract parameter name from [...param] format
          const paramName = segment.slice(4, -1);
          newRoutePath = routePath ? `${routePath}/:${paramName}...` : `:${paramName}...`;
        } else {
          newRoutePath = routePath ? `${routePath}/${segment}` : `/${segment}`;
        }
        
        // Check for layout files in this directory
        const layoutFile = conventions.layoutFiles?.find(layout => 
          fs.existsSync(path.join(fullPath, layout))
        );
        
        if (layoutFile) {
          routes.push({
            path: newRoutePath,
            component: path.join(fullPath, layoutFile),
            layout: true,
            children: []
          });
        }
        
        // Recursively scan subdirectory
        await scanDirectory(fullPath, newRoutePath, routes, conventions);
        
      } else if (stat.isFile()) {
        // Handle file-based routing
        const ext = path.extname(file);
        const name = path.basename(file, ext);
        
        // Check if this is a dynamic or catch-all file
        const isDynamic = conventions.dynamicSegments?.includes(name);
        const isCatchAll = conventions.catchAllSegments?.includes(name);
        
        if (conventions.indexFiles?.includes(file)) {
          // Index route
          const route: Route = {
            path: routePath || '/',
            component: fullPath,
            index: true
          };
          
          if (routePath) {
            // Find parent layout route and add as child
            const parentRoute = findParentRoute(routes, routePath);
            if (parentRoute) {
              if (!parentRoute.children) parentRoute.children = [];
              parentRoute.children.push(route);
            } else {
              routes.push(route);
            }
          } else {
            routes.push(route);
          }
          
        } else if (ext.match(/\.(tsx|jsx|ts|js)$/)) {
          // Regular page route
          let finalRoutePath = routePath;
          if (isDynamic) {
            const paramName = name.slice(1, -1);
            finalRoutePath = routePath ? `${routePath}/:${paramName}` : `:${paramName}`;
          } else if (isCatchAll) {
            const paramName = name.slice(4, -1);
            finalRoutePath = routePath ? `${routePath}/:${paramName}...` : `:${paramName}...`;
          } else {
            finalRoutePath = routePath ? `${routePath}/${name}` : `/${name}`;
          }
          
          const route: Route = {
            path: finalRoutePath,
            component: fullPath
          };
          
          routes.push(route);
        }
      }
    }
  };

  /**
   * Finds parent route for nested routing
   */
  const findParentRoute = (routes: Route[], routePath: string): Route | null => {
    for (const route of routes) {
      if (route.path === routePath) {
        return route;
      }
      if (route.children) {
        const found = findParentRoute(route.children, routePath);
        if (found) return found;
      }
    }
    return null;
  };

  /**
   * Matches a pathname to a route
   */
  const matchRoute = (pathname: string): Route | null => {
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    
    for (const route of routes) {
      const match = matchRoutePattern(route.path, normalizedPath);
      if (match) {
        return { ...route, params: match };
      }
    }
    
    return null;
  };

  /**
   * Matches route pattern with actual pathname
   */
  const matchRoutePattern = (pattern: string, pathname: string): Record<string, string> | null => {
    // Convert route pattern to regex
    let regexPattern = pattern;
    
    // First handle catch-all segments
    regexPattern = regexPattern.replace(/:[^/]+\.\.\./g, '(.+)');
    
    // Then handle dynamic segments (but not catch-all)
    regexPattern = regexPattern.replace(/:[^/]+/g, '([^/]+)');
    
    // Finally escape slashes
    regexPattern = regexPattern.replace(/\//g, '\\/');
    
    const regex = new RegExp(`^${regexPattern}$`);
    const match = pathname.match(regex);
    
    if (!match) return null;
    
    // Extract parameters
    const params: Record<string, string> = {};
    const dynamicParams = pattern.match(/:[^/]+(?!\.\.\.)/g) || []; // Dynamic params that are NOT catch-all
    const catchAllParams = pattern.match(/:[^/]+\.\.\./g) || [];
    
    let paramIndex = 1;
    
    // Handle dynamic parameters
    dynamicParams.forEach((paramName) => {
      const key = paramName.slice(1); // Remove leading colon
      params[key] = match[paramIndex++];
    });
    
    // Handle catch-all parameters
    catchAllParams.forEach((paramName) => {
      const key = paramName.slice(1, -3); // Remove leading colon and trailing ...
      // For catch-all, we want everything after the base path
      const basePath = pattern.substring(0, pattern.indexOf(paramName));
      const remainingPath = pathname.substring(basePath.length);
      params[key] = remainingPath.startsWith('/') ? remainingPath.slice(1) : remainingPath;
    });
    
    return params;
  };

  /**
   * Navigate to a new route
   */
  const navigate = (pathname: string) => {
    const route = matchRoute(pathname);
    if (route) {
      // Add to history
      if (currentIndex < history.length - 1) {
        history.splice(currentIndex + 1);
      }
      history.push(pathname);
      currentIndex = history.length - 1;
      
      // Update the current route
      currentRoute = route;
      console.log(`Navigated to: ${pathname} -> ${route.component}`);
    } else {
      console.warn(`Route not found: ${pathname}`);
    }
  };

  /**
   * Go back in history
   */
  const goBack = () => {
    if (currentIndex > 0) {
      currentIndex--;
      const pathname = history[currentIndex];
      const route = matchRoute(pathname);
      if (route) {
        currentRoute = route;
        console.log(`Went back to: ${pathname}`);
      }
    }
  };

  /**
   * Go forward in history
   */
  const goForward = () => {
    if (currentIndex < history.length - 1) {
      currentIndex++;
      const pathname = history[currentIndex];
      const route = matchRoute(pathname);
      if (route) {
        currentRoute = route;
        console.log(`Went forward to: ${pathname}`);
      }
    }
  };

  return {
    routes,
    currentRoute,
    navigate,
    goBack,
    goForward,
    generateRoutes,
    matchRoute
  };
}

/**
 * Utility function to create route configuration
 */
export function createRouteConfig(pagesDir: string, options?: Partial<RouteConfig>): RouteConfig {
  return {
    pagesDir,
    layoutsDir: options?.layoutsDir || 'layouts',
    conventions: {
      dynamicSegments: ['[id]', '[slug]', '[param]'],
      catchAllSegments: ['[...slug]', '[...param]'],
      layoutFiles: ['layout.tsx', 'layout.jsx', 'layout.ts', 'layout.js'],
      indexFiles: ['index.tsx', 'index.jsx', 'index.ts', 'index.js'],
      ...options?.conventions
    }
  };
}

/**
 * Standalone function to generate routes from filesystem structure
 */
export async function generateRoutes(pagesDir: string, config?: Partial<RouteConfig>): Promise<Route[]> {
  const routeConfig = createRouteConfig(pagesDir, config);
  const router = createRouter(routeConfig);
  return router.generateRoutes(pagesDir);
}

/**
 * Example usage:
 * 
 * const router = createRouter(createRouteConfig('./pages'));
 * await router.generateRoutes('./pages');
 * 
 * // Or use the standalone function:
 * const routes = await generateRoutes('./pages');
 * 
 * // This will generate routes like:
 * // / -> pages/index.tsx
 * // /users -> pages/users/index.tsx
 * // /users/[id] -> pages/users/[id].tsx
 * // /posts -> pages/posts/index.tsx
 * // /posts/[...slug] -> pages/posts/[...slug].tsx
 */
