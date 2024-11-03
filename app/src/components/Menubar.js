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
import { handleLogin, handleLogout } from "../utils/HandleLogin";
import MenuIcon from "@mui/icons-material/Menu";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import logo from "../assets/logoNoName.png";

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
                {/* Logo */}
                <Box
                    component="img"
                    src={logo}
                    sx={{
                        height: 60,
                        width: 60,
                        mx: "1rem",
                    }}
                />
                {/* <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                        flexGrow: { xs: 1, md: 0 },
                    }}>
                    ExerSights
                </Typography> */}
                {/* Desktop Navigation */}
                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        justifyContent: "left",
                        flexGrow: 1,
                    }}>
                    {menuItems.map((item) => (
                        <Button key={item.text} component={Link} to={item.path}>
                            {item.text}
                        </Button>
                    ))}
                </Box>
                {/* Login/Logout Button */}
                <Box sx={{ display: "flex", justifyContent: "right" }}>
                    {isAuth && (
                        <Typography
                            variant="h2"
                            sx={{ userSelect: "none", display: { xs: "none", md: "flex" } }}>
                            Welcome {username}!
                        </Typography>
                    )}
                    <Button
                        onClick={isAuth ? handleLogout : handleLogin}
                        sx={{ display: { xs: "none", md: "block" } }}>
                        {isAuth ? "Logout" : "Login"}
                    </Button>
                </Box>
                {/* Drawer Icon */}
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
                {/* Mobile Drawer */}
                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": { width: 240 },
                    }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                key={item.text}
                                button
                                component={Link}
                                to={item.path}
                                onClick={handleDrawerToggle}>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        <ListItem
                            button
                            onClick={() => {
                                isAuth ? handleLogout() : handleLogin();
                                handleDrawerToggle();
                            }}>
                            <ListItemText primary={isAuth ? "Logout" : "Login"} />
                        </ListItem>
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}
export default Menubar;
