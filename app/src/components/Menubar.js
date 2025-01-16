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
import logo from "../assets/logoNoName.png";
import name from "../assets/productNameWhite.png";

/**
 * Menubar is a component that displays a navigation bar with links for all of the main pages.
 * The links are implemented using `react-router-dom` for client-side navigation.
 * The navigation bar appears at the top of the page (it is not a sidebar).
 *
 * @component
 * @returns {JSX.Element} A Material UI AppBar with navigation links.
 */
function Menubar() {
  const menuItems = [
    { text: "Home", path: "/home" },
    { text: "Catalog", path: "/catalog" },
    { text: "About", path: "/about" },
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
    <AppBar position="static" elevation={8}>
      <Toolbar>
        {/* logo */}
        <Box sx={{ display: "flex", flexGrow: 1, flexBasis: "0%", alignItems: "center" }}>
          <Box
            component="img"
            src={logo}
            sx={{
              height: 60,
              width: 60,
            }}
          />
          <Box
            component="img"
            src={name}
            sx={{
              height: 30,
              width: "fit-content",
              ml: "1vw",
              display: { xs: "none", md: "flex" },
            }}
          />
        </Box>
        {/* desktop navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            flexGrow: 1,
            flexBasis: "0%",
          }}>
          {menuItems.map((item) => (
            <Button key={item.text} component={Link} to={item.path}>
              <Typography
                variant="button"
                // textTransform={"none"}
                sx={{ color: "white" }}>
                {item.text}
              </Typography>
            </Button>
          ))}
        </Box>
        {/* login/logout button */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            flexBasis: "0%",
            justifyContent: "right",
            alignItems: "center",
          }}>
          {isAuth && (
            <Typography
              variant="body1"
              sx={{
                userSelect: "none",
                display: { xs: "none", md: "flex" },
              }}>
              Welcome {username}!
            </Typography>
          )}
          <Button
            onClick={isAuth ? handleLogout : handleLogin}
            sx={{ display: { xs: "none", md: "block" }, color: "white", ml: "1vw" }}>
            {isAuth ? "Logout" : "Login"}
          </Button>
        </Box>
        {/* drawer icon */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
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
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: "25vw" },
          }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                component={Link}
                key={item.text}
                to={item.path}
                onClick={handleDrawerToggle}>
                <ListItemText primary={item.text} sx={{ color: "white" }} />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={() => {
                isAuth ? handleLogout() : handleLogin();
                handleDrawerToggle();
              }}>
              <ListItemText primary={isAuth ? "Logout" : "Login"} sx={{ color: "white" }} />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
export default Menubar;
