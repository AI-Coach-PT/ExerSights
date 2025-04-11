import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
} from "@mui/material";
import Delete from "@mui/icons-material/DeleteForever";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const ExerciseHistoryTable = ({ exerciseHistory, setExerciseHistory }) => {
  const [orderBy, setOrderBy] = useState("timestamp");
  const [order, setOrder] = useState("desc");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === "exercise") {
        return order === "asc" ? a.exercise.localeCompare(b.exercise) : b.exercise.localeCompare(a.exercise);
      } else {
        return order === "desc" ? b[orderBy] - a[orderBy] : a[orderBy] - b[orderBy];
      }
    };

    return [...exerciseHistory].sort(comparator);
  }, [exerciseHistory, order, orderBy]);

  const deleteExerciseEntry = async (timestamp) => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        [`exerciseHistory.${timestamp}`]: deleteField(),
      });

      setExerciseHistory((prevHistory) =>
        prevHistory.filter((entry) => entry.timestamp !== timestamp)
      );

      console.log("Exercise deleted:", timestamp);
    } catch (e) {
      console.error("Error deleting exercise:", e);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ p: "0.5rem" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              <TableSortLabel
                active={orderBy === "timestamp"}
                direction={orderBy === "timestamp" ? order : "asc"}
                onClick={() => handleRequestSort("timestamp")}>
                Date & Time
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              <TableSortLabel
                active={orderBy === "exercise"}
                direction={orderBy === "exercise" ? order : "asc"}
                onClick={() => handleRequestSort("exercise")}>
                Exercise
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              <TableSortLabel
                active={orderBy === "duration"}
                direction={orderBy === "duration" ? order : "asc"}
                onClick={() => handleRequestSort("duration")}>
                Duration (s)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              <TableSortLabel
                active={orderBy === "repCount"}
                direction={orderBy === "repCount" ? order : "asc"}
                onClick={() => handleRequestSort("repCount")}>
                Rep Count
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              Delete?
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow
              key={row.timestamp}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                fontSize: "1.05rem",
              }}>
              <TableCell component="th" scope="row" sx={{ fontSize: "1.05rem" }}>
                {new Date(row.timestamp).toLocaleString()}
              </TableCell>
              <TableCell sx={{ fontSize: "1.05rem" }}>{row.exercise}</TableCell>
              <TableCell align="right" sx={{ fontSize: "1.05rem" }}>
                {row.duration}
              </TableCell>
              <TableCell align="right" sx={{ fontSize: "1.05rem" }}>
                {row.repCount}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => deleteExerciseEntry(row.timestamp)}
                  sx={{ color: "red" }}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExerciseHistoryTable;
