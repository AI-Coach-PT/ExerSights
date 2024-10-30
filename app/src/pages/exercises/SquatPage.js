import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, TextField, Button, IconButton, Modal } from "@mui/material";
import WebcamBox from "../../components/Webcam";
import detectPose from "../../utils/PoseDetector";
import { checkChestUp, checkSquats, setSquatCount } from "../../utils/Squat";
import SettingsIcon from "@mui/icons-material/Settings";
import { loadExerciseSettings, storeExerciseSettings } from "../../utils/ExerciseSettings";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

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
    const [targetKneeAngle, setTargetKneeAngle] = useState(90);
    const [feedback, setFeedback] = useState("");
    const [targetHipAngle, setTargetHipAngle] = useState(45);
    const [hipAnglefeedback, setHipAngleFeedback] = useState("");
    const [currKneeAngle, setCurrKneeAngle] = useState(0);
    const [repCount, setRepCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [userEmail, setUsername] = useState("");
    const [userLoggedIn, setUserLoggedIn] = useState(false);

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
     * Handles changes to the target knee angle input.
     *
     * @param {Object} event - The event object from the input change.
     */
    const handleTargetKneeAngleChange = (event) => {
        setTargetKneeAngle(event.target.value);
    };

    /**
     * Handles changes to the target hip angle input.
     *
     * @param {Object} event - The event object from the input change.
     */
    const handleTargetHipAngleChange = (event) => {
        setTargetHipAngle(event.target.value);
    };

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
        setSquatCount(0);
    };

    /**
     * Opens the settings modal and stops the webcam stream to prevent
     * unnecessary resource usage while the user is adjusting settings.
     */
    const handleOpenModal = () => {
        setOpenModal(true);
        if (webcamRef.current && webcamRef.current.video) {
            const stream = webcamRef.current.video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
        }
    };

    /**
     * Closes the settings modal and restarts the webcam stream and pose
     * detection when the user exits the modal.
     */
    const handleCloseModal = () => {
        setOpenModal(false);
        detectPose(webcamRef, canvasRef, processPoseResults);
        // only store setting when user is logged in, and load it immediately afterwards
        if (userLoggedIn) {
            console.log(targetAngles);
            console.log(`CURRENT targetKneeAngle = ${targetKneeAngle}`);
            console.log(`CURRENT targetHipAngle = ${targetHipAngle}`);
            storeExerciseSettings(userEmail, "squat", targetAngles);
            loadExerciseSettings(userEmail, "squat", setTargetAnglesArray);
        }
    };

    // Update the targetAngles object whenever targetKneeAngle and/or targetHipAngle changes
    useEffect(() => {
        setTargetAngles({ targetKneeAngle: targetKneeAngle, targetHipAngle: targetHipAngle });
    }, [targetKneeAngle, targetHipAngle]);

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
        detectPose(webcamRef, canvasRef, processPoseResults);
        return () => unsubscribe();
    }, [userEmail]);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Box sx={{ marginRight: "20px" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ marginBottom: "20px", textAlign: "center" }}>
                    Squats
                </Typography>
                <WebcamBox ref={webcamRef} />
                <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    style={{ border: "2px solid black" }}
                />
            </Box>

            <Paper
                elevation={3}
                sx={{ padding: "20px", width: "300px", textAlign: "left", position: "relative" }}>
                <IconButton
                    sx={{ position: "absolute", top: "10px", right: "10px" }}
                    onClick={handleOpenModal}>
                    <SettingsIcon />
                </IconButton>

                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    Real-Time Feedback Panel
                </Typography>

                <Typography variant="h6">{"Feedback: "}</Typography>
                <Typography variant="h6" style={{ color: "red" }}>
                    {feedback ? feedback : "Please Begin Rep!"}
                </Typography>
                <Typography variant="h6" style={{ color: "red", marginBottom: "20px" }}>
                    {hipAnglefeedback}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Knee Angle: {currKneeAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ marginTop: "20px" }}>
                    Current Rep Count: {repCount}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                    sx={{ marginTop: "20px" }}>
                    Reset Rep Count
                </Button>
            </Paper>

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
                        Adjust Target Knee Angle
                    </Typography>
                    <TextField
                        id="outlined-number"
                        label="Target Knee Angle ° for Depth"
                        type="number"
                        value={targetKneeAngle}
                        onChange={handleTargetKneeAngleChange}
                        sx={{ marginBottom: "20px" }}
                    />
                    <TextField
                        id="outlined-number"
                        label="Minimum Hip Angle ° (Chest Up)"
                        type="number"
                        value={targetHipAngle}
                        onChange={handleTargetHipAngleChange}
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

export default SquatPage;
