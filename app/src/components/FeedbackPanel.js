import React from "react";
import { Typography, Box, Paper, Button } from "@mui/material";
import Timer from "./Timer";

/**
 * A React functional component for rendering a feedback panel that displays real-time
 * feedback, exercise-specific angle values, and repetition count. It also includes options
 * for resetting the count and dynamically inserting modal components for help and settings.
 *
 * @component
 *
 * @param {Array} feedbackList - An array of feedback messages to be displayed.
 * @param {Array} valuesList - An array of objects containing labels and values for angles or other metrics.
 * @param {number} repCount - The current repetition count for the exercise.
 * @param {Function} handleReset - Callback function to reset the repetition count.
 * @param {React.Element} HelpModal - A HelpModal component instance for providing instructions or help.
 * @param {React.Element} SettingsModal - A SettingsModal component instance for adjusting exercise settings.
 *
 * @returns {JSX.Element} The rendered FeedbackPanel component.
 */
function FeedbackPanel({
  feedbackList,
  valuesList,
  repCount,
  handleReset,
  HelpModal,
  SettingsModal,
  handleVideoUpload,
  angleView,
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        textAlign: "left",
        height: "fit-content",
        width: "25rem",
        margin: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}>
      <Box sx={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
        <Typography variant="body1">Real-Time Feedback Panel</Typography>
        {HelpModal}
        {SettingsModal}
      </Box>

      <Box sx={{ width: "90%" }}>
        <Typography variant="body1">
          Feedback:
          {feedbackList.map((feedback, index) => (
            <Typography key={`feedback-${index}`} variant="body1" style={{ color: "red" }}>
              {feedback}
            </Typography>
          ))}
        </Typography>
      </Box>

      {valuesList.map((angle, index) =>
        angleView ? (
          <Typography key={`angle-${index}`} variant="body1">
            {`${angle.label}: ${angle.value.toFixed(0)}°`}
          </Typography>
        ) : (
          ""
        )
      )}

      <Typography variant="body1">Current Rep Count: {repCount}</Typography>

      <Button variant="contained" color="primary" onClick={handleReset} sx={{ width: "50%" }}>
        Reset Rep Count
      </Button>

      <Button variant="contained" color="primary" component="label" sx={{ width: "50%" }}>
        Upload Video
        <input type="file" accept="video/*" onChange={handleVideoUpload} hidden />
      </Button>

      <Timer />
    </Paper>
  );
}

export default FeedbackPanel;
