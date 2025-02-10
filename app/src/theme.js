import { createTheme, responsiveFontSizes } from "@mui/material/styles";
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

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: amber[700],
    },
    background: {
      default: "#212121",
      paper: "#0d0d0d",
    },
    text: {
      primary: grey[50],
      secondary: blueGrey[100],
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

export default theme;
