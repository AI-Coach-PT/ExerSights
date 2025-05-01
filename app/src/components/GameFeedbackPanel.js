import React from "react";
import { Box, Typography, Paper, Button, LinearProgress } from "@mui/material";
import Timer from "./Timer";
import VoiceFeedbackButton from "./VoiceButton";

function GameFeedbackPanel({
  leftRepCount,
  rightRepCount,
  HelpModal,
  SettingsModal,
  onStartExercise,
}) {
  const leftWins = leftRepCount > rightRepCount;
  const rightWins = rightRepCount > leftRepCount;

  const leftProgress = leftRepCount + rightRepCount > 0
    ? (leftRepCount / (leftRepCount + rightRepCount)) * 100
    : 50;

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 2,
        p: 2,
        width: "100%",
        maxWidth: "800px",
        mx: "auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Top row: scores and progress bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color={leftWins ? "primary" : "textSecondary"}>
            Left Score: {leftRepCount}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color={rightWins ? "primary" : "textSecondary"}>
            Right Score: {rightRepCount}
          </Typography>
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={leftProgress}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: leftWins ? "primary.main" : rightWins ? "secondary.main" : "grey",
          },
        }}
      />

      {/* Timer & controls */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" color="success" onClick={onStartExercise}>
          Start Exercise
        </Button>
        <VoiceFeedbackButton />
        {HelpModal}
        {SettingsModal}
      </Box>

      <Timer />
    </Paper>
  );
}

export default GameFeedbackPanel;
