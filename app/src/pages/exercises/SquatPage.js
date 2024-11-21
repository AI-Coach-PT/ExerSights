import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, Button } from "@mui/material";
import detectPose from "../../utils/PoseDetector";
import { checkChestUp, checkSquats } from "../../utils/Squat";
import HelpModal from "../../components/HelpModal";
import squatHelpImg from "../../assets/squatHelp.png";
import { instructionsTextSquat } from "../../assets/content";
import WebcamCanvas from "../../components/WebcamCanvas";
import { resetRepCount } from "../../utils/GenFeedback";
import SettingsModal from "../../components/SettingsModal";

/**
 * A React functional component that provides a real-time squat tracking and feedback interface using
 * the Mediapipe Pose model and a webcam feed. The component displays the user's current knee angle,
 * squat count, and feedback on the squat form. It also allows the user to adjust the target knee angle
 * for better squat depth tracking.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Squat tracking page, including webcam feed, feedback,
 *                        squat count, knee angle display, and a reset button.
 */
function SquatPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [targetKneeAngle, setTargetKneeAngle] = useState(90);
  const [feedback, setFeedback] = useState("");
  const [targetHipAngle, setTargetHipAngle] = useState(45);
  const [hipAnglefeedback, setHipAngleFeedback] = useState("");
  const [currKneeAngle, setCurrKneeAngle] = useState(0);
  const [repCount, setRepCount] = useState(0);

  // Object containing key-value pair of target angle label(s) and corresponding value(s);
  // used to store angles into Firebase Cloud Firestore
  const [targetAngles, setTargetAngles] = useState({
    targetKneeAngle: targetKneeAngle,
    targetHipAngle: targetHipAngle,
  });

  // Array of arrays of useState set functions, with the key into the Promise object,
  // returned from getDoc, to retrieve the angle value to be set;
  // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
  // whereas targetAngles is an Object that keeps a store of target angle VALUES;
  // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
  const setTargetAnglesArray = [
    [setTargetKneeAngle, "targetKneeAngle"],
    [setTargetHipAngle, "targetHipAngle"],
  ];

  /**
   * Processes pose results from the Mediapipe model and updates state.
   *
   * @param {Array} landmarks - The array of pose landmarks.
   */
  const processPoseResults = (landmarks) => {
    checkSquats(landmarks, setFeedback, setCurrKneeAngle, setRepCount, targetKneeAngle);
    checkChestUp(landmarks, setHipAngleFeedback, targetHipAngle);
  };

  /**
   * Resets the repetition count to zero.
   */
  const handleReset = () => {
    setRepCount(0);
    resetRepCount(0);
  };

  // Update the targetAngles object whenever targetKneeAngle and/or targetHipAngle changes
  useEffect(() => {
    setTargetAngles({ targetKneeAngle: targetKneeAngle, targetHipAngle: targetHipAngle });
  }, [targetKneeAngle, targetHipAngle]);

  useEffect(() => {
    detectPose(webcamRef, canvasRef, processPoseResults);

    return () => { };
  }, []);

  return (
    <Box>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Squat
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          height: "fit-content",
          padding: "2vmin",
        }}>
        <WebcamCanvas
          dimensions={dimensions}
          ref={{ webcamRef: webcamRef, canvasRef: canvasRef }}
        />
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            textAlign: "left",
            height: "fit-content",
            margin: "10px",
          }}>
          <Box sx={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
            <Typography variant="body1">Real-Time Feedback Panel</Typography>
            <HelpModal image={squatHelpImg} description={instructionsTextSquat} />
            <SettingsModal exerciseName="squat" targetAngles={targetAngles} setTargetAnglesArray={setTargetAnglesArray} />
          </Box>
          <Typography variant="body1">{"Feedback: "}</Typography>
          <Typography variant="body1" style={{ color: "red" }}>
            {feedback ? feedback : "Please Begin Rep!"}
          </Typography>
          <Typography variant="body1" style={{ color: "red" }}>
            {hipAnglefeedback}
          </Typography>
          <Typography variant="body1">Knee Angle: {currKneeAngle.toFixed(0)}°</Typography>
          <Typography variant="body1">Current Rep Count: {repCount}</Typography>
          <Button variant="contained" color="primary" onClick={handleReset}>
            Reset Rep Count
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default SquatPage;
