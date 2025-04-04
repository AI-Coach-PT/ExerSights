import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ExerciseHistoryTable = ({ exerciseHistory }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="exercise history table">
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Exercise</TableCell>
            <TableCell align="right">Duration (s)</TableCell>
            <TableCell align="right">Rep Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exerciseHistory.map((row) => (
            <TableRow
              key={row.timestamp}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {new Date(row.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>{row.exercise}</TableCell>
              <TableCell align="right">{row.duration}</TableCell>
              <TableCell align="right">{row.repCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExerciseHistoryTable;
