import React, { useState } from "react";
import { Typography, Box, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExerciseCard from "../components/ExerciseCard.js";
import { catalogText } from "../assets/content.js";

const exerciseImages = Object.fromEntries(
  Object.keys(catalogText).map((key) => [key, require(`../assets/exercise-cards/${key}.png`)])
);

/**
 * Catalog is a React functional component that displays a list of exercise cards.
 * It dynamically iterates through the catalogText object to generate the exercise cards.
 * Includes a search bar to filter exercises by name or key.
 *
 * @returns {JSX.Element} A catalog page displaying exercises.
 */
function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExercises = Object.keys(catalogText).filter((exerciseKey) =>
    exerciseKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ textAlign: "center", padding: "0.5rem" }}>
      <Typography variant="h1">Catalog</Typography>
      <TextField
        label="Search Exercises"
        variant="outlined"
        fullWidth
        sx={{ margin: "1rem auto", maxWidth: "400px" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2} sx={{ justifyContent: "center", padding: "1rem" }}>
        {filteredExercises.map((exerciseKey) => (
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
