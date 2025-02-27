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
  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);
  const [useVideo, setUseVideo] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(localStorage.getItem("selectedCamera") || "");
  const [forceRemountKey, setForceRemountKey] = useState(0);
  const [loading, setLoading] = useState(true);  // Default loading state is true
  const [showOverlay, setShowOverlay] = useState(false);
  const [stream, setStream] = useState(null);  // Track the stream object

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId);
        localStorage.setItem("selectedCamera", cameras[0].deviceId);
      }
    });
  }, []);

  useEffect(() => {
    const savedCamera = localStorage.getItem("selectedCamera");
    if (savedCamera) {
      setSelectedCamera(savedCamera);
    }
  }, []);

  useEffect(() => {
    if (repCount > 0) {
      setShowOverlay(false);
      setTimeout(() => setShowOverlay(true), 10);
      setTimeout(() => setShowOverlay(false), 1000);
    }
  }, [repCount]);

  // Toggle loading based on stream status
  useEffect(() => {
    setLoading(!stream);  // Set loading to true if no stream, false otherwise
  }, [stream]);

  // Consolidated useEffect for pose detection
  useEffect(() => {
    if (webcamRef.current && canvasRef.current) {
      console.log("Reinitializing pose detection for new camera or target angles:", selectedCamera, targetAngles);
      detectPose(webcamRef, canvasRef, processPoseResults);
    }
  }, [selectedCamera, forceRemountKey, targetAngles]); // Add targetAngles to dependencies

  const handleCameraChange = (event) => {
    const newCamera = event.target.value;
    setLoading(true);
    setSelectedCamera(newCamera);
    localStorage.setItem("selectedCamera", newCamera);
    setForceRemountKey(prev => prev + 1);
  };

  const handleUserMediaLoaded = (newStream) => {
    setStream(newStream); // Save the stream to state
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      const videoElement = videoRef.current;

      videoElement.src = videoURL;
      videoElement.onloadeddata = () => {
        videoElement.pause(); // Pause initially until the user plays it
      };

      setUseVideo(true);
    }
  };

  const handlePlay = () => {
    const videoElement = videoRef.current;
    startPoseDetection(videoElement, videoCanvasRef, processPoseResults);
  };

  // Pass video upload function to feedbackPanel
  const enhancedFeedbackPanel = React.cloneElement(feedbackPanel, {
    handleVideoUpload: handleVideoUpload, 
  });

  return (
    <Box sx={{ padding: "0.5rem" }}>
      <Typography variant="h2" sx={{ textAlign: "center" }}>{title}</Typography>
      <FormControl sx={{ marginBottom: "1rem" }}>
        <InputLabel>Choose Camera</InputLabel>
        <Select value={selectedCamera || ""} onChange={handleCameraChange} label="Choose Camera">
          {availableCameras.map((camera) => (
            <MenuItem key={camera.deviceId} value={camera.deviceId}>{camera.label || `Camera ${camera.deviceId}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "flex-start", width: "100%", height: "fit-content", padding: "2vmin", gap: "2rem" }}>
        {/* Webcam View */}
        <Box sx={{ border: `6px solid ${color || "white"}`, borderRadius: "1rem", overflow: "hidden", m: "2rem", display: useVideo ? "none" : "", position: "relative", boxShadow: `0px 0px 65px 0px ${color}` }}>
          <WebcamCanvas dimensions={{ width: window.innerWidth, height: window.innerHeight }} ref={{ webcamRef, canvasRef }} videoDeviceId={selectedCamera} key={forceRemountKey} onUserMediaLoaded={handleUserMediaLoaded} />
          {showOverlay && <OverlayBox text={repCount} />}
        </Box>

        {/* Video Playback (Shown if a video is uploaded) */}
        <Box sx={{ border: `6px solid ${color || "white"}`, borderRadius: "8px", overflow: "hidden", padding: "5px", display: useVideo ? "" : "none", boxShadow: `0px 0px 65px 0px ${color}` }}>
          <VideoCanvas handlePlay={handlePlay} ref={{ videoRef, canvasRef: videoCanvasRef }} />
          {showOverlay && <OverlayBox text={repCount} />}
        </Box>

        {/* Feedback Panel with Upload Button Inside */}
        {enhancedFeedbackPanel}
      </Box>
    </Box>
  );
}

export default ExerciseBox;