import React from "react";
import { Typography, Box } from '@mui/material';
import WebcamBox from "../../components/Webcam";

function Exercise1() {
    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: '40px' }}>
                Exercise1
            </Typography>
            <WebcamBox />
        </Box>
    );
}

export default Exercise1;