# Pulse Cart

Pulse Cart is a polished, portfolio-quality e-commerce product catalog web application built with HTML, CSS, and modern JavaScript. It is fully responsive, features client-side routing, product search, filters, cart management, lazy-loaded images, and local storage persistence.

## 📁 Project Structure

- `index.html` – Application entry point.
- `/css/style.css` – Responsive UI styles and animations.
- `/js/app.js` – Main client-side router and application state.
- `/js/router.js` – Route definitions and hash-based navigation.
- `/js/store.js` – Product data, cart persistence, and utility methods.
- `/components` – Reusable markup and layout components.
- `/pages` – Page-specific templates and interaction logic.
- `/assets` – Supporting assets and image placeholders.
- `netlify.toml` – Deployment settings for Netlify.

## 🚀 Features

- Responsive navigation and mobile menu
- Home, Products, Product Details, Cart, About, and Contact pages
- Client-side routing without page reloads
- Product search and category filters
- Smooth loading state transitions
- Error handling for invalid routes and missing products
- Local Storage persistence for cart contents
- Add to Cart and Remove from Cart actions
- Cart item count badge in the navigation bar
- Lazy-loaded product images for performance
- Clean modern UI with hover effects and animated transitions

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES modules)

## 📦 Setup Instructions

1. Clone or copy the project files into a folder.
2. Open the folder in your code editor.
3. Open `index.html` in a browser or use a local HTTP server for best results.

### Local Server Options

- Use VS Code Live Server extension.
- Use Python:
  - `python -m http.server 5500`
- Use Node.js `http-server`:
  - `npx http-server . -p 5500`

## 📄 Deployment

### Netlify

1. Create a Netlify account and new site.
2. Drag and drop the project folder or connect your Git repository.
3. Set the publish directory to the root folder.
4. Deploy.

### Vercel

1. Create a Vercel account and new project.
2. Import the repository or drag and drop the root folder.
3. Choose a static site deployment.
4. Deploy.

## 🎯 Notes

- The app is optimized for deployment as a static site.
- Cart data persists in local storage between browser sessions.
- The design uses modern layout patterns and accessible semantics.
