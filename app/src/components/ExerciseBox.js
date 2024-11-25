import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * A reusable layout component for exercise tracking pages.
 *
 * @component
 * @param {string} title - The title of the exercise page.
 * @param {JSX.Element} webcamCanvas - The WebcamCanvas component displaying the camera feed.
 * @param {JSX.Element} feedbackPanel - The FeedbackPanel component displaying feedback and controls.
 *
 * @returns {JSX.Element} The JSX code for the ExerciseBox layout.
 */
function ExerciseBox({ title, webcamCanvas, feedbackPanel }) {
    return (
        <Box>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
                {title}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%",
                    height: "fit-content",
                    padding: "2vmin",
                }}
            >
                {webcamCanvas}
                {feedbackPanel}
            </Box>
        </Box>
    );
};

export default ExerciseBox;
