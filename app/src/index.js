import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import PoseDetector from "./utils/PoseDetectorNew";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <PoseDetector />
    </React.StrictMode>
);
