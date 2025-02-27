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
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    detectPose(webcamRef, canvasRef, processPoseResults);
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId);
        localStorage.setItem("selectedCamera", cameras[0].deviceId);
      }
    });
  }, [targetAngles]);

  useEffect(() => {
    if (repCount > 0) {
      setShowOverlay(false);
      setTimeout(() => setShowOverlay(true), 10);
      setTimeout(() => setShowOverlay(false), 1000);
    }
  }, [repCount]);

  const handleCameraChange = (event) => {
    const newCamera = event.target.value;
    setLoading(true);
    setSelectedCamera(newCamera);
    localStorage.setItem("selectedCamera", newCamera);
    setForceRemountKey(prev => prev + 1);
  };

  const handleUserMediaLoaded = () => {
    setLoading(false);
  };

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
        <Box sx={{ border: `6px solid ${color || "white"}`, borderRadius: "1rem", overflow: "hidden", m: "2rem", display: useVideo ? "none" : "", position: "relative", boxShadow: `0px 0px 65px 0px ${color}` }}>
          <WebcamCanvas dimensions={{ width: window.innerWidth, height: window.innerHeight }} ref={{ webcamRef, canvasRef }} videoDeviceId={selectedCamera} key={forceRemountKey} onUserMediaLoaded={handleUserMediaLoaded} />
          {showOverlay && <OverlayBox text={repCount} />}
        </Box>
        {feedbackPanel}
      </Box>
    </Box>
  );
}

export default ExerciseBox;