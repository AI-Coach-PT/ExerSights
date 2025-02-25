import React, { useEffect, useState } from "react";
import { Typography, Box, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProgramModal from "../components/ProgramModal";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const programs = {
  1: {
    name: "Core",
    list: [
      "plank",
      "deadBug",
      "bridge",
    ]},
  2: {
    name: "Back",
    list: [
      "pullUp",
      "muscleUp",
    ]},
};

function Program(){

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


    const [programsState, setProgramsState] = useState(
      JSON.parse(localStorage.getItem("programs")) || 
      programs
    );

    useEffect(() => {
      localStorage.setItem("programs", JSON.stringify(programsState));
    }, [programsState]);
    
    
    const handleNavigate = (programId) => {
      navigate("/programOverlay", { state: { currentProgram: programsState[programId]} });
    };

    const removeProgram = (programId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this program?");
      if (!confirmDelete) return; // Cancel deletion if user clicks "No"
      setProgramsState((prevPrograms) => {
        const updatedPrograms = { ...prevPrograms };
        delete updatedPrograms[programId]; // Remove the program
        return updatedPrograms;
      });
    }

    const addProgram = () => {
      const newProgramId = Object.keys(programsState).length + 1;
      setProgramsState((prevPrograms) => ({
        ...prevPrograms,
        [newProgramId]: {
          name: `New Program ${newProgramId}`,
          list: [],
        },
      }));

    }
    

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
              Create an exercise program
            </Typography>
    
          </Box>

          {/* ✅ Dynamically Display All Programs */}
          {Object.entries(programsState).map(([programId, programData]) => (
            <Box key={programId} sx={{ width: { xs: "20rem", md: "40rem" }, mb: "1rem" }}>
              <Typography variant="h6" gutterBottom>
                {programsState[programId].name}
              </Typography>

              <Box>
                <ProgramModal
                  programId={programId}
                  programData={programData}
                  setProgramsState={setProgramsState}
                  exerciseOptions={exerciseOptions}
                />
                
                <IconButton onClick={() => removeProgram(programId)} color="error">
                      <RemoveCircleIcon />
                </IconButton> 
              </Box>             

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
                onClick={() => handleNavigate(programId)}
              >
                Start Routine
              </Button>

            </Box>
          ))}

        <IconButton onClick={() => addProgram()}>
          <AddCircleIcon />
        </IconButton> 

    </Box>
          
    );
}

export default Program;