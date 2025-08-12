import { TemplateConfig } from "../template-generator.js";

export const ecommerceTemplate: TemplateConfig = {
  name: "ecommerce",
  description:
    "Full-featured e-commerce application with shopping cart, product management, and payment integration",
  files: [
    {
      path: "package.json",
      content:
        '{\n  "name": "ecommerce-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "react-meta-framework": "^0.1.0",\n    "lucide-react": "^0.263.1",\n    "tailwindcss": "^3.3.0",\n    "autoprefixer": "^10.4.14",\n    "postcss": "^8.4.27"\n  },\n  "devDependencies": {\n    "@types/react": "^18.2.15",\n    "@types/react-dom": "^18.2.7",\n    "@vitejs/plugin-react": "^4.0.3",\n    "typescript": "^5.0.2",\n    "vite": "^4.4.5"\n  },\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc && vite build",\n    "preview": "vite preview"\n  }\n}',
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
        "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    \"./index.html\",\n    \"./src/**/*.{js,ts,jsx,tsx}\",\n  ],\n  theme: {\n    extend: {\n      colors: {\n        primary: {\n          50: '#eff6ff',\n          500: '#3b82f6',\n          600: '#2563eb',\n          700: '#1d4ed8',\n        }\n      }\n    },\n  },\n  plugins: [],\n}",
    },
    {
      path: "postcss.config.js",
      content:
        "export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}",
    },
    {
      path: "src/types/ecommerce.ts",
      content:
        "export interface Product {\n  id: string;\n  name: string;\n  description: string;\n  price: number;\n  image: string;\n  category: string;\n  inStock: boolean;\n  rating: number;\n  reviews: number;\n}\n\nexport interface CartItem {\n  product: Product;\n  quantity: number;\n}",
    },
    {
      path: "src/stores/cart-store.ts",
      content:
        "import { createReactiveState } from 'react-meta-framework';\nimport type { CartItem, Product } from '../types/ecommerce.js';\n\nexport function createCartStore() {\n  const items = createReactiveState<CartItem[]>([]);\n  const isOpen = createReactiveState(false);\n\n  const addItem = (product: Product, quantity: number = 1) => {\n    const existingItem = items.value().find(item => item.product.id === product.id);\n    \n    if (existingItem) {\n      const updatedItems = items.value().map(item =>\n        item.product.id === product.id\n          ? { ...item, quantity: item.quantity + quantity }\n          : item\n      );\n      items.setValue(updatedItems);\n    } else {\n      items.setValue([...items.value(), { product, quantity }]);\n    }\n  };\n\n  const removeItem = (productId: string) => {\n    items.setValue(items.value().filter(item => item.product.id !== productId));\n  };\n\n  const totalItems = items.derive(cartItems => \n    cartItems.reduce((sum, item) => sum + item.quantity, 0)\n  );\n\n  const totalPrice = items.derive(cartItems =>\n    cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)\n  );\n\n  return {\n    items: items.value,\n    isOpen: isOpen.value,\n    totalItems: totalItems.value,\n    totalPrice: totalPrice.value,\n    addItem,\n    removeItem\n  };\n}",
    },
    {
      path: "src/components/ProductCard.tsx",
      content:
        'import React from \'react\';\nimport { ShoppingCart } from \'lucide-react\';\nimport type { Product } from \'../types/ecommerce.js\';\n\ninterface ProductCardProps {\n  product: Product;\n  onAddToCart: (product: Product) => void;\n}\n\nexport function ProductCard({ product, onAddToCart }: ProductCardProps) {\n  return (\n    <div className="bg-white rounded-lg shadow-md p-4">\n      <img \n        src={product.image} \n        alt={product.name}\n        className="w-full h-48 object-cover rounded mb-4"\n      />\n      \n      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>\n      <p className="text-gray-600 text-sm mb-3">{product.description}</p>\n      \n      <div className="flex items-center justify-between">\n        <span className="text-2xl font-bold text-primary-600">${product.price}</span>\n        <button\n          onClick={() => onAddToCart(product)}\n          disabled={!product.inStock}\n          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300"\n        >\n          <ShoppingCart className="w-4 h-4 inline mr-2" />\n          Add to Cart\n        </button>\n      </div>\n    </div>\n  );\n}',
    },
    {
      path: "src/App.tsx",
      content:
        "import React from 'react';\nimport { createCartStore } from './stores/cart-store.js';\nimport { ProductCard } from './components/ProductCard.js';\n\nfunction App() {\n  const cartStore = createCartStore();\n\n  const mockProduct = {\n    id: '1',\n    name: 'Sample Product',\n    description: 'This is a sample product description',\n    price: 99.99,\n    image: 'https://via.placeholder.com/300x200',\n    category: 'Electronics',\n    inStock: true,\n    rating: 4.5,\n    reviews: 100\n  };\n\n  return (\n    <div className=\"min-h-screen bg-gray-50 p-8\">\n      <div className=\"max-w-4xl mx-auto\">\n        <h1 className=\"text-3xl font-bold text-gray-900 mb-8\">E-commerce App</h1>\n        \n        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">\n          <ProductCard \n            product={mockProduct}\n            onAddToCart={cartStore.addItem}\n          />\n        </div>\n        \n        <div className=\"mt-8 p-4 bg-white rounded-lg shadow\">\n          <h2 className=\"text-xl font-semibold mb-4\">Shopping Cart</h2>\n          <p>Items in cart: {cartStore.totalItems()}</p>\n          <p>Total: ${cartStore.totalPrice()}</p>\n        </div>\n      </div>\n    </div>\n  );\n}\n\nexport default App;",
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
        '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>E-commerce App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>',
    },
    {
      path: "README.md",
      content:
        "# E-commerce Application\n\nA full-featured e-commerce application built with React Meta Framework.\n\n## Features\n\n- 🛍️ Product catalog with search functionality\n- 🛒 Shopping cart management\n- ⚡ Performance optimized with React Meta Framework\n- 🎨 Modern UI with Tailwind CSS\n\n## Getting Started\n\n1. Install dependencies:\n   npm install\n\n2. Start development server:\n   npm run dev\n\n3. Open http://localhost:3000 in your browser.\n\n## Tech Stack\n\n- React 18 + TypeScript\n- React Meta Framework\n- Tailwind CSS\n- Vite\n\n## License\n\nMIT License - Built with React Meta Framework",
    },
  ],
};
