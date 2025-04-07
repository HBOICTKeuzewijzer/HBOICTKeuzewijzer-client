# HBO-ICT Keuzewijzer

A study path advisor for HBO ICT part-time students at Windesheim.

A lightweight Single Page Application (SPA) built using modern JavaScript technologies. This project is designed to be fast, modular, and easy to extend.

## 🖥️ Tech Stack

| Technology        | Purpose                                            |
|-------------------|----------------------------------------------------|
| Vite              | Bundler for fast builds and hot module replacement |
| JavaScript (ES6+) | Core language for the app logic and components     |
| Web Components    | For creating reusable, encapsulated UI components  |
| HTML Templates    | For clean and maintainable structure               |
| CSS (Vanilla)     | For styling                                        |
| Vitest            | Unit testing framework with JSDOM support          |
| ESLint            | Code quality and style enforcement                 |
| Prettier          | Code formatting                                    |

## 📁 Project Structure

```bash
📦 HBOICTKeuzewijzer-client
├── 📂 src
│   ├── 📂 components       # Reusable web components (e.g., buttons, modals)
│   ├── 📂 pages            # Route-based components for different views
│   │   ├── 404.js         # Component for handling 404 (Not Found) errors
│   │   ├── home.js        # Home page component
│   │   └── layout.js      # Layout component for consistent page structure
│   ├── 📂 js              # Core JavaScript modules
│   │   └── app.js         # Main application entry point and initialization
│   ├── 📂 styles          # Global and component-specific styles
│   │   └── app.css        # Main stylesheet for global styles
│   ├── router.js          # Client-side routing logic
│   └── index.html         # Root HTML file (application entry point)
├── 📂 tests               # Unit and integration tests
├── .gitignore
├── package.json
├── vite.config.js
└── vitest.config.js
```

## 🎯 Features

- ✅ Client-side routing using history.pushState
- ✅ Dynamic imports for better performance
- ✅ Modular components using Web Components
- ✅ Clean and organized folder structure
- ✅ Testing setup with Vitest and JSDOM
- ✅ Code quality tools (ESLint, Prettier)

## 🚀 Getting Started
1. Install dependencies:
```bash
npm install
 ```

2. Start development server:
```bash
npm run dev
 ```

3. Build for production:
```bash
npm run build
 ```np

## 🧪 Testing
Run tests with:

```bash
npm test
 ```

## 📝 Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run clean` - Clean build directory
- `npm test` - Run tests
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint