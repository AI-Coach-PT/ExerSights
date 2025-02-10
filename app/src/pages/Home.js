import React from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/catalog.png";
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
          mb: "1rem",
          borderRadius: "2rem",
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

      <Typography variant="h1" sx={{ mb: "0.5rem" }}>
        Not sure how to get started?
      </Typography>
      <Typography variant="h3">Watch our tutorial below!</Typography>
      <Box sx={{ width: "30%", aspectRatio: "16/9" }}>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/MyhWLZnW5Hc?si=KR26nZ71EfauV9bp"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen></iframe>
      </Box>

      <Typography variant="body2" sx={{ color: "text.secondary", m: "2rem" }}>
        {disclaimerText}
      </Typography>
    </Box>
  );
}

export default Home;
