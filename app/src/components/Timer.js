import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import alarm from "../assets/alarm.wav";

const Timer = () => {
  // const [currentTime, setCurrentTime] = useState(Date.now());
  // const [startElapsedTime, setStartElapsedTime] = useState(Date.now());
  // const [startExerciseTime, setStartExerciseTime] = useState(Date.now());
  const [timerDuration, setTimerDuration] = useState(30);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerCountdown, setTimerCountdown] = useState(30);
  const [prepStarted, setPrepStarted] = useState(false);
  const [prepCountdown, setPrepCountdown] = useState(5);

  const delay = async (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  // const elapsedTimeLoop = async () => {
  //   while (true) {
  //     setCurrentTime(Date.now());
  //     await delay(1000);
  //   }
  // };

  // const handleTimerReset = () => {
  //   setStartElapsedTime(Date.now());
  // };

  const handleTimerDurationChange = (value) => {
    setTimerDuration(value);
    setTimerCountdown(value);
  };

  const handleTimerStart = async () => {
    // 5-second prep time for users to get into position
    setPrepStarted(true);
    const prepTime = 5;
    for (let i = 0; i < prepTime; i++) {
      if (prepCountdown > 0) setPrepCountdown(prepCountdown - i);
      await delay(1000);
    }
    setPrepCountdown(5);
    setPrepStarted(false);

    // user-inputted countdown duration
    setTimerStarted(true);
    for (let i = 0; i < timerDuration; i++) {
      if (timerCountdown > 0) setTimerCountdown(timerCountdown - i);
      await delay(1000);
    }

    // reset timer and play finish audio
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
      {!timerStarted && !prepStarted && (
        <TextField
          label={"Timer Duration"}
          type="number"
          onChange={(e) => handleTimerDurationChange(e.target.value)}
          sx={{ mt: "0.2rem" }}
          variant="filled"
        />
      )}
      {!timerStarted && !prepStarted && (
        <Button variant="contained" onClick={handleTimerStart}>
          Start {timerDuration}-second Timer
        </Button>
      )}
      {!timerStarted && prepStarted && (
        <Typography variant="h5">Get ready! {prepCountdown}...</Typography>
      )}
      {timerStarted && !prepStarted && (
        <Typography variant="h5">Countdown: {timerCountdown}</Typography>
      )}
    </Box>
  );
};

export default Timer;
