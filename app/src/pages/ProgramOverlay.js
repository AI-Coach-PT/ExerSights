import React, { useState, useEffect } from "react";
import { Typography, Box, Card, CardContent, Button, CardMedia } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loadExerciseData } from "./exercises/ExercisePageData"; // Assuming this loads exercise data dynamically
import ExercisePage from "./exercises/ExercisePage"; // The new dynamic exercise page

function ProgramOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProgram = [] } = location.state || {};
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

  const handleNavigate = () => {
    navigate("/program");
  };

  const increment = () => {
    if (currentProgram.length === 0) return;
    setIndex((prevIndex) => (prevIndex + 1) % currentProgram.list.length); // Loop back to start
  };

  const deincrement = () => {
    if (!currentProgram.list.length) return; // Prevent errors if list is empty

    setIndex((prevIndex) => (prevIndex === 0 ? currentProgram.list.length - 1 : prevIndex - 1));
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.5rem",
      }}>
      <Button variant="contained" onClick={handleNavigate} sx={{ mb: "1rem" }}>
        All Programs
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          mb: "1rem",
          flexDirection: "column",
        }}>
        <Typography variant="h2" sx={{ display: "flex", alignItems: "center" }}>
          {currentProgram.name}
        </Typography>
      </Box>

      {loading ? (
        <Typography>Loading exercise...</Typography>
      ) : error ? (
        <Typography>Error loading exercise!</Typography>
      ) : (
        <ExercisePage exerciseName={currentProgram.list[index]} exerciseData={exerciseData} />
      )}

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
        {/* Previous Button + Message */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            onClick={deincrement}
            disabled={index === 0} // Disable at the start
          >
            Previous
          </Button>
          {index === 0 && <Typography variant="body1">Start of Program!</Typography>}
        </Box>

        {/* Next Button + Message */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {index === currentProgram.list.length - 1 && (
            <Typography variant="body1">End of Program!</Typography>
          )}
          <Button
            variant="contained"
            onClick={increment}
            disabled={index === currentProgram.list.length - 1} // Disable at the end
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ProgramOverlay;
