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
} from "@mui/material";

const ExerciseHistoryTable = ({ exerciseHistory }) => {
  const [orderBy, setOrderBy] = useState("timestamp");
  const [order, setOrder] = useState("desc");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = React.useMemo(() => {
    const comparator = (a, b) => {
      if (order === "desc") {
        return b[orderBy] - a[orderBy];
      } else {
        return a[orderBy] - b[orderBy];
      }
    };

    return [...exerciseHistory].sort(comparator);
  }, [exerciseHistory, order, orderBy]);

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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExerciseHistoryTable;
