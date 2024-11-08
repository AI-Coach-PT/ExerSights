import React from "react";
import { Typography, Box } from "@mui/material";
import { disclaimerText } from "../assets/content";

function Home() {
    return (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h1" gutterBottom>
                Welcome to ExerSights!
            </Typography>

            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {disclaimerText}
            </Typography>
        </Box>
    );
}

export default Home;
