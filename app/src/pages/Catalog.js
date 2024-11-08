import React from "react";
import { Typography, Box, Grid2 } from "@mui/material";
import ExerciseCard from "../components/ExerciseCard.js";
import squatImg from "../assets/squat.jpg";
import bridgeImg from "../assets/bridge.jpg";
import deadBugImage from "../assets/deadbug.png";
import pushUpImage from "../assets/pushUp.png";
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
            <Typography variant="h4" gutterBottom sx={{ marginBottom: "40px" }}>
                Catalog
            </Typography>

            <Grid2 container spacing={2}>
                <ExerciseCard
                    title="Squat"
                    description={catalogText.squat}
                    link="/squat"
                    image={squatImg}
                />
            </Grid2>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "720px",
                    margin: "0 auto",
                }}>
                <Box
                    sx={{
                        margin: "auto",
                    }}>
                    <ExerciseCard
                        title="Squat"
                        description={catalogText.squat}
                        link="/squat"
                        image={squatImg}
                    />
                </Box>

                <Box
                    sx={{
                        margin: "auto",
                    }}>
                    <ExerciseCard
                        title="Bridge"
                        description={catalogText.bridge}
                        link="/bridge"
                        image={bridgeImg}
                    />
                </Box>

                <Box
                    sx={{
                        margin: "auto",
                    }}>
                    <ExerciseCard
                        title="Dead Bug"
                        description={catalogText.deadbug}
                        link="/deadbug"
                        image={deadBugImage}
                    />
                </Box>

                <Box
                    sx={{
                        margin: "auto",
                    }}>
                    <ExerciseCard
                        title="Push-up"
                        description={catalogText.pushup}
                        link="/pushup"
                        image={pushUpImage}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default Catalog;
