import React, { useState, useEffect } from "react";
import { IconButton, Modal, Box, Typography, Button, TextField } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

function ProgramModal({
    programId,
    programData,
    setProgramsState
}) {

      
  const removeExercise = (index, programId) => {
    setProgramsState((prevPrograms) => {
      const updatedProgram = prevPrograms[programId].list.filter((_, i) => i !== index); // Remove exercise
  
      return {
        ...prevPrograms,
        [programId]: {
          ...prevPrograms[programId], // Keep the name and other data
          list: updatedProgram, // Update the list correctly
        },
      };
    });
  };

  const addExercise = (index, exercise, programId) => {
    setProgramsState((prevPrograms) => {
      const updatedProgram = [...prevPrograms[programId].list]; // Copy program
  
      // Insert new exercise (it should be an object with {exercise: "name"})
      updatedProgram.splice(index, 0, exercise);
  
      return {
        ...prevPrograms,
        [programId]: {
          ...prevPrograms[programId], // Keep other program properties
          list: updatedProgram, // Update the list
        },
      };
    });
  };
    



  const [openModal, setOpenModal] = useState(false);
  const [newExercise, setNewExercise] = useState("test");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  return (
    <div>
      <IconButton sx={{ 
        position: "static",
        cursor: "pointer",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
        },
     }} 
      onClick={handleOpenModal}>
        <SettingsIcon fontSize="small" />
      </IconButton>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "25px",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>

          <TextField
            fullWidth
            label="Progam Name"
            variant="outlined"
            value={programData.name}
            onChange={(e) => setProgramsState((prev) => ({
              ...prev,
              [programId]: {
                ...prev[programId],
                name: e.target.value,
              },
            }))}
            sx={{ mt: 2 }}
          />


        {programData.list.length > 0 ? (
            programData.list.map((exercise, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  mb: 1,
                  p: 1,
                  border: "1px solid lightgray",
                  borderRadius: "5px",
                }}
              >
                <Typography>{exercise}</Typography>

                <Box>
                  {/* Add Exercise Button */}
                  <IconButton
                    onClick={() =>
                      addExercise(index + 1, newExercise || "New Exercise", programId)
                    }
                    color="primary"
                  >
                    <AddCircleIcon />
                  </IconButton>

                  {/* Remove Exercise Button */}
                  <IconButton onClick={() => removeExercise(index, programId)} color="error">
                    <RemoveCircleIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No exercises added yet.</Typography>
          )}

          {/* Input Field to Add Custom Exercise */}
          <TextField
            fullWidth
            label="New Exercise"
            variant="outlined"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (newExercise.trim() !== "") {
                addExercise(0, newExercise || "New Exercise");
                setNewExercise(""); // Clear input after adding
              }
            }}
            sx={{ mt: 2 }}
          >
            Add to Beginning
          </Button>

            <Typography>
                <br/>
            </Typography>

          <Button variant="contained" onClick={handleCloseModal}>
            Save & Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ProgramModal;
