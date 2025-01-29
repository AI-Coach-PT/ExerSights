import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";

const Timer = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [startElapsedTime, setStartElapsedTime] = useState(Date.now());
  // const [startExerciseTime, setStartExerciseTime] = useState(Date.now());
  const [timerDuration, setTimerDuration] = useState(60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerCountdown, setTimerCountdown] = useState(60);

  const delay = async (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  const elapsedTimeLoop = async () => {
    while (true) {
      setCurrentTime(Date.now());
      await delay(1000);
    }
  };

  const handleTimerReset = () => {
    setStartElapsedTime(Date.now());
  };

  const handleTimerDurationChange = (value) => {
    setTimerDuration(value);
    setTimerCountdown(value);
  };

  const handleTimerStart = async () => {
    setTimerStarted(true);
    for (let i = 0; i < timerDuration; i++) {
      await delay(1000);
      if (timerCountdown > 0) setTimerCountdown(timerCountdown - i);
    }
    setTimerCountdown(timerDuration);
    setTimerStarted(false);
  };

  useEffect(() => {
    elapsedTimeLoop();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <Typography variant="body1">
        Current Elapsed Time is {currentTime - startElapsedTime} ms
      </Typography>
      <Typography variant="body1">
        Current Elapsed Time is {(currentTime - startElapsedTime) / 1000} s
      </Typography>
      <Button variant="contained" onClick={handleTimerReset}>
        Reset Elapsed Time
      </Button>
      <TextField
        label={"Timer Duration"}
        type="number"
        onChange={(e) => handleTimerDurationChange(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />
      {!timerStarted && (
        <Button variant="contained" onClick={handleTimerStart}>
          Start {timerDuration}-second Timer
        </Button>
      )}
      {timerStarted && <Typography>Countdown: {timerCountdown}</Typography>}
    </Box>
  );
};

export default Timer;
