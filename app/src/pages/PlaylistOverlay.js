import React, { useState } from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useLocation } from "react-router-dom";

import SquatPage from "./exercises/SquatPage";
import DeadBugPage from "./exercises/DeadBugPage";
import LatExtRotationPage from "./exercises/LatExtRotationPage";
import PushUpPage from "./exercises/PushUpPage";
import PullUpPage from "./exercises/PullUpPage";
import MuscleUpPage from "./exercises/MuscleUpPage";
import PlankPage from "./exercises/PlankPage";
import BridgePage from "./exercises/BridgePage";

function PlaylistOverlay(){

    const exerciseComponents = {
        "LatExtRotation": LatExtRotationPage,
        "PushUp": PushUpPage,
        "PullUp": PullUpPage,
        "MuscleUp": MuscleUpPage,
        "Plank": PlankPage,
        "Bridge": BridgePage,
        "Squat": SquatPage,
        "DeadBug": DeadBugPage
      };

    const location = useLocation();
    const { 
        currentPlaylist = [],
        playlistName = ""
      } = location.state || {};
    const [index, setIndex] = useState(0);


    const increment = () => {
        setIndex((prevIndex) => (prevIndex + 1) % currentPlaylist.length); // Loop back to start
      };
    
    const currentExercise = currentPlaylist[index];
    const CurrentExercisePage = exerciseComponents[currentExercise.exercise];


    return ( 
    <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Box sx={{ m: "20px" }}>
                <Typography variant="h5" gutterBottom>
                {playlistName} Playlist 
                </Typography>
            </Box>

            {CurrentExercisePage ? <CurrentExercisePage /> : <Typography>No valid exercise selected.</Typography>}

            <Button variant="contained" onClick={increment} sx={{ mt: 2 }}>
                Next Exercise
            </Button>
    </Box>
          
    );
}

export default PlaylistOverlay;