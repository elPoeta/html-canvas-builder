import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./lib/global.ts";

import "./index.css";
import { ThemeProvider } from "./providers/theme/theme-provider.tsx";
import ModalProvider from "./providers/modal/modal-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="canva-ui-theme">
    <React.StrictMode>
      <ModalProvider>
        <App />
      </ModalProvider>
    </React.StrictMode>
  </ThemeProvider>,
);
