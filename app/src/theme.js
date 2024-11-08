import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
    // colorSchemes: {
    //     dark: true,
    // },
    // palette: {
    //     primary: {
    //         main: "#1976d2", // blue
    //         light: "#42a5f5",
    //         dark: "#1565c0",
    //         contrastText: "#fff",
    //     },
    //     secondary: {
    //         main: "#9c27b0", // purple
    //         light: "#ba68c8",
    //         dark: "#7b1fa2",
    //         contrastText: "#fff",
    //     },
    //     error: {
    //         main: "#d32f2f", // red
    //         light: "#ef5350",
    //         dark: "#c62828",
    //         contrastText: "#fff",
    //     },
    //     warning: {
    //         main: "#ed6c02", // orange
    //         light: "#ff9800",
    //         dark: "#e65100",
    //         contrastText: "#fff",
    //     },
    //     info: {
    //         main: "#0288d1", // light blue
    //         light: "#03a9f4",
    //         dark: "#01579b",
    //         contrastText: "#fff",
    //     },
    //     success: {
    //         main: "#2e7d32", // green
    //         light: "#4caf50",
    //         dark: "#1b5e20",
    //         contrastText: "#fff",
    //     },
    //     grey: {
    //         50: "#fafafa",
    //         100: "#f5f5f5",
    //         200: "#eeeeee",
    //         300: "#e0e0e0",
    //         400: "#bdbdbd",
    //         500: "#9e9e9e",
    //         600: "#757575",
    //         700: "#616161",
    //         800: "#424242",
    //         900: "#212121",
    //         A100: "#f5f5f5",
    //         A200: "#eeeeee",
    //         A400: "#bdbdbd",
    //         A700: "#616161",
    //     },
    //     text: {
    //         primary: "rgba(0, 0, 0, 0.87)",
    //         secondary: "rgba(0, 0, 0, 0.6)",
    //         disabled: "rgba(0, 0, 0, 0.38)",
    //     },
    //     background: {
    //         default: "#fff",
    //         paper: "#fff",
    //     },
    //     divider: "rgba(0, 0, 0, 0.12)",
    // },
    palette: {
        mode: "dark",
        primary: {
            main: "#3f51b5",
        },
        secondary: {
            main: "#f50057",
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
        h3: {
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.3,
            sm: {
                fontSize: "2.5rem",
            },
            md: {
                fontSize: "3rem",
            },
        },
        h4: {
            fontSize: "1.75rem",
            fontWeight: 600,
            lineHeight: 1.4,
            sm: {
                fontSize: "2rem",
            },
            md: {
                fontSize: "2.5rem",
            },
        },
        h5: {
            fontSize: "1.5rem",
            fontWeight: 500,
            lineHeight: 1.4,
            sm: {
                fontSize: "1.75rem",
            },
            md: {
                fontSize: "2rem",
            },
        },
        h6: {
            fontSize: "1.25rem",
            fontWeight: 500,
            lineHeight: 1.4,
            sm: {
                fontSize: "1.5rem",
            },
            md: {
                fontSize: "1.75rem",
            },
        },
        subtitle1: {
            fontSize: "1.125rem",
            fontWeight: 500,
            lineHeight: 1.5,
            sm: {
                fontSize: "1.25rem",
            },
            md: {
                fontSize: "1.5rem",
            },
        },
        subtitle2: {
            fontSize: "1rem",
            fontWeight: 500,
            lineHeight: 1.5,
            sm: {
                fontSize: "1.125rem",
            },
            md: {
                fontSize: "1.25rem",
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
        button: {
            fontSize: "0.875rem",
            fontWeight: 500,
            lineHeight: 1.75,
            textTransform: "uppercase",
        },
        caption: {
            fontSize: "0.75rem",
            lineHeight: 1.66,
            fontWeight: 400,
        },
        overline: {
            fontSize: "0.75rem",
            fontWeight: 400,
            lineHeight: 2.66,
            textTransform: "uppercase",
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;
