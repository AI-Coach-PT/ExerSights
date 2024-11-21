import React from "react";
import { Typography, Box, Paper, Button } from "@mui/material";

function FeedbackPanel({
    feedbackList,
    valuesList,
    repCount,
    handleReset,
    HelpModal,
    SettingsModal,
}) {
    return (
        <Paper
            elevation={3}
            sx={{
                padding: "20px",
                textAlign: "left",
                height: "fit-content",
                margin: "10px",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
                <Typography variant="body1">Real-Time Feedback Panel</Typography>
                {HelpModal}
                {SettingsModal}
            </Box>
            <Typography variant="body1">{"Feedback: "}</Typography>
            {feedbackList.map((feedback, index) => (
                <Typography
                    key={`feedback-${index}`}
                    variant="body1"
                    style={{ color: "red" }}
                >
                    {feedback}
                </Typography>
            ))}
            {valuesList.map((angle, index) => (
                <Typography
                    key={`angle-${index}`}
                    variant="body1"
                >
                    {`${angle.label}: ${angle.value.toFixed(0)}°`}
                </Typography>
            ))}
            <Typography variant="body1">Current Rep Count: {repCount}</Typography>
            <Button variant="contained" color="primary" onClick={handleReset}>
                Reset Rep Count
            </Button>
        </Paper>
    );
}

export default FeedbackPanel;
