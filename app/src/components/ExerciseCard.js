import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import IconButton from '@mui/material/IconButton';

/**
 * A card component that displays exercise information with optional navigation functionality.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.image - URL of the image to be displayed in the card
 * @param {string} props.title - Title text to be displayed in the card
 * @param {string} props.description - Description text to be displayed in the card
 * @param {string} [props.link] - Optional URL for navigation when card is clicked. If not provided, card won't be clickable
 *
 * @returns {JSX.Element} A responsive Grid item containing a Card with image, title, and description
 *
 * @example
 * <ExerciseCard
 *   image="/path/to/image.jpg"
 *   title="Exercise Name"
 *   description="Exercise description here"
 *   link="/exercises/detail"
 * />
 */
function ExerciseCard({ image, title, description, link, isPinned = false, onPinToggle }) {
  return (
    <Grid
      size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
          borderRadius: "2rem",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onPinToggle();
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1,
            color: isPinned ? "primary.main" : "#555",
            "&:hover": {
              color: isPinned ? "#999" : "secondary.main"
            },
          }}
        >
          {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
        </IconButton>

        <CardActionArea component={link ? Link : "div"} to={link || undefined} variant="outlined">
          <Box
            sx={{
              width: "100%",
              height: "0",
              paddingTop: "56.25%",
              position: "relative",
            }}>
            <CardMedia
              component="img"
              image={image}
              sx={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </Box>
          <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default ExerciseCard;
