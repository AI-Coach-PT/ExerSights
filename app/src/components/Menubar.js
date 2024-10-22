import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { handleLogin, handleLogout } from "../utils/HandleLogin";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

/**
 * Menubar is a component that displays a navigation bar with links for all of the main pages.
 * The links are implemented using `react-router-dom` for client-side navigation.
 * The navigation bar appears at the top of the page (it is not a sidebar).
 *
 * @component
 * @returns {JSX.Element} A Material UI AppBar with navigation links.
 */
function Menubar() {
    const [isAuth, setIsAuth] = useState(false);
    const [username, setUsername] = useState("");

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
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ userSelect: "none" }}>
                    AI Coach
                </Typography>
                <Box sx={{ flexGrow: 1, gap: 2, ml: 4 }}>
                    <Button color="inherit" component={Link} to="/home">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/catalog">
                        Catalog
                    </Button>
                    <Button color="inherit" component={Link} to="/about">
                        About
                    </Button>
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                {isAuth && (
                    <Typography variant="h6" component="div" sx={{ mr: 4, userSelect: "none" }}>
                        Welcome {username}!
                    </Typography>
                )}
                <Button color="inherit" onClick={isAuth ? handleLogout : handleLogin}>
                    {isAuth ? "Logout" : "Login"}
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Menubar;
