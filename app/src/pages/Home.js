import React from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/catalog.png";
import { disclaimerText } from "../assets/content";

function Home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/catalog");
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Box
        sx={{
          m: "20px",
        }}>
        <Typography variant="h1" gutterBottom>
          Welcome to ExerSights!
        </Typography>

        <Typography variant="h5" gutterBottom>
          AI-powered App for Fitness & Rehab
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary" }} gutterBottom>
          <Typography variant="body1" sx={{ color: "text.secondary" }} gutterBottom>
            Providing real-time feedback on exercise form using state-of-the-art computer vision
            models.
            <br />
            Track, correct, and improve your exercise form for safer, smarter, and more effective
            workouts.
          </Typography>
        </Typography>
      </Box>

      <Card
        sx={{
          width: { xs: "20rem", md: "40rem" },
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        onClick={handleNavigate}>
        <CardMedia
          component="img"
          image={logo}
          alt="Catalog Preview"
          sx={{ width: "40rem", display: { xs: "none", md: "block" } }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Explore Our Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Discover a variety of exercises tailored to your fitness and rehab needs.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: "0.5rem" }}>
            Go to Catalog
          </Button>
        </CardContent>
      </Card>

      <Typography variant="body2" sx={{ color: "text.secondary", m: "2rem" }}>
        {disclaimerText}
      </Typography>
    </Box>
  );
}

export default Home;
