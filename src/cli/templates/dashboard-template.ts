import { TemplateConfig } from "../template-generator.js";

export const dashboardTemplate: TemplateConfig = {
  name: "dashboard",
  description:
    "Simple dashboard application demonstrating React Meta Framework capabilities",
  files: [
    {
      path: "package.json",
      content:
        '{\n  "name": "dashboard-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "react-meta-framework": "^0.1.0",\n    "lucide-react": "^0.263.1",\n    "tailwindcss": "^3.3.0",\n    "autoprefixer": "^10.4.14",\n    "postcss": "^8.4.27"\n  },\n  "devDependencies": {\n    "@types/react": "^18.2.15",\n    "@types/react-dom": "^18.2.7",\n    "@vitejs/plugin-react": "^4.0.3",\n    "typescript": "^5.0.2",\n    "vite": "^4.4.5"\n  },\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc && vite build",\n    "preview": "vite preview"\n  }\n}',
    },
    {
      path: "vite.config.ts",
      content:
        "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 3000\n  }\n})",
    },
    {
      path: "tsconfig.json",
      content:
        '{\n  "compilerOptions": {\n    "target": "ES2020",\n    "useDefineForClassFields": true,\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx",\n    "strict": true\n  },\n  "include": ["src"]\n}',
    },
    {
      path: "tailwind.config.js",
      content:
        "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    \"./index.html\",\n    \"./src/**/*.{js,ts,jsx,tsx}\",\n  ],\n  theme: {\n    extend: {\n      colors: {\n        primary: {\n          50: '#f0f9ff',\n          500: '#0ea5e9',\n          600: '#0284c7',\n          700: '#0369a1',\n        }\n      }\n    },\n  },\n  plugins: [],\n}",
    },
    {
      path: "postcss.config.js",
      content:
        "export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}",
    },
    {
      path: "src/types/dashboard.ts",
      content:
        "export interface Metric {\n  id: string;\n  label: string;\n  value: number;\n  change: number;\n  changeType: 'increase' | 'decrease';\n  icon: string;\n}\n\nexport interface User {\n  id: string;\n  name: string;\n  email: string;\n  role: string;\n  status: string;\n}",
    },
    {
      path: "src/stores/dashboard-store.ts",
      content:
        "import { createReactiveState } from 'react-meta-framework';\nimport type { Metric, User } from '../types/dashboard.js';\n\nexport function createDashboardStore() {\n  const metrics = createReactiveState<Metric[]>([]);\n  const users = createReactiveState<User[]>([]);\n  const isLoading = createReactiveState(false);\n\n  const fetchDashboardData = async () => {\n    isLoading.setValue(true);\n    try {\n      // Simulate API call\n      await new Promise(resolve => setTimeout(resolve, 1000));\n      \n      // Mock metrics data\n      const mockMetrics: Metric[] = [\n        {\n          id: '1',\n          label: 'Total Users',\n          value: 12458,\n          change: 12.5,\n          changeType: 'increase',\n          icon: 'users'\n        },\n        {\n          id: '2',\n          label: 'Revenue',\n          value: 45678,\n          change: 8.2,\n          changeType: 'increase',\n          icon: 'dollar-sign'\n        },\n        {\n          id: '3',\n          label: 'Orders',\n          value: 892,\n          change: 3.1,\n          changeType: 'decrease',\n          icon: 'shopping-cart'\n        }\n      ];\n      \n      // Mock users data\n      const mockUsers: User[] = [\n        {\n          id: '1',\n          name: 'John Doe',\n          email: 'john@example.com',\n          role: 'Admin',\n          status: 'Active'\n        },\n        {\n          id: '2',\n          name: 'Jane Smith',\n          email: 'jane@example.com',\n          role: 'User',\n          status: 'Active'\n        }\n      ];\n      \n      metrics.setValue(mockMetrics);\n      users.setValue(mockUsers);\n    } catch (error) {\n      console.error('Failed to fetch dashboard data:', error);\n    } finally {\n      isLoading.setValue(false);\n    }\n  };\n\n  return {\n    metrics: metrics.value,\n    users: users.value,\n    isLoading: isLoading.value,\n    fetchDashboardData\n  };\n}",
    },
    {
      path: "src/components/MetricCard.tsx",
      content:
        'import React from \'react\';\nimport { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart } from \'lucide-react\';\nimport type { Metric } from \'../types/dashboard.js\';\n\ninterface MetricCardProps {\n  metric: Metric;\n}\n\nconst iconMap = {\n  users: Users,\n  \'dollar-sign\': DollarSign,\n  \'shopping-cart\': ShoppingCart\n};\n\nexport function MetricCard({ metric }: MetricCardProps) {\n  const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || Users;\n  \n  return (\n    <div className="bg-white rounded-lg shadow p-6">\n      <div className="flex items-center justify-between">\n        <div>\n          <p className="text-sm font-medium text-gray-600">{metric.label}</p>\n          <p className="text-2xl font-bold text-gray-900">{metric.value.toLocaleString()}</p>\n        </div>\n        <div className="p-3 bg-primary-50 rounded-full">\n          <IconComponent className="w-6 h-6 text-primary-600" />\n        </div>\n      </div>\n      \n      <div className="mt-4 flex items-center">\n        {metric.changeType === \'increase\' ? (\n          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />\n        ) : (\n          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />\n        )}\n        <span className="text-sm font-medium text-green-600">\n          {metric.change}%\n        </span>\n        <span className="text-sm text-gray-500 ml-1">from last month</span>\n      </div>\n    </div>\n  );\n}',
    },
    {
      path: "src/components/UserTable.tsx",
      content:
        'import React from \'react\';\nimport type { User } from \'../types/dashboard.js\';\n\ninterface UserTableProps {\n  users: User[];\n}\n\nexport function UserTable({ users }: UserTableProps) {\n  return (\n    <div className="bg-white rounded-lg shadow">\n      <div className="px-6 py-4 border-b border-gray-200">\n        <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>\n      </div>\n      <div className="overflow-x-auto">\n        <table className="min-w-full divide-y divide-gray-200">\n          <thead className="bg-gray-50">\n            <tr>\n              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>\n              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>\n              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>\n              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>\n            </tr>\n          </thead>\n          <tbody className="bg-white divide-y divide-gray-200">\n            {users.map((user) => (\n              <tr key={user.id}>\n                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>\n                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>\n                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>\n                <td className="px-6 py-4 whitespace-nowrap">\n                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">\n                    {user.status}\n                  </span>\n                </td>\n              </tr>\n            ))}\n          </tbody>\n        </table>\n      </div>\n    </div>\n  );\n}',
    },
    {
      path: "src/App.tsx",
      content:
        'import React from \'react\';\nimport { createDashboardStore } from \'./stores/dashboard-store.js\';\nimport { MetricCard } from \'./components/MetricCard.js\';\nimport { UserTable } from \'./components/UserTable.js\';\n\nfunction App() {\n  const dashboardStore = createDashboardStore();\n\n  React.useEffect(() => {\n    dashboardStore.fetchDashboardData();\n  }, []);\n\n  if (dashboardStore.isLoading()) {\n    return (\n      <div className="flex items-center justify-center min-h-screen">\n        <div className="text-center">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>\n          <p className="text-gray-600">Loading dashboard...</p>\n        </div>\n      </div>\n    );\n  }\n\n  return (\n    <div className="min-h-screen bg-gray-50">\n      <div className="max-w-7xl mx-auto px-4 py-8">\n        <div className="mb-8">\n          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>\n          <p className="text-gray-600">Welcome back! Here\'s what\'s happening with your business.</p>\n        </div>\n\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">\n          {dashboardStore.metrics().map((metric) => (\n            <MetricCard key={metric.id} metric={metric} />\n          ))}\n        </div>\n\n        <div className="mb-8">\n          <UserTable users={dashboardStore.users()} />\n        </div>\n      </div>\n    </div>\n  );\n}\n\nexport default App;',
    },
    {
      path: "src/main.tsx",
      content:
        "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.js';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n)",
    },
    {
      path: "src/index.css",
      content: "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
    },
    {
      path: "index.html",
      content:
        '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Dashboard - Admin Panel</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>',
    },
    {
      path: "README.md",
      content:
        "# Dashboard - Admin Panel\n\nA simple dashboard application built with React Meta Framework.\n\n## Features\n\n- 📊 Analytics dashboard with key metrics\n- 👥 User management table\n- ⚡ Performance optimized with React Meta Framework\n- 🎨 Modern UI with Tailwind CSS\n\n## Getting Started\n\n1. Install dependencies:\n   npm install\n\n2. Start development server:\n   npm run dev\n\n3. Open http://localhost:3000 in your browser.\n\n## Tech Stack\n\n- React 18 + TypeScript\n- React Meta Framework\n- Tailwind CSS\n- Vite\n\n## License\n\nMIT License - Built with React Meta Framework",
    },
  ],
};
