import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import PWAPrompt from "react-ios-pwa-prompt";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <PWAPrompt
      promptOnVisit={1}
      timesToShow={3}
      copyClosePrompt="Close"
      permanentlyHideOnDismiss={false}
    />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
