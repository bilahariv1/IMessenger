# WhatsApp Messenger MVC Demo

This workspace now contains a simple WhatsApp-style messaging app built using the
MVC pattern. The backend is a Node.js/Express API, and the frontend is a React
application. Hot reload is enabled for both server and client so that editing
code automatically restarts the server or refreshes the browser.

---

## Quick start

1. **Backend:**
   ```powershell
   cd backend
   npm install       # install dependencies
   npm run dev       # start with nodemon (watches .js/.json files)
   # or run both backend+frontend from one line:
   npm run dev:all
   ```
   Nodemon will restart the server whenever you change files under
   `controllers/`, `routes/`, `services/`, `models/` or `app.js`.

2. **Frontend:**
   ```powershell
   cd frontend
   npm install
   npm start         # react-scripts runs with hot reload
   ```
   The development server on port 3000 refreshes the page automatically when
   you edit any `.js` component or asset.

3. Open two browser windows/tabs or terminals to monitor both processes.

## How to run this app in the browser

Once both backend and frontend are running:

- Open your browser and go to `http://localhost:3000` to view the React
  application.
- The frontend automatically fetches messages from the backend API at
  `http://localhost:5000/api/messages`.
- When you click **Open** or **Reply** in the table, the app will display
  modals and send requests to the running server.

You only need one browser tab to work with the UI; the second tab suggestion
above is for watching logs or API responses separately if desired.

---

## Project structure

- `backend/` – Express application (models, controllers, routes, services)
- `frontend/` – React SPA with functional components and hooks
- `backend/mock/` – JSON mock data used by the service

---

## Live‑reloading details

The backend uses **nodemon** (configured in `backend/package.json` under
`nodemonConfig`). You can adjust the watched directories or file extensions if
you add TypeScript or other assets. The frontend uses Create React App's
built-in watcher.

When you save a file:

- server code changes → nodemon restarts the Node process automatically
- client code changes → browser refresh/hot module replacement via react-scripts

---

Feel free to explore the controllers, edit components, and experiment with
new endpoints. Happy hacking!
