import React from "react";
import { Box, Typography, keyframes } from "@mui/material";

// Keyframe animation for moving up and fading out
const fadeUp = keyframes`
  0% { opacity: 0.8; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-30px); }
`;

/**
 * OverlayBox component that shows text and fades it away while moving up.
 */
const OverlayBox = ({ text }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Prevent interactions
      }}>
      <Typography
        style={{ fontSize: "12em" }}
        sx={{
          color: "green",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "10px 30px",
          borderRadius: "15px",
          animation: `${fadeUp} 0.5s ease-out forwards`,
        }}>
        {text}
      </Typography>
    </Box>
  );
};

export default OverlayBox;
