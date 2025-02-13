import React, { forwardRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Box, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select } from "@mui/material";

// Webcam style based on environment variable
const webcamStyle =
    process.env.REACT_APP_MODEL === "tasks-vision"
        ? { visibility: "hidden", position: "absolute" }
        : { display: "none" };

const WEBCAM_TIMEOUT = 5000; // ms before reload prompt triggers

const WebcamCanvas = forwardRef((props, ref) => {
    const [canvasSize, setCanvasSize] = useState({ width: 640, height: 360 }); // Default 16:9
    const [loading, setLoading] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [key, setKey] = useState(0); // Force Webcam re-mount

    useEffect(() => {
        // Fetch available cameras
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === "videoinput");
            setCameras(videoDevices);

            if (videoDevices.length > 1) {
                setOpenDialog(true); // Prompt camera selection if multiple
            } else if (videoDevices.length === 1) {
                setSelectedCamera(videoDevices[0].deviceId);
            }
        });
    }, []);

    useEffect(() => {
        const videoElement = ref?.webcamRef?.current?.video;
        let timeoutId;

        const updateCanvasSize = () => {
            if (videoElement) {
                const videoWidth = videoElement.videoWidth;
                const videoHeight = videoElement.videoHeight;
                const aspectRatio = videoWidth / videoHeight;

                const browserWidth = props.dimensions.width * 0.7;
                const browserHeight = props.dimensions.height * 0.7;

                let newWidth, newHeight;
                if (browserWidth / browserHeight > aspectRatio) {
                    newHeight = browserHeight;
                    newWidth = newHeight * aspectRatio;
                } else {
                    newWidth = browserWidth;
                    newHeight = newWidth / aspectRatio;
                }

                setCanvasSize({ width: newWidth, height: newHeight });
            }
        };

        if (videoElement) {
            videoElement.addEventListener("loadedmetadata", updateCanvasSize);
            timeoutId = setTimeout(() => {
                setLoading(true);
                clearTimeout(timeoutId);
            }, WEBCAM_TIMEOUT);

            return () => {
                videoElement.removeEventListener("loadedmetadata", updateCanvasSize);
                clearTimeout(timeoutId);
            };
        }
    }, [ref, props.dimensions.width, props.dimensions.height]);

    const handleCameraSelect = (deviceId) => {
        setSelectedCamera(deviceId);
        setOpenDialog(false);
        setKey((prevKey) => prevKey + 1); // Change key to force re-mount
    };

    return (
        <Box>
            {/* Camera Selection Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Select a Camera</DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        value={selectedCamera || ""}
                        onChange={(e) => handleCameraSelect(e.target.value)}
                    >
                        {cameras.map((camera, index) => (
                            <MenuItem key={camera.deviceId} value={camera.deviceId}>
                                {camera.label || `Camera ${index + 1}`}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <div style={webcamStyle}>
                {selectedCamera && (
                    <Webcam
                        key={key} // Force re-mount when camera changes
                        ref={ref.webcamRef}
                        className="hidden-webcam"
                        disablePictureInPicture
                        videoConstraints={{ deviceId: { exact: selectedCamera } }}
                    />
                )}
            </div>

            <Box
                position="absolute"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
            >
                <CircularProgress />
                <Typography variant="body1" mt={1}>Loading Webcam...</Typography>
                {loading && (
                    <>
                        <Typography variant="body1" mt={1}>Taking too long? Click below to reload.</Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => window.location.reload()}>Reload</Button>
                    </>
                )}
            </Box>

            <canvas
                ref={ref.canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{
                    width: "100%",
                    height: "100%",
                    transform: "scaleX(-1)",
                    pointerEvents: "none"
                }}
            />
        </Box>
    );
});

export default WebcamCanvas;
