# HBO-ICT Keuzewijzer

A study path advisor for HBO ICT part-time students at Windesheim.

A lightweight Single Page Application (SPA) built using modern JavaScript technologies. This project is designed to be fast, modular, and easy to extend.

## 🚀 Tech Stack

| Technology        | Purpose                                           |
|-------------------|---------------------------------------------------|
| Vite	Bundler     | for fast builds and hot module replacement        |
| JavaScript (ES6+) |	Core language for the app logic and components    |
| Web Components    |	For creating reusable, encapsulated UI components |
| HTML Templates    |	For clean and maintainable structure              |
| CSS (Vanilla)     |	For styling                                       |

## 📁 Project Structure

📦 src
├── 📂 components        # Reusable web components
├── 📂 pages             # Page components (route-based)
│   ├── 📂 help
│   │   └── page.js
│   ├── 📂 test
│   │   └── page.js
│   ├── 404.js
│   └── page.js
├── 📂 router            # Routing logic
│   └── router.js
├── index.html           # Entry point
└── main.js              # App bootstrap file


## 🎯 Features
✅ Client-side routing using history.pushState
✅ Dynamic imports for better performance
✅ Modular components using Web Components
✅ Clean and organized folder structure