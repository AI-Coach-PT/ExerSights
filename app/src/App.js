import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SquatPage from "./pages/exercises/SquatPage";
import Menubar from "./components/Menubar";
import BridgePage from "./pages/exercises/BridgePage";
import DeadBugPage from "./pages/exercises/DeadBugPage";
//import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import PushUpPage from "./pages/exercises/PushUpPage";
import PullUpPage from "./pages/exercises/PullUpPage";
import LatExtRotationPage from "./pages/exercises/LatExtRotationPage";
import MuscleUpPage from "./pages/exercises/MuscleUpPage";
import PlankPage from "./pages/exercises/PlankPage";
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightblue,
  cyan,
  teal,
  green,
  lightgreen,
  lime,
  yellow,
  amber,
  orange,
  deeporange,
  brown,
  grey,
  blueGrey,
} from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material";
import { useState } from "react";

/**
 * The root component of the application, managing routing between different pages.
 * It uses `react-router-dom` to navigate between the main pages and specific exercise pages.
 * The Menubar component is displayed across all routes.
 *
 * @component
 * @returns {JSX.Element} The main app component with routing and navigation.
 */
function App() {
  const [darkMode, setDarkMode] = useState(true);
  let theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#3f51b5" : "rgba(63,81,181,0.84)",
      },
      secondary: {
        main: amber[700],
      },
      background: {
        default: darkMode ? "#212121" : "white",
        paper: "#0d0d0d",
      },
      text: {
        primary: darkMode ? grey[50] : grey[900],
        secondary: darkMode ? blueGrey[100] : blueGrey[900],
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    typography: {
      fontFamily: "Lexend, Arial, sans-serif",
      h1: {
        fontSize: "3.125rem",
        fontWeight: 700,
        lineHeight: 1.2,
        xs: {
          fontSize: "4.125rem",
        },
        md: {
          fontSize: "5.125rem",
        },
        // fontFamily: "Poppins",
      },
      h2: {
        fontSize: "2.625rem",
        fontWeight: 600,
        sm: {
          fontSize: "3.625rem",
        },
        md: {
          fontSize: "4.625rem",
        },
      },
      h3: {
        fontSize: "2.125rem",
        fontWeight: 600,
        lineHeight: 1.3,
        sm: {
          fontSize: "2.625rem",
        },
        md: {
          fontSize: "3.125rem",
        },
      },
      h4: {
        fontSize: "1.8125rem",
        fontWeight: 600,
        lineHeight: 1.4,
        sm: {
          fontSize: "2.125rem",
        },
        md: {
          fontSize: "2.625rem",
        },
      },
      h5: {
        fontSize: "1.5625rem",
        fontWeight: 500,
        lineHeight: 1.4,
        sm: {
          fontSize: "1.8125rem",
        },
        md: {
          fontSize: "2.125rem",
        },
      },
      h6: {
        fontSize: "1.3125rem",
        fontWeight: 500,
        lineHeight: 1.4,
        sm: {
          fontSize: "1.5625rem",
        },
        md: {
          fontSize: "1.8125rem",
        },
      },
      subtitle1: {
        fontSize: "1.15625rem",
        fontWeight: 500,
        lineHeight: 1.5,
        sm: {
          fontSize: "1.3125rem",
        },
        md: {
          fontSize: "1.5625rem",
        },
      },
      subtitle2: {
        fontSize: "1.03125rem",
        fontWeight: 500,
        lineHeight: 1.5,
        sm: {
          fontSize: "1.15625rem",
        },
        md: {
          fontSize: "1.3125rem",
        },
      },
      body1: {
        fontSize: "1.03125rem",
        lineHeight: 1.5,
        sm: {
          fontSize: "1.15625rem",
        },
        md: {
          fontSize: "1.3125rem",
        },
      },
      body2: {
        fontSize: "0.90625rem",
        lineHeight: 1.43,
        sm: {
          fontSize: "1.03125rem",
        },
      },
      button: {
        fontSize: "0.9875rem",
        fontWeight: 500,
        lineHeight: 1.75,
        textTransform: "uppercase",
      },
      caption: {
        fontSize: "0.78125rem",
        lineHeight: 1.66,
        fontWeight: 400,
      },
      overline: {
        fontSize: "0.78125rem",
        fontWeight: 400,
        lineHeight: 2.66,
        textTransform: "uppercase",
      },
    },
  });

  theme = responsiveFontSizes(theme);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Menubar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<Home />} />
          <Route path="/squat" element={<SquatPage />} />
          <Route path="/bridge" element={<BridgePage />} />
          <Route path="/deadbug" element={<DeadBugPage />} />
          <Route path="/pushup" element={<PushUpPage />} />
          <Route path="/pullup" element={<PullUpPage />} />
          <Route path="/muscleup" element={<MuscleUpPage />} />
          <Route path="/latExtRotation" element={<LatExtRotationPage />} />
          <Route path="/plank" element={<PlankPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
