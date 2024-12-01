import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * A reusable layout component for exercise tracking pages.
 *
 * @component
 * @param {string} title - The title of the exercise page.
 * @param {JSX.Element} webcamCanvas - The WebcamCanvas component displaying the camera feed.
 * @param {JSX.Element} leftFeedbackPanel - The FeedbackPanel component displaying feedback and controls.
 * @param {JSX.Element} rightFeedbackPanel - The FeedbackPanel component displaying feedback and controls.
 *
 * @returns {JSX.Element} The JSX code for the ExerciseBox layout.
 */
function ExerciseBoxWithDualFeedback({ title, webcamCanvas, leftFeedbackPanel, rightFeedbackPanel }) {
    return (
        <Box>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
                {title}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "100%",
                    height: "fit-content",
                    padding: "2vmin",
                    gap: "20px", // Space between elements
                }}
            >
                {/* Left Feedback Panel */}
                <Box
                    sx={{
                        flex: "1 1 20%", // Adjust size for responsiveness
                        maxWidth: "25%",
                        minWidth: "200px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {leftFeedbackPanel}
                </Box>

                {/* Webcam Canvas */}
                <Box
                    sx={{
                        flex: "2 1 50%", // Adjust size for responsiveness
                        maxWidth: "50%",
                        minWidth: "300px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {webcamCanvas}
                </Box>

                {/* Right Feedback Panel */}
                <Box
                    sx={{
                        flex: "1 1 20%", // Adjust size for responsiveness
                        maxWidth: "25%",
                        minWidth: "200px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {rightFeedbackPanel}
                </Box>
            </Box>
        </Box>
    );
};

export default ExerciseBoxWithDualFeedback;