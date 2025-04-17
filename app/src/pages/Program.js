import React, { useEffect, useState } from "react";
import { Typography, Box, IconButton, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Assuming Grid2 was intentional
import { useNavigate } from "react-router-dom";
import ProgramModal from "../components/ProgramModal"; // Assuming path is correct
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Assuming path is correct
import toast from "react-hot-toast";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig"; // Assuming path is correct
// Consider using UUIDs for more robust IDs if needed
// import { v4 as uuidv4 } from 'uuid';

// Default programs data (used as initial state and fallback)
const defaultPrograms = {
  1: { name: "Core", list: ["plank", "deadBug", "bridge"] },
  2: { name: "Back", list: ["pullUp", "muscleUp"] },
};

// Modified save function to throw errors for better handling
const saveProgramsToDatabase = async (userEmail, programsToSave) => {
  try {
    const userRef = doc(db, "users", userEmail, "programs", "userPrograms");
    await setDoc(userRef, programsToSave, { merge: true });
  } catch (error) {
    console.error("Error saving programs to Firestore:", error);
    // Re-throw the error so the calling function (addProgram/removeProgram) can handle it
    throw new Error("Failed to save programs to database.");
  }
};

function Program() {
  const navigate = useNavigate();
  // Initialize state with defaults, matching original behaviour
  const [programsState, setProgramsState] = useState(defaultPrograms);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email) {
        // Check for user and email
        try {
          const docRef = doc(
            db,
            "users",
            user.email,
            "programs",
            "userPrograms"
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // Ensure fetched data isn't null/undefined before setting state
            setProgramsState(docSnap.data() || {});
          } else {
            // User logged in, but no program data found.
            // Keep state empty or set defaults? Original code implied setting defaults.
            setProgramsState({}); // Start fresh for logged-in user with no saved data
            // Or: setProgramsState(defaultPrograms); // If you want them to start with defaults
          }
        } catch (e) {
          console.error("Error reading user programs:", e);
          toast.error("Could not load your saved programs.");
          // Fallback to defaults if read fails for logged-in user
          setProgramsState(defaultPrograms);
        }
      } else {
        // User is logged out, show defaults
        setProgramsState(defaultPrograms);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array is correct

  const handleNavigate = (programId) => {
    // Ensure program and list exist before accessing length or navigating
    if (
      !programsState[programId] ||
      !Array.isArray(programsState[programId].list)
    ) {
      console.error(`Program data or list missing for ID: ${programId}`);
      toast.error("Cannot start program: data missing or invalid.");
      return;
    }
    if (programsState[programId].list.length === 0) {
      toast.error("Empty Program"); // Original message
      logEvent(analytics, "notification_received", {
        notification_type: "empty_program_start_attempt",
      });
      return;
    }
    navigate("/programOverlay", {
      state: { currentProgram: programsState[programId] },
    });
  };

  const addProgram = async () => {
    // Make async
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      // Check user and email
      toast.error("You must be logged in to add a program.");
      logEvent(analytics, "notification_received", {
        notification_type: "add_program_auth_fail",
      });
      return;
    }

    // **Improved ID Generation (Example: Max numeric ID + 1)**
    const existingIds = Object.keys(programsState)
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newProgramId = (maxId + 1).toString();

    // **Alternative ID: Timestamp**
    // const newProgramId = Date.now().toString();

    const newProgramData = {
      name: `New Program ${newProgramId}`,
      list: [],
    };

    // **Fix: Calculate the definitive new state *before* calling setState**
    const newState = {
      ...programsState,
      [newProgramId]: newProgramData,
    };

    // **Store current state for potential rollback**
    const previousState = programsState;

    // **Optimistic UI Update**
    setProgramsState(newState);

    // **Save the calculated new state to DB and handle errors**
    try {
      await saveProgramsToDatabase(user.email, newState);
      toast.success("Program added!"); // Provide success feedback
      logEvent(analytics, "program_added", { program_id: newProgramId });
    } catch (error) {
      console.error("Failed to save new program:", error);
      toast.error(
        `Error adding program: ${error.message || "Please try again."}`
      ); // Provide error feedback
      logEvent(analytics, "program_add_failed", { error: error.message });
      // **Rollback UI on failure**
      setProgramsState(previousState); // Revert to the state before attempting the add
    }
  };

  const removeProgram = async (programId) => {
    // Make async
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      // Check user and email
      toast.error("You must be logged in to remove a program.");
      logEvent(analytics, "notification_received", {
        notification_type: "remove_program_auth_fail",
      });
      return;
    }

    // Get name for confirmation dialog, handle if program doesn't exist unexpectedly
    const programNameToDelete =
      programsState[programId]?.name || `Program ${programId}`;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${programNameToDelete}"?`
    );
    if (!confirmDelete) return;

    // **Store the current state in case we need to rollback**
    const previousState = { ...programsState };

    // **Optimistic UI update**
    setProgramsState((prevPrograms) => {
      const updatedPrograms = { ...prevPrograms };
      delete updatedPrograms[programId];
      return updatedPrograms;
    });

    // **Try to update Firestore**
    try {
      const programRef = doc(
        db,
        "users",
        user.email,
        "programs",
        "userPrograms"
      );
      // Use updateDoc with deleteField to remove the specific program key
      await updateDoc(programRef, {
        [programId]: deleteField(),
      });
      toast.success(`"${programNameToDelete}" deleted.`); // Success feedback
      logEvent(analytics, "program_removed", { program_id: programId });
    } catch (error) {
      console.error("Failed to delete program from Firestore:", error);
      toast.error(
        `Error deleting program: ${error.message || "Please try again."}`
      ); // Error feedback
      logEvent(analytics, "program_remove_failed", {
        program_id: programId,
        error: error.message,
      });
      // **Rollback UI on failure**
      setProgramsState(previousState);
    }
  };

  // --- JSX Rendering ---
  // (Keeping the original structure and styling props)
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0.5rem",
      }}
    >
      <Typography variant="h1" sx={{ mb: 1 }}> 
        Program
      </Typography>
      <Typography variant="h6" sx={{ mb: "1.5rem" }}>
        Start with a pre-made program, or create your own!
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {/* Check if programsState is a valid object before mapping */}       {" "}
        {programsState &&
          typeof programsState === "object" &&
          Object.entries(programsState).map(([programId, programData]) => {
            // Basic check for valid programData structure to prevent render errors
            if (
              !programData ||
              typeof programData.name !== "string" ||
              !Array.isArray(programData.list)
            ) {
              console.warn(
                `Invalid program data structure for ID: ${programId}`,
                programData
              );
              return null; // Skip rendering this item if data is malformed
            }
            return (
              <Grid item xs={12} sm={6} md={4} key={programId}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, borderRadius: 2, textAlign: "center" }}
                >
                  <Typography variant="h5" gutterBottom>
                    {programData.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ProgramModal
                      programId={programId}
                      programData={programData}
                      programsState={programsState}
                      setProgramsState={setProgramsState}
                    />
                    <IconButton
                      onClick={() => removeProgram(programId)}
                      color="error"
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Box>

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
            );
          })}
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
        {" "}
      </Grid>
      {" "}
    </Box>
  );
}

export default Program;
