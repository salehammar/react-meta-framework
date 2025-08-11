import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CreateProjectOptions {
  template?: string;
  yes?: boolean;
}

export async function createProject(projectName: string, options: CreateProjectOptions = {}) {
  const { template = 'default', yes = false } = options;
  
  const spinner = ora('Creating project...').start();
  
  try {
    // Create project directory
    const projectPath = path.resolve(process.cwd(), projectName);
    
    if (await fs.pathExists(projectPath)) {
      spinner.fail(`Directory "${projectName}" already exists`);
      throw new Error(`Directory "${projectName}" already exists`);
    }
    
    await fs.ensureDir(projectPath);
    
    // Generate project files based on template
    await generateProjectFiles(projectPath, template);
    
    spinner.succeed('Project created successfully!');
    
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}

async function generateProjectFiles(projectPath: string, template: string) {
  const templates = {
    default: generateDefaultTemplate,
    typescript: generateTypeScriptTemplate,
    minimal: generateMinimalTemplate
  };
  
  const templateFn = templates[template as keyof typeof templates] || generateDefaultTemplate;
  await templateFn(projectPath);
}

async function generateDefaultTemplate(projectPath: string) {
  // Package.json
  const packageJson = {
    name: path.basename(projectPath),
    version: "0.1.0",
    type: "module",
    scripts: {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview",
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-meta-framework": "file:../"
    },
    devDependencies: {
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "@typescript-eslint/eslint-plugin": "^6.0.0",
      "@typescript-eslint/parser": "^6.0.0",
      "@vitejs/plugin-react": "^4.0.0",
      "eslint": "^8.0.0",
      "eslint-plugin-react-hooks": "^4.6.0",
      "eslint-plugin-react-refresh": "^0.4.0",
      "typescript": "^5.0.0",
      "vite": "^4.0.0"
    }
  };
  
  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  
  // Vite config
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})`;
  
  await fs.writeFile(path.join(projectPath, 'vite.config.ts'), viteConfig);
  
  // TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }]
  };
  
  await fs.writeJson(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
  
  // Create src directory and main files
  await fs.ensureDir(path.join(projectPath, 'src'));
  
  // Main App component
  const appComponent = `import React from 'react';
import { createReactiveState, createStateMachine } from 'react-meta-framework';

// Example of reactive state
const counter = createReactiveState(0);
const loadingMachine = createStateMachine('idle', {}, [
  { from: 'idle', to: 'loading', event: 'start' },
  { from: 'loading', to: 'success', event: 'complete' }
]);

function App() {
  const handleIncrement = () => {
    counter.setValue(prev => prev + 1);
  };

  const handleStartLoading = () => {
    loadingMachine.send('start');
    setTimeout(() => loadingMachine.send('complete'), 2000);
  };

  return (
    <div className="App">
      <h1>React Meta Framework Demo</h1>
      
      <div className="counter-section">
        <h2>Counter: {counter.value()}</h2>
        <button onClick={handleIncrement}>Increment</button>
      </div>
      
      <div className="state-machine-section">
        <h2>State Machine: {loadingMachine.currentState}</h2>
        <button 
          onClick={handleStartLoading}
          disabled={loadingMachine.currentState === 'loading'}
        >
          {loadingMachine.currentState === 'loading' ? 'Loading...' : 'Start Loading'}
        </button>
      </div>
    </div>
  );
}

export default App;`;
  
  await fs.writeFile(path.join(projectPath, 'src/App.tsx'), appComponent);
  
  // Main entry point
  const mainEntry = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
  
  await fs.writeFile(path.join(projectPath, 'src/main.tsx'), mainEntry);
  
  // CSS file
  const cssContent = `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.App {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.counter-section, .state-machine-section {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f0f0f0;
  cursor: pointer;
}

button:hover {
  background: #e0e0e0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`;
  
  await fs.writeFile(path.join(projectPath, 'src/index.css'), cssContent);
  
  // HTML template
  const htmlTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Meta Framework App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  
  await fs.writeFile(path.join(projectPath, 'index.html'), htmlTemplate);
  
  // README
  const readme = `# React Meta Framework Project

This project was created with the React Meta Framework CLI.

## Features

- **Reactive State**: Automatic dependency tracking without manual useMemo/useCallback
- **State Machines**: Built-in state management for complex logic
- **Zero Config**: Minimal setup with sensible defaults
- **TypeScript**: Full type safety out of the box

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Learn More

- [React Meta Framework Documentation](https://github.com/your-org/react-meta-framework)
- [Examples and Templates](https://github.com/your-org/react-meta-framework/tree/main/examples)
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function generateTypeScriptTemplate(projectPath: string) {
  // Similar to default but with more TypeScript-specific features
  await generateDefaultTemplate(projectPath);
}

async function generateMinimalTemplate(projectPath: string) {
  // Minimal setup with just the essentials
  await generateDefaultTemplate(projectPath);
}
