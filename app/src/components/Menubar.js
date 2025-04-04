import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import exerSightsLogo from "../assets/logos/logoNoName.png";
import exerSightsNameWhite from "../assets/logos/productNameWhite.png";
import exerSightsNameBlack from "../assets/logos/productNameBlack.png";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Menubar is a component that displays a navigation bar with links for all of the main pages.
 * The links are implemented using `react-router-dom` for client-side navigation.
 * The navigation bar appears at the top of the page (it is not a sidebar).
 *
 * @component
 * @returns {JSX.Element} A Material UI AppBar with navigation links.
 */
function Menubar(props) {
  const menuItems = [
    { text: "HOME", path: "/home", icon: <HomeIcon /> },
    { text: "CATALOG", path: "/catalog", icon: <ListIcon /> },
    { text: "PROGRAM", path: "/program", icon: <ContentPasteIcon /> },
    { text: "FAQ", path: "/faq", icon: <EmailIcon /> },
    { text: "ABOUT", path: "/about", icon: <InfoIcon /> },
  ];
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("User logged in successfully!");
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully!");
        if (location.pathname === "/myExerSights") {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  // call this method whenever authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true); // signed in
      } else {
        setIsAuth(false); // signed out
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <AppBar
      position="static"
      elevation={8}
      sx={{ mt: "0.25rem", mb: "1rem", borderRadius: "3rem" }}>
      <Toolbar>
        {/* logo */}
        <Box
          component={Link}
          to="/"
          sx={{ display: "flex", flexGrow: 1, flexBasis: "0%", alignItems: "center" }}>
          <Box
            component="img"
            src={exerSightsLogo}
            sx={{
              height: "60px",
              width: "60px",
            }}
          />
          <Box
            component="img"
            src={props.darkMode ? exerSightsNameWhite : exerSightsNameBlack}
            sx={{
              height: "30px",
              width: "200px",
              ml: "0.5vw",
            }}
          />
        </Box>

        {/* desktop navigation */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            justifyContent: "center",
          }}>
          {menuItems.map((item) => (
            <Box sx={{ mx: "6px" }}>
              <IconButton
                component={Link}
                to={item.path}
                sx={{ gap: "3px", color: "text.primary" }}>
                {item.icon}
                <Typography fontWeight={500} color="text.primary">
                  {item.text}
                </Typography>
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* toggle dark mode, login/logout button */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            flexGrow: 1,
            flexBasis: "0%",
            justifyContent: "right",
            alignItems: "center",
          }}>
          <IconButton onClick={props.toggleDarkMode} sx={{ color: "text.primary" }}>
            {props.darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          {isAuth && (
            <IconButton
              component={Link}
              to="/myExerSights"
              sx={{ gap: "2px", color: "text.primary" }}>
              <AccountCircleIcon />
              <Typography fontWeight={500} color="text.primary" sx={{ overflow: "none" }}>
                MY EXERSIGHTS
              </Typography>
            </IconButton>
          )}
          <Button
            onClick={isAuth ? handleLogout : handleLogin}
            variant="text"
            color="text.primary"
            sx={{}}>
            {isAuth ? "Logout" : "Login"}
          </Button>
        </Box>

        {/* drawer icon */}
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            flexGrow: 1,
            justifyContent: "right",
          }}>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* mobile drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { maxWidth: "30vw" },
          }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                component={Link}
                key={item.text}
                to={item.path}
                onClick={handleDrawerToggle}>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color: "text.primary",
                    align: "center",
                  }}
                />
              </ListItem>
            ))}
            {isAuth && (
              <ListItem button component={Link} to="/myExerSights" onClick={handleDrawerToggle}>
                <ListItemText
                  primary={"MY EXERSIGHTS"}
                  primaryTypographyProps={{
                    color: "text.primary",
                    align: "center",
                  }}
                />
              </ListItem>
            )}
            <ListItem
              button
              onClick={() => {
                isAuth ? handleLogout() : handleLogin();
                handleDrawerToggle();
              }}>
              <ListItemText
                primary={isAuth ? "LOGOUT" : "LOGIN"}
                primaryTypographyProps={{
                  color: "text.primary",
                  align: "center",
                }}
              />
            </ListItem>
            <ListItem button onClick={props.toggleDarkMode}>
              <ListItemText
                primary={props.darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                primaryTypographyProps={{
                  color: "text.primary",
                  align: "center",
                  alignItems: "center",
                }}
              />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
export default Menubar;
