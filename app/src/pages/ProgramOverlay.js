import React, { useState, useEffect  } from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useLocation } from "react-router-dom";
import { loadExerciseData } from "./exercises/ExercisePageData"; // Assuming this loads exercise data dynamically
import ExercisePage from "./exercises/ExercisePage"; // The new dynamic exercise page

function ProgramOverlay(){

    const location = useLocation();
    const { 
        currentProgram = [],
      } = location.state || {};
    const [index, setIndex] = useState(0);
    const [exerciseData, setExerciseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
      if (currentProgram.list.length === 0) {
          setError(true);
          setLoading(false);
          console.error("Error: Program is empty or undefined.");
          return;
      }

      const currentExercise = currentProgram.list[index];
      if (!currentExercise) {
          setError(true);
          setLoading(false);
          return;
      }

      setLoading(true);
      setError(false);

      loadExerciseData(currentExercise)
          .then((data) => {
              setExerciseData(data);
              setLoading(false);
          })
          .catch(() => {
              setError(true);
              setLoading(false);
          });
  }, [index, currentProgram.list]);
  



    const increment = () => {
        if (currentProgram.length === 0) return;
        setIndex((prevIndex) => (prevIndex + 1) % currentProgram.list.length); // Loop back to start
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
                <Box sx={{ m: "20px" }}>
                    <Typography variant="h5" gutterBottom>
                    {currentProgram.name} Program 
                    </Typography>
                </Box>

                {loading ? (
                    <Typography>Loading exercise...</Typography>
                ) : error ? (
                    <Typography>Error loading exercise!</Typography>
                ) : (
                    <ExercisePage exerciseName={currentProgram.list[index]} exerciseData={exerciseData} />
                )}

                <Button variant="contained" onClick={increment} sx={{ mt: 2 }}>
                    Next Exercise
                </Button>
        </Box>
          
    );
}

export default ProgramOverlay;