import React from 'react';
import { Typography, Box } from '@mui/material';
import { disclaimerText } from "../assets/content";

function Home() {
    return (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: "40px" }}>
                Welcome to ExerSights!
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }} height="5vh">
                {disclaimerText}
            </Typography>
        </Box>
    );
}

export default Home;