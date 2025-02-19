import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SquatPage from "./pages/exercises/SquatPage";
import Menubar from "./components/Menubar";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import ExercisePage from "./pages/exercises/ExercisePage";

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
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<Home />} />
          <Route path="/squat" element={<SquatPage />} />
          <Route path="/exercise" element={<ExercisePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
