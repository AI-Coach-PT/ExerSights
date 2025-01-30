import React from "react";
import { Box, Typography, keyframes } from "@mui/material";

// Keyframe animation for moving up and fading out
const fadeUp = keyframes`
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
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
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                    padding: "10px 20px",
                    borderRadius: "10px",
                    animation: `${fadeUp} 1s ease-out forwards`, // Apply the animation
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

export default OverlayBox;
