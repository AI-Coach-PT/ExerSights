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
import { handleLogin, handleLogout } from "../utils/helpers/HandleLogin";
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
    { text: "Home", path: "/home", icon: <HomeIcon /> },
    { text: "Catalog", path: "/catalog", icon: <ListIcon /> },
    { text: "Program", path: "/program", icon: <ContentPasteIcon /> },
    { text: "FAQ", path: "/faq", icon: <EmailIcon /> },
    { text: "About", path: "/about", icon: <InfoIcon /> },
  ];
  const auth = getAuth();
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // call this method whenever authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true); // signed in
        setUsername(user.displayName);
      } else {
        setIsAuth(false); // signed out
        setUsername(""); // reset the username upon signing out
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
            <Box sx={{ mx: "8px" }}>
              <IconButton component={Link} to={item.path} sx={{ p: 0, m: 0 }}>
                {item.icon}
              </IconButton>
              <Button
                component={Link}
                to={item.path}
                variant="text"
                color="text.primary"
                sx={{ m: 0 }}>
                {item.text}
              </Button>
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
          <IconButton onClick={props.toggleDarkMode}>
            {props.darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          {isAuth && (
            <Typography
              variant="body1"
              sx={{
                userSelect: "none",
                display: { xs: "none", lg: "flex" },
              }}>
              Welcome {username}!
            </Typography>
          )}
          <Button
            onClick={isAuth ? handleLogout : handleLogin}
            variant="text"
            color="text.primary"
            sx={{ ml: "0.75rem" }}>
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
            <ListItem
              button
              onClick={() => {
                isAuth ? handleLogout() : handleLogin();
                handleDrawerToggle();
              }}>
              <ListItemText
                primary={isAuth ? "Logout" : "Login"}
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
