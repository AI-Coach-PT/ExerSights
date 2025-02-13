import React, { useEffect, useState } from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "../components/PlaylistModal";


const playlists = {
  core: [
    { exercise: "Plank"},
    { exercise: "DeadBug"},
    { exercise: "Bridge"},
  ],
  back: [
    { exercise: "PullUp"},
    { exercise: "MuscleUp"},
  ]
};

function Playlist(){

    const exerciseOptions = [
        "LatExtRotation",
        "PushUp",
        "PullUp",
        "MuscleUp",
        "Plank",
        "Bridge",
        "Squat",
        "DeadBug"
      ];

    const navigate = useNavigate();

    const [exerciseList, setExerciseList] = useState(playlists.core);


    const handleNavigate = () => {
      navigate("/playlistOverlay", { state: { exerciseList } });
    };

    const removeExercise = (index, setExerciseList, playlistName) => {
        setExerciseList((prevList) => prevList.filter((_, i) => i !== index)); 
    }

    const addExercise = (index, setExerciseList, exercise, playlistName) => {
      setExerciseList((prevList) => {
          const newList = [...prevList]; // Create a new array
          newList.splice(index, 0, exercise); // Insert at the given index
          return newList;
      });
    };

    // const modifyPlaylistName = (oldName, newName) => {
    //   setExerciseList((prevList) => {
    //       const newList = [...prevList]; // Create a new array
    //       newList.splice(index, 0, exercise); // Insert at the given index
    //       return newList;
    //   });
    // };
  

    

    return ( 
    <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Box
            sx={{
              m: "20px",
            }}>
    
            <Typography variant="h5" gutterBottom>
              Create an exercise playlist
            </Typography>
    
          </Box>

          <Box
            sx={{
              width: { xs: "20rem", md: "40rem" },
              mb: "1rem",
            }}>
            <Typography variant="h6" gutterBottom>
              Core
            </Typography>
            <PlaylistModal 
              exerciseList={exerciseList} 
              setExerciseList={setExerciseList}
              addExercise={addExercise} 
              removeExercise={removeExercise} 
              exerciseOptions={exerciseOptions}
            />
            <Button variant="contained" 
            color="primary" 
            sx={{ mt: "0.5rem", 
              cursor: "pointer",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }} 
            onClick={handleNavigate}>
              Start Routine
            </Button>
          </Box>


    </Box>

    
          
    );
}

export default Playlist;