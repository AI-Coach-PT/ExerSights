import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import alarm from "../assets/alarm.wav";

const Timer = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [startElapsedTime, setStartElapsedTime] = useState(Date.now());
  // const [startExerciseTime, setStartExerciseTime] = useState(Date.now());
  const [timerDuration, setTimerDuration] = useState(30);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerCountdown, setTimerCountdown] = useState(30);

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
      if (timerCountdown > 0) setTimerCountdown(timerCountdown - i);
      await delay(1000);
    }
    setTimerCountdown(timerDuration);
    setTimerStarted(false);
    playTimerFinishAlarm();
  };

  const playTimerFinishAlarm = () => {
    const audio = new Audio(alarm);
    audio.play();
  };

  // useEffect(() => {
  //   elapsedTimeLoop();
  // }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {/* <Typography variant="body1">
        Current Elapsed Time is {currentTime - startElapsedTime} ms
      </Typography>
      <Typography variant="body1">
        Current Elapsed Time is {(currentTime - startElapsedTime) / 1000} s
      </Typography>
      <Button variant="contained" onClick={handleTimerReset}>
        Reset Elapsed Time
      </Button> */}
      {!timerStarted && (
        <TextField
          label={"Timer Duration"}
          type="number"
          onChange={(e) => handleTimerDurationChange(e.target.value)}
          sx={{ mt: "0.2rem" }}
          variant="filled"
        />
      )}
      {!timerStarted && (
        <Button variant="contained" onClick={handleTimerStart}>
          Start {timerDuration}-second Timer
        </Button>
      )}
      {timerStarted && <Typography variant="h5">Countdown: {timerCountdown}</Typography>}
    </Box>
  );
};

export default Timer;
