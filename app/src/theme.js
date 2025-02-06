import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
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
