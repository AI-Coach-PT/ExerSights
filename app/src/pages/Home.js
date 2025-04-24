import React from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import catalogPreview from "../assets/logos/catalogPreview.png";
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
        padding: "0.5rem",
      }}>
      <Box>
        <Typography variant="h1" sx={{ mb: "0.25rem" }}>
          Welcome to ExerSights!
        </Typography>
        <Typography variant="h5" sx={{ mb: "0.5rem" }}>
          AI-powered App for Fitness & Rehabilitation
        </Typography>
        <Typography variant="body1" sx={{ mb: "1.25rem", color: "text.secondary" }}>
          Providing real-time feedback on exercise form using state-of-the-art computer vision
          models.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "2.5rem",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          justifyItems: "center",
          alignContent: "center",
          flexDirection: "row",
          maxWidth: "90%",
        }}>
        <Card
          sx={{
            width: "36rem",
            cursor: "pointer",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
            },
            borderRadius: "2rem",
          }}
          onClick={handleNavigate}>
          <CardMedia component="img" image={catalogPreview} />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Explore Our Catalog
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Discover a variety of exercises tailored to your fitness and rehab needs.
            </Typography>
            <Button variant="contained" color="secondary" sx={{ mt: "0.5rem" }}>
              Go to Catalog
            </Button>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: "2rem",
            width: "36rem",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}>
          <CardMedia
            component="iframe"
            src="https://www.youtube.com/embed/a-16RUDbfmk?si=B4F6Q1K2--eXx2Ke"
            sx={{
              width: "100%",
              border: 0,
              aspectRatio: "16/9",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="YouTube video player"
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Not sure how to get started?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Watch our tutorial above!
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="body2" sx={{ color: "text.secondary", m: "2rem" }}>
        {disclaimerText}
      </Typography>
    </Box>
  );
}

export default Home;
