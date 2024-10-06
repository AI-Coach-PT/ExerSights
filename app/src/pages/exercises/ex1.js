import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, TextField, Button } from "@mui/material";
import WebcamBox from "../../components/Webcam";
import PoseDetector from "../../utils/PoseDetectorNew";
import { checkSquats } from "../../utils/Squat";

function Exercise1() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [targetKneeAngle, setTargetKneeAngle] = useState(70);
    const [feedback, setFeedback] = useState("");
    const [leftKneeAngle, setLeftKneeAngle] = useState(0);
    const [repCount, setRepCount] = useState(0);

    const handleTargetKneeAngleChange = (event) => {
        setTargetKneeAngle(event.target.value);
    };

    const processPoseResults = (landmarks) => {
        checkSquats(landmarks, setFeedback, setLeftKneeAngle, setRepCount);
    };

    const handleReset = () => {
        setRepCount(0);
    };

    // useEffect(() => {
    //     detectPose(webcamRef, canvasRef, processPoseResults);
    // }, []);

    return (
        <Box
            sx={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
            <Box sx={{ marginRight: "20px" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ marginBottom: "20px", textAlign: "center" }}
                >
                    Squats
                </Typography>
                <PoseDetector
                    webcamRef={webcamRef}
                    canvasRef={canvasRef}
                    onResultCallback={processPoseResults}
                />
            </Box>

            <Paper
                elevation={3}
                sx={{ padding: "20px", width: "300px", textAlign: "left" }}
            >
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    Real-Time Feedback Panel
                </Typography>
                <TextField
                    id="outlined-number"
                    label="Target Knee Angle °"
                    type="number"
                    value={targetKneeAngle}
                    onChange={handleTargetKneeAngleChange}
                    sx={{ marginBottom: "20px" }}
                />
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    {"Feedback: "}
                    <span style={{ color: "red" }}>
                        {feedback ? feedback : "Please Begin Rep!"}
                    </span>
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Knee Angle: {leftKneeAngle.toFixed(0)}°
                </Typography>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ marginTop: "20px" }}
                >
                    Current Rep Count: {repCount}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                    sx={{ marginTop: "20px" }}
                >
                    Reset Rep Count
                </Button>
            </Paper>
        </Box>
    );
}

export default Exercise1;