import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// REQUIRED health check endpoint
if (window.location.pathname === "/health") {
  document.body.innerHTML = "OK";
} else {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
