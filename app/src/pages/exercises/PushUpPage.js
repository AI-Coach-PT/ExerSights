import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, TextField, Button, IconButton, Modal } from "@mui/material";
import WebcamCanvas from "../../components/WebcamCanvas";
import detectPose from "../../utils/PoseDetector";
import { checkPushup } from "../../utils/PushUp";
import SettingsIcon from "@mui/icons-material/Settings";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { loadExerciseSettings, storeExerciseSettings } from "../../utils/ExerciseSettings";
import { resetRepCount } from "../../utils/GenFeedback";

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
function PushUpPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [windowResizing, setWindowResizing] = useState(false);
  const [targetElbowAngle, setTargetElbowAngle] = useState(65);
  const [feedback, setFeedback] = useState("");
  const [currElbowAngle, setCurrElbowAngle] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [userEmail, setUsername] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const limbsVisibleRef = useRef(true);  // Ref for limbs visibility 
  const setLimbsVisible = (visible) => { 
      limbsVisibleRef.current = visible; 
  }; 


  // Object containing key-value pair of target angle label(s) and corresponding value(s);
  // used to store angles into Firebase Cloud Firestore
  const [targetAngles, setTargetAngles] = useState({
    targetElbowAngle: targetElbowAngle,
  });

  // Array of arrays of useState set functions, with the key into the Promise object,
  // returned from getDoc, to retrieve the angle value to be set;
  // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
  // whereas targetAngles is an Object that keeps a store of target angle VALUES;
  // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
  const setTargetAnglesArray = [[setTargetElbowAngle, "targetElbowAngle"]];

  const handleTargetElbowAngleChange = (event) => {
    setTargetElbowAngle(event.target.value);
  };

  const processPoseResults = (landmarks) => {
    checkPushup(landmarks, setFeedback, setCurrElbowAngle, setRepCount, setLimbsVisible, targetElbowAngle);
  };

  const handleReset = () => {
    resetRepCount(0);
    setRepCount(0);
  };

  /**
   * Opens the settings modal and stops the webcam stream to prevent
   * unnecessary resource usage while the user is adjusting settings.
   */
  const handleOpenModal = () => {
    setOpenModal(true);
    // if (webcamRef.current && webcamRef.current.video) {
    //     const stream = webcamRef.current.video.srcObject;
    //     const tracks = stream.getTracks();
    //     tracks.forEach((track) => track.stop());
    // }
  };

  /**
   * Closes the settings modal and restarts the webcam stream and pose
   * detection when the user exits the modal.
   */
  const handleCloseModal = () => {
    setOpenModal(false);
    // detectPose(webcamRef, canvasRef, processPoseResults);
    // only store setting when user is logged in, and load it immediately afterwards
    if (userLoggedIn) {
      console.log(targetAngles);
      console.log(`CURRENT targetElbowAngle = ${targetElbowAngle}`);
      storeExerciseSettings(userEmail, "pushup", targetAngles);
      loadExerciseSettings(userEmail, "pushup", setTargetAnglesArray);
    }
  };

  // Update the targetAngles object whenever targetKneeAngle and/or targetHipAngle changes
  useEffect(() => {
    setTargetAngles({ targetElbowAngle: targetElbowAngle });
  }, [targetElbowAngle]);

  // useEffect(() => {
  //     if (windowResizing && webcamRef.current && webcamRef.current.video) {
  //         const stream = webcamRef.current.video.srcObject;
  //         const tracks = stream.getTracks();
  //         tracks.forEach((track) => track.stop());
  //     } else {
  //         // cancel the previous requestAnimationFrame
  //         // cancelAnimationFrame(animationID);
  //         // detectPose(webcamRef, canvasRef, animationID, processPoseResults);
  //         detectPose(webcamRef, canvasRef, processPoseResults);
  //     }
  // }, [windowResizing]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in.");
        setUsername(user.email);
        console.log(userEmail);
        setUserLoggedIn(true);
        // Load settings upon a signed-in user navigating to exercise page;
        // if the user does not have saved settings, this will do nothing,
        // and the last set values will be used (most likely default values)
        loadExerciseSettings(userEmail, "squat", setTargetAnglesArray);
      } else {
        console.log("Logged out.");
        setUsername("");
        setUserLoggedIn(false);
      }
    });
    // detectPose(webcamRef, canvasRef, processPoseResults);
    return () => unsubscribe();
  }, [userEmail]);

  //   const stopDetection = useRef(false);
  //   const handleStopDetection = () => {
  //     // setStopDetection((prevState) => !prevState);
  //     stopDetection.current = !stopDetection.current;
  //     console.log(`stopDetection.current = ${stopDetection.current}`);
  //   };
  useEffect(() => {
    // detectPose(webcamRef, canvasRef, processPoseResults, stopDetection);
    detectPose(webcamRef, canvasRef, limbsVisibleRef, processPoseResults);
    // let timeout;
    // const handleResize = () => {
    //   clearTimeout(timeout);
    //   setWindowResizing(true);

    //   setDimensions({
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    //   });

    //   timeout = setTimeout(() => {
    //     setWindowResizing(false);
    //   }, 1500);
    // };

    // window.addEventListener("resize", handleResize);
    return () => {
      // window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Pushup
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
            <IconButton sx={{ position: "static" }} onClick={handleOpenModal}>
              <SettingsIcon />
            </IconButton>
          </Box>
          <Typography variant="body1">{"Feedback: "}</Typography>
          <Typography variant="body1" style={{ color: "red" }}>
            {feedback ? feedback : "Please Begin Rep!"}
          </Typography>
          <Typography variant="body1">Elbow Angle: {currElbowAngle.toFixed(0)}°</Typography>
          <Typography variant="body1">Current Rep Count: {repCount}</Typography>
          <Button variant="contained" color="primary" onClick={handleReset}>
            Reset Rep Count
          </Button>
        </Paper>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid black",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: "20px" }}>
            Adjust Target Elbow Angle
          </Typography>
          <TextField
            id="outlined-number"
            label="Target Elbow Angle ° for Pushup"
            type="number"
            value={targetElbowAngle}
            onChange={handleTargetElbowAngleChange}
            sx={{ marginBottom: "20px" }}
          />
          <Button variant="contained" onClick={handleCloseModal}>
            Save & Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default PushUpPage;
