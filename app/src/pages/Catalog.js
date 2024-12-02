import React from "react";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExerciseCard from "../components/ExerciseCard.js";
import squatImg from "../assets/squat.png";
import bridgeImg from "../assets/bridge.png";
import deadBugImage from "../assets/deadBug.png";
import pushUpImage from "../assets/pushUp.png";
import pullUpImage from "../assets/pullUp.png";
import muscleUpImage from "../assets/muscleUp.png";
import latExtRotationImg from "../assets/latExtRotation.png";
import { catalogText } from "../assets/content.js";

/**
 * Catalog is a React functional component that displays a list of exercise cards.
 * Each card represents an exercise with a title, description, image, and link to a detailed page for that exercise.
 *
 * @component
 *
 * The cards inside the catalog are displayed in a 2-column grid. Each card is created using the `ExerciseCard` component,
 * and they provide a title, description, image, and link to the exercise's feedback page.
 *
 * @returns {JSX.Element} A catalog page displaying exercises.
 */
function Catalog() {
  return (
    <Box sx={{ textAlign: "center", m: "20px" }}>
      <Typography variant="h1" gutterBottom>
        Catalog
      </Typography>

      <Grid container spacing={2} sx={{ justifyContent: "center", mx: "30px" }}>
        <ExerciseCard
          title="Squat"
          description={catalogText.squat}
          link="/squat"
          image={squatImg}
        />
        <ExerciseCard
          title="Bridge"
          description={catalogText.bridge}
          link="/bridge"
          image={bridgeImg}
        />
        <ExerciseCard
          title="Dead Bug"
          description={catalogText.deadbug}
          link="/deadbug"
          image={deadBugImage}
        />
        <ExerciseCard
          title="Push-up"
          description={catalogText.pushup}
          link="/pushup"
          image={pushUpImage}
        />
        <ExerciseCard
          title="Pull-up"
          description={catalogText.pullup}
          link="/pullup"
          image={pullUpImage}
        />
        <ExerciseCard
          title="Muscle-up"
          description={catalogText.muscleup}
          link="/muscleup"
          image={muscleUpImage}
        />
        <ExerciseCard
          title="Lateral External Rotation"
          description={catalogText.latExtRotation}
          link="/latExtRotation"
          image={latExtRotationImg}
        />
      </Grid>
    </Box>
  );
}

export default Catalog;
