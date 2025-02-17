import React from "react";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExerciseCard from "../components/ExerciseCard.js";
import squatImg from "../assets/exercise-cards/squat.png";
import bridgeImg from "../assets/exercise-cards/bridge.png";
import deadBugImage from "../assets/exercise-cards/deadBug.png";
import pushUpImage from "../assets/exercise-cards/pushUp.png";
import pullUpImage from "../assets/exercise-cards/pullUp.png";
import muscleUpImage from "../assets/exercise-cards/muscleUp.png";
import latExtRotationImg from "../assets/exercise-cards/latExtRotation.png";
import plankImg from "../assets/exercise-cards/plank.png";
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
          link="/exercise?exercise=squat"
          image={squatImg}
        />
        <ExerciseCard
          title="Bridge"
          description={catalogText.bridge}
          link="/exercise?exercise=bridge"
          image={bridgeImg}
        />
        <ExerciseCard
          title="Dead Bug"
          description={catalogText.deadbug}
          link="/exercise?exercise=deadbug"
          image={deadBugImage}
        />
        <ExerciseCard
          title="Push-up"
          description={catalogText.pushup}
          link="/exercise?exercise=pushup"
          image={pushUpImage}
        />
        <ExerciseCard
          title="Pull-up"
          description={catalogText.pullup}
          link="/exercise?exercise=pullup"
          image={pullUpImage}
        />
        <ExerciseCard
          title="Muscle-up"
          description={catalogText.muscleup}
          link="/exercise?exercise=muscleup"
          image={muscleUpImage}
        />
        <ExerciseCard
          title="Lateral External Rotation"
          description={catalogText.latExtRotation}
          link="/exercise?exercise=latExtRotation"
          image={latExtRotationImg}
        />
        <ExerciseCard
          title="Plank"
          description={catalogText.plank}
          link="/exercise?exercise=plank"
          image={plankImg}
        />

      </Grid>
    </Box>
  );
}

export default Catalog;
