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
  FormControl,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { catalogText } from "../assets/content.js";

import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { analytics, db } from "../firebaseConfig";
import toast from "react-hot-toast";
import { logEvent } from "firebase/analytics";

const saveProgramsToDatabase = async (userEmail, programsState) => {
  try {
    const userRef = doc(db, "users", userEmail, "programs", "userPrograms");
    await setDoc(userRef, programsState, { merge: true });
  } catch (e) {
    console.log("Error saving programs to Firestore:", e);
    // Consider adding a user-facing error toast here as well
    // toast.error("Failed to save program changes.");
  }
};

// Helper function to format exercise names for display
const formatExerciseName = (name) => {
  if (!name) return "";
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
};


function ProgramModal({ programId, programData, programsState, setProgramsState }) {
  // List of valid exercises available for selection
  const validExercises = Object.keys(catalogText);

  // State variables for modal and program management
  const [openModal, setOpenModal] = useState(false);
  const [newExerciseToAdd, setNewExerciseToAdd] = useState(""); // Renamed for clarity
  const [tempProgramName, setTempProgramName] = useState(programData.name);
  const [tempExercises, setTempExercises] = useState([...programData.list]);

  // Sync modal state with updated program data
  useEffect(() => {
    setTempProgramName(programData.name);
    // Ensure we always work with a fresh copy from props when data changes
    setTempExercises([...programData.list]);
  }, [programData]);

  // Open the modal
  const handleOpenModal = () => {
    // Reset temp states to current program data when opening
    setTempProgramName(programData.name);
    setTempExercises([...programData.list]);
    setNewExerciseToAdd(""); // Clear the 'add new' selection
    setOpenModal(true);
  };

  // Close modal with confirmation for unsaved changes
  const handleCloseModal = () => {
    // Check for changes
    const hasChanges =
      tempProgramName !== programData.name ||
      JSON.stringify(tempExercises) !== JSON.stringify(programData.list);

    if (hasChanges) {
      const confirmClose = window.confirm("You have unsaved changes. Do you want to discard them?");
      if (!confirmClose) return; // Don't close if user cancels
    }

    setOpenModal(false);
    // No need to reset temps here, handleOpenModal resets on next open
  };

  // Save changes to the program state and database
  const handleSaveChanges = async () => { // Make async to potentially await save
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to edit a program.");
      logEvent(analytics, "notification_received", { notification_type: "auth_required" });
      return;
    }

    // Create the updated state for the specific program
    const updatedProgram = {
      ...programsState[programId], // Keep other potential properties
      name: tempProgramName,
      list: tempExercises,
    };

    // Create the new overall state object
    const newState = {
      ...programsState,
      [programId]: updatedProgram,
    };

    // Update parent component state first (optimistic update)
    setProgramsState(newState);

    // Then, save to database
    try {
        await saveProgramsToDatabase(user.email, newState);
        toast.success("Program saved successfully!");
        logEvent(analytics, "program_saved", { program_id: programId });
        setOpenModal(false); // Close modal on successful save
    } catch (error) {
        toast.error("Failed to save program. Please try again.");
        logEvent(analytics, "program_save_failed", { program_id: programId, error: error.message });
        // Optionally revert state if save fails, though optimistic updates are common
        // setProgramsState(programsState); // Revert to original state before save attempt
    }
  };

  // Remove an exercise from the list
  const removeExercise = (indexToRemove) => {
    setTempExercises((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Add a *new* exercise at a specific index
  const addNewExerciseAt = (index, exerciseToAdd) => {
    // Ensure an exercise is selected and valid
    if (!exerciseToAdd || !validExercises.includes(exerciseToAdd)) {
      toast.error("Please select a valid exercise to add.");
      return;
    }
    const updatedExercises = [...tempExercises];
    updatedExercises.splice(index, 0, exerciseToAdd); // Insert at index
    setTempExercises(updatedExercises);
    setNewExerciseToAdd(""); // Clear selection after adding
  };

  // *** NEW Handler: Update an existing exercise in the list ***
  const handleExerciseChange = (indexToChange, newExerciseValue) => {
    if (!validExercises.includes(newExerciseValue)) return; // Basic validation

    setTempExercises((prev) => {
      const updatedExercises = [...prev];
      updatedExercises[indexToChange] = newExerciseValue; // Update the exercise at the specific index
      return updatedExercises;
    });
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
            width: { xs: '90%', sm: 450 }, // Responsive width
            bgcolor: "background.paper",
            borderRadius: "15px", // Slightly less rounded
            boxShadow: 24,
            p: 3, // Adjusted padding
            display: "flex",
            flexDirection: "column",
            maxHeight: "80vh", // Increased max height
            overflowY: "auto",
             // Add scrollbar styling if desired
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'darkgrey',
              borderRadius: '10px',
              outline: '1px solid slategrey'
            }
          }}>

          <Typography variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
             Edit Program
          </Typography>

          {/* Editable program name */}
          <TextField
            fullWidth
            label="Program Name"
            variant="outlined"
            value={tempProgramName}
            onChange={(e) => setTempProgramName(e.target.value)}
            sx={{ mb: 2 }} // Adjusted margin
          />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>Exercises:</Typography>

          {/* List of current exercises - NOW EDITABLE */}
          {tempExercises.length > 0 ? (
            tempExercises.map((exercise, index) => (
              <Box
                key={index} // Key on the outer element
                sx={{
                  display: "flex",
                  alignItems: "center", // Align items vertically
                  width: "100%",
                  mb: 1, // Adjusted margin
                  p: 1,
                  borderRadius: "5px",
                }}>

                {/* *** MODIFIED PART: Use Select instead of Typography *** */}
                <FormControl fullWidth sx={{ mr: 1 }}>
                  {/* Optional: Add InputLabel if needed
                  <InputLabel id={`exercise-label-${index}`}>Exercise {index + 1}</InputLabel>
                  */}
                  <Select
                    // labelId={`exercise-label-${index}`} // Needed if using InputLabel
                    value={exercise} // The current exercise at this index
                    onChange={(event) => handleExerciseChange(index, event.target.value)} // Use the new handler
                    size="small" // Make dropdowns less tall
                    variant="outlined"
                  >
                    {/* Provide all valid exercises as options */}
                    {validExercises.map((validEx) => (
                      <MenuItem key={validEx} value={validEx}>
                        {formatExerciseName(validEx)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Controls: Add below (using newExerciseToAdd), Remove */}
                <Box sx={{ display: 'flex' }}>
                  <IconButton
                    onClick={() => removeExercise(index)}
                    color="error"
                    size="small"
                    title="Remove this exercise" // Tooltip
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          ) : (
            <Typography sx={{ my: 2, textAlign: 'center', color: 'text.secondary' }}>
                No exercises in this program yet.
            </Typography>
          )}

          {/* --- Section for Adding New Exercises --- */}
          <Box sx={{ borderTop: '1px solid lightgray', pt: 2, mt: 2, display: 'flex', alignItems: 'center', gap: 1}}>
             <FormControl fullWidth sx={{ flexGrow: 1 }}>
                <Select
                    value={newExerciseToAdd}
                    onChange={(e) => setNewExerciseToAdd(e.target.value)}
                    size="small"
                    displayEmpty
                >
                    {/* Placeholder when nothing is selected */}
                    <MenuItem value="" disabled>
                       Select an exercise...
                    </MenuItem>
                    {/* List of available exercises */}
                    {validExercises.map((exercise) => (
                    <MenuItem key={exercise} value={exercise}>
                        {formatExerciseName(exercise)}
                    </MenuItem>
                    ))}
                </Select>
             </FormControl>
            <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => addNewExerciseAt(tempExercises.length, newExerciseToAdd)} // Add to end
                disabled={!newExerciseToAdd}
                title="Add selected exercise to end of list"
                sx={{ flexShrink: 0 }}
                >
                Add
            </Button>
          </Box>


          {/* Action buttons for saving and closing */}
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 3, borderTop: '1px solid lightgray', pt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default ProgramModal;