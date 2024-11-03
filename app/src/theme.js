import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
    colorSchemes: {
        dark: true,
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
            fontSize: "3rem",
            fontWeight: 700,
            lineHeight: 1.2,
            xs: {
                fontSize: "4rem",
            },
            md: {
                fontSize: "5rem",
            },
        },
        h2: {
            fontSize: "2.5rem",
            fontWeight: 600,
            sm: {
                fontSize: "3.5rem",
            },
            md: {
                fontSize: "4.5rem",
            },
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
            sm: {
                fontSize: "1.125rem",
            },
            md: {
                fontSize: "1.25rem",
            },
        },
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.43,
            sm: {
                fontSize: "1rem",
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;
