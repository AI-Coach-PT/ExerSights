import { React, useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";
import ExerciseHistoryTable from "../components/ExerciseHistoryTable";

const MyExerSights = () => {
  const auth = getAuth();

  const [isAuth, setIsAuth] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState([]);

  const fetchExerciseHistory = async (userEmail) => {
    try {
      const userDocRef = doc(db, "users", userEmail);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Get the exerciseHistory field
        const history = userDoc.data().exerciseHistory || {};

        // Convert to array and sort by timestamp (keys) in descending order
        const sortedHistory = Object.entries(history)
          .map(([timestamp, data]) => ({
            timestamp: parseInt(timestamp),
            ...data,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        // Log the sorted history
        setExerciseHistory(sortedHistory);
      } else {
        console.log("No such user document!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching exercise history:", error);
      return [];
    }
  };

  // call this method whenever authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true); // signed in
        fetchExerciseHistory(auth.currentUser.email);
      } else {
        setIsAuth(false); // signed out
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
      <Typography variant="h1" sx={{ mb: "1.5rem" }}>
        Your ExerSights History
      </Typography>
      <ExerciseHistoryTable exerciseHistory={exerciseHistory} />
    </Box>
  );
};

export default MyExerSights;
