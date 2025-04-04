import { React, useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";
import toast from "react-hot-toast";
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
        console.log("Exercise History:", sortedHistory);
        setExerciseHistory(sortedHistory);

        return sortedHistory;
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
        toast("User signed in!");
      } else {
        setIsAuth(false); // signed out
        toast("User signed out!");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <Box>
      <ExerciseHistoryTable exerciseHistory={exerciseHistory} />
    </Box>
  );
};

export default MyExerSights;
