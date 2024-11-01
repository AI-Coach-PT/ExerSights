import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Create a base theme
let theme = createTheme({
    palette: {
        mode: "dark",
    },
    typography: {
        // Define global font family
        fontFamily: "Roboto, Arial, sans-serif",

        // Customizing h1 variant
        h1: {
            fontSize: "3rem", // Default size
            fontWeight: 700,
            lineHeight: 1.2,
            "@media (min-width:600px)": {
                fontSize: "4rem", // Medium screens (600px+)
            },
            "@media (min-width:960px)": {
                fontSize: "5rem", // Large screens (960px+)
            },
        },

        // Customizing h2 variant
        h2: {
            fontSize: "2.5rem",
            fontWeight: 600,
            "@media (min-width:600px)": {
                fontSize: "3.5rem",
            },
            "@media (min-width:960px)": {
                fontSize: "4.5rem",
            },
        },

        // Customizing body1 variant
        body1: {
            fontSize: "1rem", // Default size for small screens
            lineHeight: 1.5,
            "@media (min-width:600px)": {
                fontSize: "1.125rem", // Medium screens
            },
            "@media (min-width:960px)": {
                fontSize: "1.25rem", // Large screens
            },
        },

        // Customizing body2 variant
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.43,
            "@media (min-width:600px)": {
                fontSize: "1rem",
            },
        },

        // You can customize other variants similarly...
    },
});

// Make the typography responsive across breakpoints
theme = responsiveFontSizes(theme);

export default theme;
