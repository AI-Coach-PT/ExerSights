import React from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { disclaimerText } from "../assets/content"

function Home() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/catalog");
    };

    return (
        <Box sx={{ textAlign: "center" }}>
            <Box
                sx={{
                    padding: "40px",
                    borderRadius: "8px",
                    boxShadow: 2
                }}
            >
                <Typography variant="h1" gutterBottom>
                    Welcome to ExerSights!
                </Typography>

                <Typography variant="h5" gutterBottom>
                    AI-powered application for fitness & rehab
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: "20px", color: "text.secondary" }}>
                    <Typography variant="body1" sx={{ marginBottom: "20px", color: "text.secondary" }}>
                        Providing real-time feedback on exercise form using state-of-the-art computer vision models.<br />
                        Track, correct, and improve your exercise form for safer, smarter, and more effective workouts.
                    </Typography>
                </Typography>
            </Box>

            <Card
                sx={{
                    maxWidth: 400,
                    margin: "0 auto",
                    boxShadow: 3,
                    cursor: "pointer",
                    transition: "transform 0.3s",
                    "&:hover": {
                        transform: "scale(1.05)",
                    },
                }}
                onClick={handleNavigate}
            >
                <CardMedia
                    component="img"
                    height="300"
                    image={logo}
                    alt="Catalog Preview"
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Explore Our Catalog
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Discover a variety of exercises tailored to your fitness and rehab needs.
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ marginTop: "10px" }}>
                        Go to Catalog
                    </Button>
                </CardContent>
            </Card>

            <Typography variant="body2" sx={{ color: "text.secondary", marginTop: "80px" }}>
                {disclaimerText}
            </Typography>
        </Box>
    );
}

export default Home;
