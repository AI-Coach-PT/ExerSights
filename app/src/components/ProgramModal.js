import React, { useState, useEffect } from "react";
import {
  IconButton,
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { catalogText } from "../assets/content.js";

import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import toast from "react-hot-toast";

const saveProgramsToDatabase = async (userEmail, programsState) => {
  try {
    const userRef = doc(db, "users", userEmail, "programs", "userPrograms");
    await setDoc(userRef, programsState, { merge: true });
  } catch (e) {
    console.log("Error saving programs to Firestore:", e);
  }
};

function ProgramModal({ programId, programData, programsState, setProgramsState }) {
  // List of valid exercises available for selection
  const validExercises = Object.keys(catalogText);

  // State variables for modal and program management
  const [openModal, setOpenModal] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [tempProgramName, setTempProgramName] = useState(programData.name);
  const [tempExercises, setTempExercises] = useState([...programData.list]);

  // Sync modal state with updated program data
  useEffect(() => {
    setTempProgramName(programData.name);
    setTempExercises([...programData.list]);
  }, [programData]);

  // Open the modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close modal with confirmation for unsaved changes
  const handleCloseModal = () => {
    if (
      tempProgramName !== programData.name ||
      JSON.stringify(tempExercises) !== JSON.stringify(programData.list)
    ) {
      const confirmClose = window.confirm("You have unsaved changes. Do you want to discard them?");
      if (!confirmClose) return;
    }
    setOpenModal(false);
    setTempProgramName(programData.name);
    setTempExercises([...programData.list]);
  };

  // Save changes to the program state
  const handleSaveChanges = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to edit a program.");
      return;
    }

    setProgramsState((prev) => ({
      ...prev,
      [programId]: {
        ...prev[programId],
        name: tempProgramName,
        list: tempExercises,
      },
    }));

    saveProgramsToDatabase(user.email, {
      ...programsState,
      [programId]: {
        ...programsState[programId],
        name: tempProgramName,
        list: tempExercises,
      },
    });
  };

  // Remove an exercise from the list
  const removeExercise = (index) => {
    setTempExercises((prev) => prev.filter((_, i) => i !== index));
  };

  // Add a new exercise after a given index
  const addExercise = (index, exercise) => {
    if (!validExercises.includes(exercise)) return;
    const updatedExercises = [...tempExercises];
    updatedExercises.splice(index, 0, exercise);
    setTempExercises(updatedExercises);
    setNewExercise(""); // Clear selection after adding
  };

  return (
    <div>
      {/* Button to open modal */}
      <IconButton
        sx={{
          position: "static",
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.05)" },
        }}
        onClick={handleOpenModal}>
        <SettingsIcon fontSize="small" />
      </IconButton>

      {/* Modal for program settings */}
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
          {/* Editable program name */}
          <TextField
            fullWidth
            label="Program Name"
            variant="outlined"
            value={tempProgramName}
            onChange={(e) => setTempProgramName(e.target.value)}
            sx={{ mt: "1rem", mb: "1rem" }}
          />

          {/* List of current exercises */}
          {tempExercises.length > 0 ? (
            tempExercises.map((exercise, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  mb: "0.5rem",
                  p: 1,
                  border: "1px solid lightgray",
                  borderRadius: "5px",
                }}>
                <Typography>
                  {exercise.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Typography>

                {/* Controls to add/remove exercises */}
                <Box>
                  <IconButton onClick={() => addExercise(index + 1, newExercise)} color="primary">
                    <AddCircleIcon />
                  </IconButton>
                  <IconButton onClick={() => removeExercise(index)} color="error">
                    <RemoveCircleIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No exercises added yet.</Typography>
          )}

          {/* Add new exercise to the top */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (newExercise.trim() !== "") {
                addExercise(0, newExercise);
                setNewExercise("");
              }
            }}
            sx={{ mb: "1rem", mt: "1rem", width: "100%" }}>
            Add to Top
          </Button>

          {/* Dropdown menu for selecting new exercises */}
          <Select
            fullWidth
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            displayEmpty>
            <MenuItem value="" disabled>
              Select an exercise
            </MenuItem>
            {validExercises.map((exercise) => (
              <MenuItem key={exercise} value={exercise}>
                {exercise.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </MenuItem>
            ))}
          </Select>

          {/* Action buttons for saving and closing */}
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: "1rem" }}>
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
