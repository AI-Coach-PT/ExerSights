import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, TextField, Button } from "@mui/material";
import WebcamBox from "../../components/Webcam";
import detectPose from "../../utils/PoseDetector";
import { checkDeadBug, setDeadBugCount } from "../../utils/DeadBug";

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

    const [targetFlatAngle, setTargetFlatAngle] = useState(140);

    const [leftUnderarmAngle, setLeftUnderarmAngle] = useState(0);
    const [rightUnderarmAngle, setRightUnderarmAngle] = useState(0);
    const [leftHipAngle, setLeftHipAngle] = useState(0);
    const [rightHipAngle, setRightHipAngle] = useState(0);

    const [feedback, setFeedback] = useState("");
    const [repCount, setRepCount] = useState(0);

    const handleTargetFlatAngleChange = (event) => {
        setTargetFlatAngle(event.target.value);
    };

    const processPoseResults = (landmarks) => {
        checkDeadBug(
            landmarks,
            targetFlatAngle,
            setLeftUnderarmAngle,
            setRightUnderarmAngle,
            setLeftHipAngle,
            setRightHipAngle,
            setFeedback,
            setRepCount
        );
    };

    const handleReset = () => {
        setRepCount(0);
        setDeadBugCount(0);
    };

    useEffect(() => {
        detectPose(webcamRef, canvasRef, processPoseResults);
    }, []);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Box sx={{ marginRight: "20px" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ marginBottom: "20px", textAlign: "center" }}>
                    Dead Bug
                </Typography>
                <WebcamBox ref={webcamRef} />
                <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    style={{ border: "2px solid black" }}
                />
            </Box>
            <Paper elevation={3} sx={{ padding: "20px", width: "300px", textAlign: "left" }}>
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    Real-Time Feedback Panel
                </Typography>
                <TextField
                    id="outlined-number"
                    label="Target 'Flat' Angle °"
                    type="number"
                    value={targetFlatAngle}
                    onChange={handleTargetFlatAngleChange}
                    sx={{ marginBottom: "20px" }}
                />
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    {"Feedback: "}
                    <span style={{ color: "red" }}>
                        {feedback ? feedback : "Please Begin Rep!"}
                    </span>
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Left Underarm Angle: {leftUnderarmAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Right Underarm Angle: {rightUnderarmAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Left Hip Angle: {leftHipAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Right Hip Angle: {rightHipAngle.toFixed(0)}°
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
        </Box>
    );
}

export default DeadBugPage;
