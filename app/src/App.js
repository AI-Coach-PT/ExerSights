import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import SquatPage from "./pages/exercises/SquatPage";
import Menubar from "./components/Menubar";
import BridgePage from "./pages/exercises/BridgePage";
import DeadBugPage from "./pages/exercises/DeadBugPage";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import PushUpPage from "./pages/exercises/PushUpPage";
import PullUpPage from "./pages/exercises/PullUpPage";
import LatExtRotationPage from "./pages/exercises/LatExtRotationPage";
import MuscleUpPage from "./pages/exercises/MuscleUpPage";

/**
 * The root component of the application, managing routing between different pages.
 * It uses `react-router-dom` to navigate between the main pages and specific exercise pages.
 * The Menubar component is displayed across all routes.
 *
 * @component
 * @returns {JSX.Element} The main app component with routing and navigation.
 */
function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Menubar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/squat" element={<SquatPage />} />
                    <Route path="/bridge" element={<BridgePage />} />
                    <Route path="/deadbug" element={<DeadBugPage />} />
                    <Route path="/pushup" element={<PushUpPage />} />
                    <Route path="/pullup" element={<PullUpPage />} />
                    <Route path="/muscleup" element={<MuscleUpPage />} />
                    <Route path="/latExtRotation" element={<LatExtRotationPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
