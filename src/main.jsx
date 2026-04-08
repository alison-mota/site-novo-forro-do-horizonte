import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/main.css";

if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    const faviconLink = document.querySelector('link[rel="icon"]');
    const faviconHref = faviconLink?.href ?? "(favicon não encontrado no head)";

    if (faviconLink) {
      const faviconProbe = new Image();
      faviconProbe.src = faviconHref;
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
