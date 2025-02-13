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


    const [playlistsState, setPlaylistsState] = useState(
      JSON.parse(localStorage.getItem("playlists")) || playlists
    );

    useEffect(() => {
      localStorage.setItem("playlists", JSON.stringify(playlistsState));
    }, [playlistsState]);
    
    
    const handleNavigate = (playlistName) => {
      navigate("/playlistOverlay", { state: { currentPlaylist: playlistsState[playlistName], playlistName: playlistName } });
    };
    
    const removeExercise = (index, playlistName) => {

      
  
      setPlaylistsState((prevPlaylists) => {
        const updatedPlaylist = prevPlaylists[playlistName].filter((_, i) => i !== index); // Remove item
        if (updatedPlaylist.length === 0) return prevPlaylists;
        return {
          ...prevPlaylists,
          [playlistName]: updatedPlaylist, // Update the correct playlist
        };
      });
    };

    const addExercise = (index, exercise, playlistName) => {
  
      setPlaylistsState((prevPlaylists) => {
        const updatedPlaylist = [...prevPlaylists[playlistName]]; // Copy playlist
        updatedPlaylist.splice(index, 0, exercise); // Insert new exercise
  
        return {
          ...prevPlaylists,
          [playlistName]: updatedPlaylist, // Update the correct playlist
        };
      });
    };

  

    

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

          {/* ✅ Dynamically Display All Playlists */}
          {Object.entries(playlistsState).map(([playlistName, exercises]) => (
            <Box key={playlistName} sx={{ width: { xs: "20rem", md: "40rem" }, mb: "1rem" }}>
              <Typography variant="h6" gutterBottom>
                {playlistName} Playlist
              </Typography>

              <PlaylistModal
                playlistName={playlistName}
                exerciseList={exercises}
                setExerciseList={(newList) =>
                  setPlaylistsState((prev) => ({ ...prev, [playlistName]: newList }))
                }
                addExercise={(index, exercise) => addExercise(index, exercise, playlistName)}
                removeExercise={(index) => removeExercise(index, playlistName)}
                exerciseOptions={exerciseOptions}
              />

              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: "0.5rem",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleNavigate(playlistName)}
              >
                Start Routine
              </Button>

            </Box>
          ))}



    </Box>

    
          
    );
}

export default Playlist;