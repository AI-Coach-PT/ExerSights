import React from "react";
import { Typography, Box } from "@mui/material";
import ExerciseCard from "../components/Card";
import squatImg from "../assets/squat.jpg";
import deadBugImage from "../assets/deadbug.png";

function Catalog() {
    return (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: "40px" }}>
                Catalog
            </Typography>

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
                        maxWidth: "345px",
                        margin: "auto",
                    }}>
                    <ExerciseCard
                        title="Squat"
                        description="Squats strengthen the legs, glutes, and core, improving flexibility and balance."
                        link="/squat"
                        image={squatImg}
                    />
                </Box>

                <Box
                    sx={{
                        maxWidth: "345px",
                        margin: "auto",
                    }}>
                    <ExerciseCard
                        title="Exercise 2"
                        description="description for exercise 2 description for exercise 2"
                        link="/"
                    />
                </Box>

                <Box
                    sx={{
                        maxWidth: "345px",
                        margin: "auto",
                    }}>
                    <ExerciseCard
                        title="Dead Bug"
                        description="The dead bug exercise is a technique for building strength in your back and core."
                        link="/deadbug"
                        image={deadBugImage}
                    />
                </Box>

                <Box
                    sx={{
                        maxWidth: "345px",
                        margin: "auto",
                    }}>
                    <ExerciseCard
                        title="Exercise 4"
                        description="description for exercise 4 description for exercise 4 "
                        link="/"
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default Catalog;
