import React, { useState, useEffect } from "react";
import { IconButton, Modal, Box, Typography, Button, TextField, MenuItem, Select } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { catalogText } from "../assets/content.js";

function ProgramModal({
    programId,
    programData,
    setProgramsState,
}) {
    

  const validExercises = Object.keys(catalogText);

  const [openModal, setOpenModal] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [tempProgramName, setTempProgramName] = useState(programData.name);
  const [tempExercises, setTempExercises] = useState([...programData.list]);

  useEffect(() => {
    setTempProgramName(programData.name);
    setTempExercises([...programData.list]);
  }, [programData]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    // ✅ Check if there are unsaved changes before closing
    if (tempProgramName !== programData.name || JSON.stringify(tempExercises) !== JSON.stringify(programData.list)) {
      const confirmClose = window.confirm("You have unsaved changes. Do you want to discard them?");
      if (!confirmClose) return; // Stop closing if user cancels
    }
    setOpenModal(false);
    setTempProgramName(programData.name); // Reset temporary state
    setTempExercises([...programData.list]);
  };

  const handleSaveChanges = () => {
    setProgramsState((prev) => ({
      ...prev,
      [programId]: {
        ...prev[programId],
        name: tempProgramName,
        list: tempExercises,
      },
    }));
  };

  const removeExercise = (index) => {
    setTempExercises((prev) => prev.filter((_, i) => i !== index));
  };


  const addExercise = (index, exercise) => {
    if (!validExercises.includes(exercise)) return;
    const updatedExercises = [...tempExercises];
    updatedExercises.splice(index + 1, 0, exercise); // ✅ Adds after current index
    setTempExercises(updatedExercises);
    setNewExercise("");
  };
    

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
            maxHeight: "70vh", 
            overflowY: "auto", 
          }}>

          <TextField
            fullWidth
            label="Progam Name"
            variant="outlined"
            value={tempProgramName}
            onChange={(e) => setTempProgramName(e.target.value)}
            sx={{ mt: 2 }}
          />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (newExercise.trim() !== "") {
              addExercise(0, newExercise, programId); 
              setNewExercise(""); // Clear input after adding
            }
          }}
          sx={{ mb: 1, mt: 1.5, width: "100%" }}
        >
          Add to Top
        </Button>

        {tempExercises.length > 0 ? (
            tempExercises.map((exercise, index) => (
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
                      addExercise(index + 1, newExercise, programId)
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

          {/* Dropdown to Select New Exercise */}
          <Select
            fullWidth
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            displayEmpty
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>
              Select an exercise
            </MenuItem>
            {validExercises.map((exercise) => (
              <MenuItem key={exercise} value={exercise}>
                {exercise}
              </MenuItem>
            ))}
          </Select>

          {/* <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2, gap: 2 }}>
            <Button variant="contained" onClick={handleCloseModal}>
              Save & Close
            </Button>
          </Box> */}
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save
            </Button>
            <Button variant="contained" onClick={handleCloseModal} color="secondary">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default ProgramModal;
