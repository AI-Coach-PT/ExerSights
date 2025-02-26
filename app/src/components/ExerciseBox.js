import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import WebcamCanvas from "./WebcamCanvas";
import VideoCanvas from "./VideoCanvas";
import startPoseDetection from "../utils/models/PoseDetectorPoseVideo";
import detectPose from "../utils/models/PoseDetector";
import OverlayBox from "./CounterGraphic";

function ExerciseBox({ title, feedbackPanel, processPoseResults, targetAngles, color, repCount }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);
  const [useVideo, setUseVideo] = useState(false);

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    if (repCount > 0) {
      setShowOverlay(false);
      setTimeout(() => {
        setShowOverlay(true);
      }, 10);
      setTimeout(() => {
        setShowOverlay(false);
      }, 1000);
    }
  }, [repCount]);

  useEffect(() => {
    // Fetch available video devices
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      const videoDevices = deviceList.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first device
      }
    });
  }, []);

  const handleCameraSelect = (deviceId) => {
    setSelectedDeviceId(deviceId); // Update selected camera
  };

  useEffect(() => {
    detectPose(webcamRef, canvasRef, processPoseResults);
  }, [targetAngles]);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      const videoElement = videoRef.current;

      videoElement.src = videoURL;
      videoElement.onloadeddata = () => {
        videoElement.pause(); // Pause initially until user plays it
      };

      setUseVideo(true);
    }
  };

  const handlePlay = () => {
    const videoElement = videoRef.current;
    startPoseDetection(videoElement, videoCanvasRef, processPoseResults);
  };

  const enhancedFeedbackPanel = React.cloneElement(feedbackPanel, {
    handleVideoUpload: handleVideoUpload, // Spread in the extra props
  });

  return (
    <Box sx={{ padding: "0.5rem" }}>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          height: "fit-content",
          padding: "2vmin",
          gap: "2rem",
        }}
      >
        {/* Camera selection dropdown */}
        <Box sx={{ width: "100%", mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Select Camera</InputLabel>
            <Select
              value={selectedDeviceId}
              onChange={(e) => handleCameraSelect(e.target.value)}
            >
              {devices.map((device) => (
                <MenuItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            border: `6px solid ${color || "white"}`, // Dynamic border color
            borderRadius: "1rem",
            overflow: "hidden",
            m: "2rem",
            display: useVideo ? "none" : "",
            position: "relative",
            boxShadow: `0px 0px 65px 0px ${color}`,
          }}
        >
          {/* WebcamCanvas with camera selection passed as prop */}
          <WebcamCanvas
            dimensions={dimensions}
            ref={{ webcamRef: webcamRef, canvasRef: canvasRef }}
            selectedDeviceId={selectedDeviceId} // Pass the selected camera ID
          />
          {showOverlay && <OverlayBox text={repCount} />}
        </Box>

        <Box
          sx={{
            border: `6px solid ${color || "white"}`, // Dynamic border color
            borderRadius: "8px",
            overflow: "hidden",
            padding: "5px",
            display: useVideo ? "" : "none",
            boxShadow: `0px 0px 65px 0px ${color}`,
          }}
        >
          <VideoCanvas
            handlePlay={handlePlay}
            ref={{ videoRef: videoRef, canvasRef: videoCanvasRef }}
          />
          {showOverlay && <OverlayBox text={repCount} />}
        </Box>

        {enhancedFeedbackPanel}
      </Box>
    </Box>
  );
}

export default ExerciseBox;
