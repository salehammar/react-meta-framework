import fs from 'fs-extra';
import path from 'path';
import { ecommerceTemplate } from './templates/ecommerce-template.js';
import { dashboardTemplate } from './templates/dashboard-template.js';

export interface TemplateConfig {
  name: string;
  description: string;
  files: Array<{
    path: string;
    content: string;
  }>;
}

export interface TemplateGenerator {
  generateTemplate: (templateType: string, projectName: string) => void;
  listTemplates: () => void;
}

export function generateTemplate(templateType: string, projectName: string): void {
  console.log(`🚀 Generating ${templateType} template for project: ${projectName}`);
  
  let template: TemplateConfig;
  
  switch (templateType.toLowerCase()) {
    case 'component':
      generateComponentTemplate(projectName);
      break;
    case 'page':
      generatePageTemplate(projectName);
      break;
    case 'store':
      generateStoreTemplate(projectName);
      break;
    case 'api':
      generateApiTemplate(projectName);
      break;
    case 'ecommerce':
      template = ecommerceTemplate;
      generateProjectFromTemplate(template, projectName);
      break;
    case 'dashboard':
      template = dashboardTemplate;
      generateProjectFromTemplate(template, projectName);
      break;
    default:
      console.log(`❌ Unknown template type: ${templateType}`);
      console.log('Available template types: component, page, store, api, ecommerce, dashboard');
      return;
  }
  
  console.log(`✅ ${templateType} template generated successfully!`);
}

export function listTemplates(): void {
  console.log('📋 Available Templates:');
  console.log('');
  console.log('🔧 Component Templates:');
  console.log('  component - Basic React component');
  console.log('  page - Page component with routing');
  console.log('  store - State management store');
  console.log('  api - API integration template');
  console.log('');
  console.log('🚀 Project Templates:');
  console.log('  ecommerce - Full e-commerce application');
  console.log('  dashboard - Admin dashboard with analytics');
  console.log('');
  console.log('Usage: npx react-meta generate <template-type> <project-name>');
}

function generateComponentTemplate(projectName: string): void {
  const componentContent = `import React from 'react';
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
}`;
  
  const outputPath = path.join(process.cwd(), projectName);
  fs.ensureDirSync(outputPath);
  fs.writeFileSync(path.join(outputPath, 'Component.tsx'), componentContent);
  console.log(`✅ Component template created at: ${outputPath}/Component.tsx`);
}

function generatePageTemplate(projectName: string): void {
  const pageContent = `import React from 'react';
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
}`;
  
  const outputPath = path.join(process.cwd(), projectName);
  fs.ensureDirSync(outputPath);
  fs.writeFileSync(path.join(outputPath, 'Page.tsx'), pageContent);
  console.log(`✅ Page template created at: ${outputPath}/Page.tsx`);
}

function generateStoreTemplate(projectName: string): void {
  const storeContent = `import { createReactiveState } from 'react-meta-framework';

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
};`;
  
  const outputPath = path.join(process.cwd(), projectName);
  fs.ensureDirSync(outputPath);
  fs.writeFileSync(path.join(outputPath, 'store.ts'), storeContent);
  console.log(`✅ Store template created at: ${outputPath}/store.ts`);
}

function generateApiTemplate(projectName: string): void {
  const apiContent = `import { createReactiveState, createStateMachine } from 'react-meta-framework';

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
      
      const response = await fetch(\`\${baseURL}\${endpoint}\`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
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
// const newUser = await api.post('/users', { name: 'John' });}`;
  
  const outputPath = path.join(process.cwd(), projectName);
  fs.ensureDirSync(outputPath);
  fs.writeFileSync(path.join(outputPath, 'api.ts'), apiContent);
  console.log(`✅ API template created at: ${outputPath}/api.ts`);
}

function generateProjectFromTemplate(template: TemplateConfig, projectName: string): void {
  console.log(`📁 Creating project structure for: ${projectName}`);
  
  // Create project directory
  const projectDir = path.join(process.cwd(), projectName);
  
  try {
    // Create project directory
    fs.ensureDirSync(projectDir);
    
    // Generate all files from template
    template.files.forEach((file: { path: string; content: string }) => {
      const filePath = path.join(projectDir, file.path);
      const fileDir = path.dirname(filePath);
      
      // Ensure directory exists
      fs.ensureDirSync(fileDir);
      
      // Write file content
      fs.writeFileSync(filePath, file.content);
      console.log(`  ✅ Created: ${file.path}`);
    });
    
    console.log(`\n🎉 Project '${projectName}' created successfully!`);
    console.log(`\n📁 Project structure:`);
    console.log(`  ${projectName}/`);
    template.files.forEach((file: { path: string; content: string }) => {
      console.log(`    ${file.path}`);
    });
    
    console.log(`\n🚀 Next steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
    
  } catch (error) {
    console.error(`❌ Error creating project: ${error}`);
    // Cleanup on error
    if (fs.existsSync(projectDir)) {
      fs.removeSync(projectDir);
    }
  }
}