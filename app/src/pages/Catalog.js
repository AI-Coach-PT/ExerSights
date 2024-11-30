import React from "react";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExerciseCard from "../components/ExerciseCard.js";
import squatImg from "../assets/squat.jpg";
import bridgeImg from "../assets/bridge.jpg";
import deadBugImage from "../assets/deadbug.png";
import pushUpImage from "../assets/pushUp.png";
import pushUpGameImage from "../assets/pushupGame.jpg";
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
        <Box sx={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h1" gutterBottom>
                Catalog
            </Typography>

            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
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
                    title="Two Player Push-up Game"
                    description={catalogText.pushupGame}
                    link="/pushupGame"
                    image={pushUpGameImage}
                />  
            </Grid>
        </Box>
    );
}

export default Catalog;
