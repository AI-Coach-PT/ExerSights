import React from "react";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExerciseCard from "../components/ExerciseCard.js";
import { catalogText } from "../assets/content.js";

const exerciseImages = Object.fromEntries(
  Object.keys(catalogText).map((key) => [key, require(`../assets/exercise-cards/${key}.png`)])
);

/**
 * Catalog is a React functional component that displays a list of exercise cards.
 * It dynamically iterates through the catalogText object to generate the exercise cards.
 *
 * @returns {JSX.Element} A catalog page displaying exercises.
 */
function Catalog() {
  return (
    <Box sx={{ textAlign: "center", padding: "0.5rem" }}>
      <Typography variant="h1">Catalog</Typography>

      <Grid container spacing={2} sx={{ justifyContent: "center", padding: "1rem" }}>
        {Object.keys(catalogText).map((exerciseKey) => (
          <ExerciseCard
            key={exerciseKey}
            title={exerciseKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            description={catalogText[exerciseKey]}
            link={`/exercise?exercise=${exerciseKey}`}
            image={exerciseImages[exerciseKey]}
          />
        ))}
      </Grid>
    </Box>
  );
}

export default Catalog;
