import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import Timer from "./Timer";

function GameFeedbackPanel({
  leftRepCount,
  rightRepCount,
  HelpModal,
  SettingsModal,
  handleReset,
}) {
  const total = leftRepCount + rightRepCount;
  const leftPercent = total > 0 ? (leftRepCount / total) * 100 : 50;
  const rightPercent = 100 - leftPercent;

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
        backgroundColor: "#121212", // optional: dark theme for contrast
      }}
    >
      {/* Top row: scores */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="white">
            Left Score: {leftRepCount}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="white">
            Right Score: {rightRepCount}
          </Typography>
        </Box>
      </Box>

      {/* Dual-colored bar */}
      <Box
        sx={{
          display: "flex",
          height: 10,
          width: "100%",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: `${leftPercent}%`, backgroundColor: "orange" }} />
        <Box sx={{ width: `${rightPercent}%`, backgroundColor: "blue" }} />
      </Box>

      {/* Controls: Reset + Modals */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: "1rem", textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleReset}
          color="secondary"
          sx={{ width: "48%" }}
        >
          Reset Rep Count
        </Button>
        {HelpModal}
        {SettingsModal}
      </Box>

      <Timer />
    </Paper>
  );
}

export default GameFeedbackPanel;
