import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Menubar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div">
                    AI Coach
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, ml: 4 }}>
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
                <Button color="inherit" component={Link} to="/home">
                    Login
                </Button>
            </Toolbar>
        </AppBar >
    );
}

export default Menubar;
