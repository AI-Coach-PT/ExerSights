import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, TextField, Button, Modal, IconButton} from '@mui/material';
import WebcamBox from "../../components/Webcam";
import detectPose from '../../utils/PoseDetector';
import { checkBridges, setBridgeCount } from '../../utils/Bridge';
import SettingsIcon from '@mui/icons-material/Settings';
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
    const [targetHipAngle, setTargetHipAngle] = useState(140);
    const [targetKneeAngle, setTargetKneeAngle] = useState(90);
    const [feedback, setFeedback] = useState("");
    const [leftHipAngle, setLeftHipAngle] = useState(0);
    const [leftKneeAngle, setLeftKneeAngle] = useState(0);
    const [repCount, setRepCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    

    const handleTargetHipAngleChange = (event) => {
        setTargetHipAngle(event.target.value);
    };

    const handleTargetKneeAngleChange = (event) => {
        setTargetKneeAngle(event.target.value);
    };

    const processPoseResults = (landmarks) => {
        checkBridges(landmarks, setFeedback, setLeftHipAngle, setLeftKneeAngle, setRepCount, targetHipAngle, targetKneeAngle);
    };

    const handleReset = () => {
        setRepCount(0);
        setBridgeCount(0);
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
            tracks.forEach(track => track.stop());
        }
    };

    /**
     * Closes the settings modal and restarts the webcam stream and pose 
     * detection when the user exits the modal.
     */
    const handleCloseModal = () => {
        setOpenModal(false);
        detectPose(webcamRef, canvasRef, processPoseResults);
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

            <Paper elevation={3} sx={{ padding: '20px', width: '300px', textAlign: 'left', position: 'relative' }}>
            <IconButton
                sx={{ position: 'absolute', top: '10px', right: '10px' }}
                onClick={handleOpenModal}
            >
                <SettingsIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                Real-Time Feedback Panel
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                {"Feedback: "}
                <span style={{ color: 'red' }}>
                    {feedback ? feedback : "Please Begin Rep!"}
                </span>
            </Typography>
            <Typography variant="h6" gutterBottom>
                Hip Angle: {leftHipAngle.toFixed(0)}°
            </Typography>
            <Typography variant="h6" gutterBottom>
                Knee Angle: {leftKneeAngle.toFixed(0)}°
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


            <Modal
                open={openModal}
                onClose={handleCloseModal}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid black',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
                        Adjust Target Knee Angle
                    </Typography>
                    <TextField
                        id="outlined-number"
                        label="Target Hip Angle °"
                        type="number"
                        value={targetHipAngle}
                        onChange={handleTargetHipAngleChange}
                        sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                        id="outlined-number"
                        label="Target Knee Angle °"
                        type="number"
                        value={targetKneeAngle}
                        onChange={handleTargetKneeAngleChange}
                        sx={{ marginBottom: '20px' }}
                    />
                    <Button variant="contained" onClick={handleCloseModal}>
                        Save & Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default BridgePage;
