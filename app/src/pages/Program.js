import React, { useEffect, useState } from "react";
import { Typography, Box, IconButton, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import ProgramModal from "../components/ProgramModal";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../firebaseConfig";
import toast from "react-hot-toast";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

// Default programs data
const programs = {
  1: { name: "Core", list: ["plank", "deadBug", "bridge"] },
  2: { name: "Back", list: ["pullUp", "muscleUp"] },
};

const saveProgramsToDatabase = async (userEmail, programsState) => {
  try {
    const userRef = doc(db, "users", userEmail, "programs", "userPrograms");
    await setDoc(userRef, programsState, { merge: true });
  } catch (e) {
    console.log("Error saving programs to Firestore:", e);
  }
};

function Program() {
  const navigate = useNavigate();
  const [programsState, setProgramsState] = useState(programs);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.email, "programs", "userPrograms"));
          if (docSnap.exists()) {
            setProgramsState(docSnap.data());
          } else {
            setProgramsState(programs);
          }
        } catch (e) {
          console.error("Error reading document:", e);
        }
      } else {
        setProgramsState(programs);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (programId) => {
    if (programsState[programId].list.length === 0) {
      toast.error("Empty Program");
      logEvent(analytics, "notification_received");
      return;
    }
    navigate("/programOverlay", { state: { currentProgram: programsState[programId] } });
  };

  const addProgram = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to add a program.");
      logEvent(analytics, "notification_received");
      return;
    }

    const newProgramId = Object.keys(programsState).length + 1;
    const newProgram = {
      [newProgramId]: {
        name: `New Program ${newProgramId}`,
        list: [],
      },
    };

    setProgramsState((prevPrograms) => ({
      ...prevPrograms,
      ...newProgram,
    }));

    saveProgramsToDatabase(user.email, { ...programsState, ...newProgram });
  };

  const removeProgram = async (programId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to remove a program.");
      logEvent(analytics, "notification_received");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this program?");
    if (!confirmDelete) return;

    const programRef = doc(db, "users", user.email, "programs", "userPrograms");
    await updateDoc(programRef, {
      [programId]: deleteField(),
    });

    setProgramsState((prevPrograms) => {
      const updatedPrograms = { ...prevPrograms };
      delete updatedPrograms[programId];
      return updatedPrograms;
    });
  };

  return (
    <Box
      sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h1" gutterBottom sx={{ padding: "0.5rem" }}>
        Program
      </Typography>
      <Typography variant="h6" sx={{ mb: "1.5rem" }}>
        Start with a pre-made program, or create your own!
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {Object.entries(programsState).map(([programId, programData]) => (
          <Grid item xs={12} sm={6} md={4} key={programId}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                {programData.name}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                <ProgramModal
                  programId={programId}
                  programData={programData}
                  programsState={programsState}
                  setProgramsState={setProgramsState}
                />
                <IconButton onClick={() => removeProgram(programId)} color="error">
                  <RemoveCircleIcon />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, width: "100%" }}
                onClick={() => handleNavigate(programId)}>
                Start Program
              </Button>
            </Paper>
          </Grid>
        ))}

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
            }}>
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
