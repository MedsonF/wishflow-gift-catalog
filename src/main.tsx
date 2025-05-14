
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a container for the app to render into
const container = document.getElementById("root");

// Make sure the container exists
if (!container) {
  throw new Error("Failed to find the root element");
}

// Create a root and render the app
const root = createRoot(container);
root.render(<App />);
