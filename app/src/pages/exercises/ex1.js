import React, { useRef, useEffect } from "react";
import { Typography, Box } from '@mui/material';
import WebcamBox from "../../components/Webcam";
import detectPose from '../../utils/PoseDetector';

function Exercise1() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        detectPose(webcamRef, canvasRef);
    }, []);

    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: '40px' }}>
                Exercise1
            </Typography>
            <WebcamBox ref={webcamRef} />
            <canvas
                ref={canvasRef}
                width="640"
                height="480"
                style={{ border: '2px solid black' }}
            />
        </Box>
    );
}

export default Exercise1;