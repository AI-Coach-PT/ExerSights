import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, TextField, Button } from '@mui/material';
import WebcamBox from "../../components/Webcam";
import detectPose from '../../utils/PoseDetector';
import { checkBridges, setBridgeCount } from '../../utils/Bridge';

/**
 * A React functional component that provides a real-time Bridge tracking and feedback interface using 
 * the Mediapipe Pose model and a webcam feed. The component displays the user's current Hip angle, 
 * Bridge count, and feedback on the Bridge form. It also allows the user to adjust the target Hip angle 
 * for better Bridge depth tracking.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Bridge tracking page, including webcam feed, feedback,
 *                        Bridge count, Hip angle display, and a reset button.
 */
function BridgePage() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [targetHipAngle, setTargetHipAngle] = useState(160);
    const [feedback, setFeedback] = useState("");
    const [leftHipAngle, setleftHipAngle] = useState(0);
    const [repCount, setRepCount] = useState(0);

    const handleTargetHipAngleChange = (event) => {
        setTargetHipAngle(event.target.value);
    };

    const processPoseResults = (landmarks) => {
        checkBridges(landmarks, setFeedback, setleftHipAngle, setRepCount);
    };

    const handleReset = () => {
        setRepCount(0);
        setBridgeCount(0);
    };

    useEffect(() => {
        detectPose(webcamRef, canvasRef, processPoseResults);
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Box sx={{ marginRight: '20px' }}>
                <Typography variant="h4" gutterBottom sx={{ marginBottom: '20px', textAlign: 'center' }}>
                    Bridges
                </Typography>
                <WebcamBox ref={webcamRef} />
                <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    style={{ border: '2px solid black' }}
                />
            </Box>

            <Paper elevation={3} sx={{ padding: '20px', width: '300px', textAlign: 'left' }}>
                <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                    Real-Time Feedback Panel
                </Typography>
                <TextField
                    id="outlined-number"
                    label="Target Hip Angle °"
                    type="number"
                    value={targetHipAngle}
                    onChange={handleTargetHipAngleChange}
                    sx={{ marginBottom: '20px' }}
                />
                <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                    {"Feedback: "}
                    <span style={{ color: 'red' }}>
                        {feedback ? feedback : "Please Begin Rep!"}
                    </span>
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Hip Angle: {leftHipAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ marginTop: '20px' }}>
                    Current Rep Count: {repCount}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                    sx={{ marginTop: '20px' }}
                >
                    Reset Rep Count
                </Button>
            </Paper>
        </Box>
    );
}

export default BridgePage;
