# React Project Setup with Vite

## Project Initialization

### Prerequisites
- Node.js version 16 or higher
- npm or yarn package manager

### Vite Setup
1. Initialize new Vite project:
   ```bash
   npm create vite@latest frontend --template react
   cd frontend
   npm install
   ```

2. Install required dependencies:
   ```bash
   npm install tailwindcss@3 postcss autoprefixer
   npm install @vitejs/plugin-react
   npm install react-router-dom
   npm install axios
   npm install @tanstack/react-query
   npm install @hookform/resolvers
   npm install zod
   ```

3. Configure Tailwind CSS:
   ```bash
   npx tailwindcss init -p
   ```

4. Update tailwind.config.js:
   ```javascript
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           'background': '#050505',
           'panel': '#0A0A0A',
           'border': '#262626',
           'text-primary': '#F5F5F5',
           'text-muted': '#808080',
           'primary': '#FFB000',
           'ai-accent': '#00FF41',
           'destructive': '#FF3B30',
           'hover': '#1A1A1A'
         },
         fontFamily: {
           'heading': ['IBM Plex Sans', 'sans-serif'],
           'body': ['Inter', 'sans-serif'],
           'mono': ['JetBrains Mono', 'monospace']
         }
       },
     },
     plugins: [],
   }
   ```

5. Update src/index.css:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   body {
     @apply bg-background text-text-primary;
   }

   @layer base {
     h1, h2, h3, h4, h5, h6 {
       @apply font-heading font-bold;
     }

     body {
       @apply font-body;
     }
   }

   @layer components {
     .btn-primary {
       @apply bg-primary text-background px-4 py-2 rounded-sm border border-border font-mono uppercase;
     }

     .btn-secondary {
       @apply bg-panel text-text-primary border border-border font-mono px-4 py-2 rounded-sm;
     }

     .input-field {
       @apply bg-panel text-text-primary border border-border p-2 font-mono;
     }
   }
   ```

## Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── layout/
│   │   ├── parts/
│   │   ├── modals/
│   │   └── ui/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Vite Configuration

### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
```

## Development Workflow

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Development Environment Setup

1. Install Vite CLI:
   ```bash
   npm install -g create-vite
   ```

2. Create new project:
   ```bash
   create-vite my-react-app --template react
   ```

3. Install dependencies:
   ```bash
   cd my-react-app
   npm install
   ```

4. Install additional dependencies:
   ```bash
   npm install react-router-dom
   npm install axios
   npm install @tanstack/react-query
   npm install react-hook-form
   npm install tailwindcss postcss autoprefixer
   ```

5. Initialize Tailwind CSS:
   ```bash
   npx tailwindcss init -p
   ```

6. Configure Tailwind CSS in tailwind.config.js:
   ```javascript
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           background: '#050505',
           'panel': '#0A0A0A',
           'border': '#262626',
           'text-primary': '#F5F5F5',
           'text-muted': '#808080',
           'primary': '#FFB000',
           'ai-accent': '#00FF41',
           'destructive': '#FF3B30',
           'hover': '#1A1A1A'
         },
         fontFamily: {
           heading: ['IBM Plex Sans', 'sans-serif'],
           body: ['Inter', 'sans-serif'],
           mono: ['JetBrains Mono', 'monospace']
         }
       },
     },
     plugins: [],
   }
   ```

7. Update src/index.css:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   body {
     @apply bg-background text-text-primary font-body;
   }

   @layer components {
     .btn-primary {
       @apply bg-primary text-background px-4 py-2 font-mono uppercase tracking-wider border border-border;
     }

     .btn-secondary {
       @apply bg-panel text-text-primary border border-border font-mono px-4 py-2;
     }
   }
   ```

## Build and Deployment Configuration

### package.json Scripts
```json
{
  "name": "smart-electronics-lab-frontend",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "react-query": "^3.39.0",
    "react-hook-form": "^7.43.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "tailwindcss": "^3.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Development Tools Configuration

### ESLint Configuration
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}