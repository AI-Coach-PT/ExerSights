import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { auth } from "../firebaseConfig";
import { handleLogin } from "../utils/helpers/HandleLogin";
import { onAuthStateChanged } from "firebase/auth";

const initializeSeenPrompt = () => {
  const hasSeenPrompt = localStorage.getItem("hasSeenLoginPrompt") === "true";
  const promptTimestamp = localStorage.getItem("promptTimestamp");

  if (hasSeenPrompt && promptTimestamp) {
    const secondsSincePrompt = (Date.now() - parseInt(promptTimestamp)) / 1000;
    if (secondsSincePrompt > 60) {
      // Reset after 60 seconds
      localStorage.removeItem("hasSeenLoginPrompt");
      localStorage.removeItem("promptTimestamp");
      return false;
    }
  }

  return hasSeenPrompt;
};

const LoginPrompt = () => {
  const [promptOpen, setPromptOpen] = useState(false);
  const [seenPrompt, setSeenPrompt] = useState(initializeSeenPrompt());

  useEffect(() => {
    // Only show if user is not logged in and hasn't seen the prompt
    if (auth.currentUser) {
      setPromptOpen(false);
    } else if (!seenPrompt) {
      setPromptOpen(true);
    }
  }, []);

  // call this method whenever authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPromptOpen(false);
      } else {
        // Only show prompt if user hasn't seen it in the last ten seconds
        if (!seenPrompt) {
          setPromptOpen(true);
        }
      }
    });

    return () => unsubscribe();
  }, [seenPrompt]);

  const handleClose = () => {
    setPromptOpen(false);
    setSeenPrompt(true);
    localStorage.setItem("hasSeenLoginPrompt", "true");
    localStorage.setItem("promptTimestamp", Date.now().toString());
  };

  return (
    <Modal open={promptOpen} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30rem",
          maxWidth: "90%",
          bgcolor: "background.paper",
          borderRadius: 6,
          boxShadow: "0px 0px 20px 0px rgba(255,255,255,1)",
          p: 4,
        }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: "0.5rem" }}>
          Welcome to ExerSights!
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: "1rem" }}>
          Sign in to access all features and personalize your experience!
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
          sx={{
            mb: "1rem",
            width: "18rem",
          }}>
          Sign in with Google
        </Button>
        <Button variant="text" onClick={handleClose} sx={{ width: "15rem" }}>
          Maybe Later
        </Button>
      </Box>
    </Modal>
  );
};

export default LoginPrompt;
