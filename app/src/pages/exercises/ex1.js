import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper } from '@mui/material';
import WebcamBox from "../../components/Webcam";
import detectPose from '../../utils/PoseDetector';
import { checkSquats } from '../../utils/Squat';

function Exercise1() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [feedback, setFeedback] = useState("");
    const [leftKneeAngle, setLeftKneeAngle] = useState(0);
    const [repCount, setRepCount] = useState(0);

    const processPoseResults = (landmarks) => {
        checkSquats(landmarks, setFeedback, setLeftKneeAngle, setRepCount);
    };

    useEffect(() => {
        detectPose(webcamRef, canvasRef, processPoseResults);
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Box sx={{ marginRight: '20px' }}>
                <Typography variant="h4" gutterBottom sx={{ marginBottom: '20px', textAlign: 'center' }}>
                    Squats
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
                <Typography variant="h6" gutterBottom>
                    Real-time Feedback:
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                    Feedback: {feedback}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Knee Angle: {leftKneeAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ marginTop: '20px' }}>
                    Current Rep Count:
                </Typography>
                <Typography variant="body1">
                    {repCount}
                </Typography>
            </Paper>
        </Box>
    );
}

export default Exercise1;
