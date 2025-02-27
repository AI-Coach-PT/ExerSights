import React, { useEffect, useState } from "react";
import { Typography, Box, IconButton, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import ProgramModal from "../components/ProgramModal";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Default programs data
const programs = {
  1: { name: "Core", list: ["plank", "deadBug", "bridge"] },
  2: { name: "Back", list: ["pullUp", "muscleUp"] },
};

function Program() {
  const navigate = useNavigate();

  // Initialize programs from localStorage or default data
  const [programsState, setProgramsState] = useState(
    JSON.parse(localStorage.getItem("programs")) || programs
  );

  // Sync program state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("programs", JSON.stringify(programsState));
  }, [programsState]);

  // Navigate to program overlay if exercises exist
  const handleNavigate = (programId) => {
    if (programsState[programId].list.length === 0) {
      window.alert("Empty Program");
      return;
    }
    navigate("/programOverlay", { state: { currentProgram: programsState[programId] } });
  };

  // Remove a program after user confirmation
  const removeProgram = (programId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this program?");
    if (!confirmDelete) return;
    setProgramsState((prevPrograms) => {
      const updatedPrograms = { ...prevPrograms };
      delete updatedPrograms[programId];
      return updatedPrograms;
    });
  };

  // Add a new blank program
  const addProgram = () => {
    const newProgramId = Object.keys(programsState).length + 1;
    setProgramsState((prevPrograms) => ({
      ...prevPrograms,
      [newProgramId]: {
        name: `New Program ${newProgramId}`,
        list: [],
      },
    }));
  };

  return (
    <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h5" gutterBottom sx={{ m: 2 }}>
        Create an Exercise Program
      </Typography>

      {/* Grid Layout for Displaying Programs */}
      <Grid container spacing={3} justifyContent="center">
        {Object.entries(programsState).map(([programId, programData]) => (
          <Grid item xs={12} sm={6} md={4} key={programId}>
            {/* Boxed Program Display */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                {programData.name}
              </Typography>

              {/* Modal & Remove Button */}
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                <ProgramModal
                  programId={programId}
                  programData={programData}
                  setProgramsState={setProgramsState}
                />
                <IconButton onClick={() => removeProgram(programId)} color="error">
                  <RemoveCircleIcon />
                </IconButton>
              </Box>

              {/* Start Program Button */}
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, width: "100%" }}
                onClick={() => handleNavigate(programId)}
              >
                Start Program
              </Button>
            </Paper>
          </Grid>
        ))}

        {/* Add Program Button in Grid */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 150,
            }}
          >
            <IconButton onClick={addProgram} sx={{ fontSize: 50 }}>
              <AddCircleIcon fontSize="inherit" />
            </IconButton>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Program;
