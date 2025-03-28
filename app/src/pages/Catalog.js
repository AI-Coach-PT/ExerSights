import React, { useState, useEffect } from "react";
import { Typography, Box, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExerciseCard from "../components/ExerciseCard.js";
import { catalogText } from "../assets/content.js";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import toast from "react-hot-toast";

const exerciseImages = Object.fromEntries(
  Object.keys(catalogText).map((key) => [key, require(`../assets/exercise-cards/${key}.png`)])
);

/**
 * Catalog is a React functional component that displays a list of exercise cards.
 * It dynamically iterates through the catalogText object to generate the exercise cards.
 * Includes a search bar to filter exercises by name or key.
 *
 * @returns {JSX.Element} A catalog page displaying exercises.
 */
function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pinnedExercises, setPinnedExercises] = useState([]);

  const filteredExercises = Object.keys(catalogText)
    .filter((exerciseKey) =>
      exerciseKey.toLowerCase().includes(searchTerm.toLowerCase().replace(/\s/g, ""))
    )
    .sort((a, b) => {
      const aPinned = pinnedExercises.includes(a);
      const bPinned = pinnedExercises.includes(b);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });

  const togglePin = async (exerciseKey) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to pin an exercise.");
      return;
    }

    const docRef = doc(db, "users", user.email, "pinnedExercises", "pinnedExercises");

    try {
      const docSnap = await getDoc(docRef);

      let updatedPins = [];

      if (!docSnap.exists()) {
        updatedPins = [exerciseKey];
        await setDoc(docRef, { pinnedExercises: updatedPins });
      } else {
        const currentPins = docSnap.get("pinnedExercises") || [];
        const isAlreadyPinned = currentPins.includes(exerciseKey);

        updatedPins = isAlreadyPinned
          ? currentPins.filter((key) => key !== exerciseKey)
          : [...currentPins, exerciseKey];

        await updateDoc(docRef, {
          pinnedExercises: updatedPins,
        });
      }

      setPinnedExercises(updatedPins);
    } catch (e) {
      console.error("Failed to toggle pin:", e);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(
            doc(db, "users", user.email, "pinnedExercises", "pinnedExercises")
          );
          if (docSnap.exists()) {
            setPinnedExercises(docSnap.get("pinnedExercises"));
          }
        } catch (e) {
          console.error("Error reading document:", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ textAlign: "center", padding: "0.5rem" }}>
      <Typography variant="h1">Catalog</Typography>
      <TextField
        label="Search Exercises"
        variant="outlined"
        fullWidth
        sx={{ margin: "1rem auto", maxWidth: "400px" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2} sx={{ justifyContent: "center", padding: "1rem" }}>
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exerciseKey) => (
            <ExerciseCard
              key={exerciseKey}
              title={exerciseKey
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              description={catalogText[exerciseKey]}
              link={`/exercise?exercise=${exerciseKey}`}
              image={exerciseImages[exerciseKey]}
              isPinned={pinnedExercises.includes(exerciseKey)}
              onPinToggle={() => togglePin(exerciseKey)}
            />
          ))
        ) : (
          <Typography variant="h6" sx={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
            No exercises fit your search criteria.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

export default Catalog;
