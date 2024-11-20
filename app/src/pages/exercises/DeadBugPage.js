import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, TextField, Button, IconButton, Modal } from "@mui/material";
import detectPose from "../../utils/PoseDetector";
import { checkDeadBug } from "../../utils/DeadBug";
import SettingsIcon from "@mui/icons-material/Settings";
import { loadExerciseSettings, storeExerciseSettings } from "../../utils/ExerciseSettings";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import WebcamCanvas from "../../components/WebcamCanvas";
import { resetRepCount } from "../../utils/GenFeedback";

/**
 * A React functional component that provides real-time tracking and feedback of the dead bug exercise, using
 * the Mediapipe Pose model and a webcam feed. The component displays the user's current underarm and hip angles,
 * repetition count, and feedback on the exercise form. It also allows the user to adjust the target 'flat' angle,
 * the angle the user must flatten their body towards for a legitimate repetition.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Dead Bug tracking page, including webcam feed, feedback,
 *                        repetition count, target angle display, and a reset button.
 */
function DeadBugPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [windowResizing, setWindowResizing] = useState(false);
  const [targetFlatAngle, setTargetFlatAngle] = useState(140);
  const [leftUnderarmAngle, setLeftUnderarmAngle] = useState(0);
  const [rightUnderarmAngle, setRightUnderarmAngle] = useState(0);
  const [leftHipAngle, setLeftHipAngle] = useState(0);
  const [rightHipAngle, setRightHipAngle] = useState(0);
  const [feedback, setFeedback] = useState("");
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
  const [targetAngles, setTargetAngles] = useState({ targetFlatAngle: targetFlatAngle });

  // Array of arrays of useState set functions, with the key into the Promise object,
  // returned from getDoc, to retrieve the angle value to be set;
  // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
  // whereas targetAngles is an Object that keeps a store of target angle VALUES;
  // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
  const setTargetAnglesArray = [[setTargetFlatAngle, "targetFlatAngle"]];

  /**
   * Handles changes to the target flat angle input.
   *
   * @param {Object} event - The event object from the input change.
   */
  const handleTargetFlatAngleChange = (event) => {
    setTargetFlatAngle(event.target.value);
  };

  /**
   * Processes pose results from the Mediapipe model and updates state.
   *
   * @param {Array} landmarks - The array of pose landmarks.
   */
  const processPoseResults = (landmarks) => {
    checkDeadBug(
      landmarks,
      targetFlatAngle,
      setLeftUnderarmAngle,
      setRightUnderarmAngle,
      setLeftHipAngle,
      setRightHipAngle,
      setFeedback,
      setRepCount,
      setLimbsVisible
    );
  };

  /**
   * Resets the repetition count to zero.
   */
  const handleReset = () => {
    setRepCount(0);
    resetRepCount(0);
  };

  /**
   * Opens the settings modal and stops the webcam stream to prevent
   * unnecessary resource usage while the user is adjusting settings.
   */
  const handleOpenModal = () => {
    setOpenModal(true);
    // if (webcamRef.current && webcamRef.current.video) {
    //   const stream = webcamRef.current.video.srcObject;
    //   const tracks = stream.getTracks();
    //   tracks.forEach((track) => track.stop());
    // }
  };

  /**
   * Closes the settings modal, restarts the webcam stream and pose
   * detection, and saves settings to Firebase Cloud Firestore when
   * the user exits the modal.
   */
  const handleCloseModal = () => {
    setOpenModal(false);
    // detectPose(webcamRef, canvasRef, processPoseResults);
    // only store setting when user is logged in, and load it immediately afterwards
    if (userLoggedIn) {
      console.log(targetAngles);
      console.log(`CURRENT targetFlagAngle = ${targetFlatAngle}`);
      storeExerciseSettings(userEmail, "deadbug", targetAngles);
      loadExerciseSettings(userEmail, "deadbug", setTargetAnglesArray);
    }
  };

  // Update the targetAngles object whenever targetFlatAngle changes
  useEffect(() => {
    setTargetAngles({ targetFlatAngle: targetFlatAngle });
  }, [targetFlatAngle]);

  // useEffect(() => {
  // if (windowResizing && webcamRef.current && webcamRef.current.video) {
  // const stream = webcamRef.current.video.srcObject;
  // const tracks = stream.getTracks();
  // tracks.forEach((track) => track.stop());
  // } else {
  // cancel the previous requestAnimationFrame
  // cancelAnimationFrame(animationID);
  // detectPose(webcamRef, canvasRef, animationID, processPoseResults);
  // detectPose(webcamRef, canvasRef, processPoseResults);
  // }
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
        loadExerciseSettings(userEmail, "deadbug", setTargetAnglesArray);
      } else {
        console.log("Logged out.");
        setUsername("");
        setUserLoggedIn(false);
      }
    });
    // detectPose(webcamRef, canvasRef, processPoseResults);
    return () => unsubscribe();
  }, [userEmail]);

  // const [stopDetection, setStopDetection] = useState(false);
  // const stopDetection = useRef(false);
  // const handleStopDetection = () => {
  //   // setStopDetection((prevState) => !prevState);
  //   stopDetection.current = !stopDetection.current;
  //   console.log(`stopDetection.current = ${stopDetection.current}`);
  // };
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
      //   poseLandmarker.close();
    };
  }, []);

  return (
    <Box>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Dead Bug
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
          <Typography variant="body1">Real-Time Feedback Panel</Typography>
          <Typography variant="body1">
            {"Feedback: "}
            <span style={{ color: "red" }}>{feedback ? feedback : "Please Begin Rep!"}</span>
          </Typography>
          <Typography variant="body1">
            Left Underarm Angle: {leftUnderarmAngle.toFixed(0)}°
          </Typography>
          <Typography variant="body1">
            Right Underarm Angle: {rightUnderarmAngle.toFixed(0)}°
          </Typography>
          <Typography variant="body1">Left Hip Angle: {leftHipAngle.toFixed(0)}°</Typography>
          <Typography variant="body1">Right Hip Angle: {rightHipAngle.toFixed(0)}°</Typography>
          <Typography variant="body1">Current Rep Count: {repCount}</Typography>
          <Button variant="contained" color="primary" onClick={handleReset}>
            Reset Rep Count
          </Button>
          {/* <Button variant="contained" color="primary" onClick={handleStopDetection}>
            {stopDetection.current ? "Start Detection" : "Stop Detection"}
          </Button> */}
          <IconButton sx={{ position: "relative", left: "10px" }} onClick={handleOpenModal}>
            <SettingsIcon />
          </IconButton>
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
            variant="body1"
            component="h2"
            sx={{ marginBottom: "20px" }}>
            Adjust Target Flat Angle
          </Typography>
          <TextField
            id="outlined-number"
            label="Target Flat Angle °"
            type="number"
            value={targetFlatAngle}
            onChange={handleTargetFlatAngleChange}
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

export default DeadBugPage;
