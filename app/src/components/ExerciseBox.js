import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import WebcamCanvas from "./WebcamCanvas";
import VideoCanvas from "./VideoCanvas";
import startPoseDetection from "../utils/models/PoseDetectorPoseVideo";
import detectPose from "../utils/models/PoseDetector";
import OverlayBox from "./CounterGraphic";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * A reusable layout component for exercise tracking pages.
 *
 * @component
 * @param {string} title - The title of the exercise page.
 * @param {JSX.Element} webcamCanvas - The WebcamCanvas component displaying the camera feed.
 * @param {JSX.Element} feedbackPanel - The FeedbackPanel component displaying feedback and controls.
 *
 * @returns {JSX.Element} The JSX code for the ExerciseBox layout.
 */
function ExerciseBox({
  title,
  feedbackPanel,
  processPoseResults,
  targetAngles,
  color,
  repCount,
  drawSkeleton,
}) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);
  const [useVideo, setUseVideo] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(
    localStorage.getItem("selectedCamera") || ""
  );
  const [forceRemountKey, setForceRemountKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    detectPose(webcamRef, canvasRef, processPoseResults, drawSkeleton);
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setAvailableCameras(cameras);
      if (cameras.length > 0) {
        const storedCamera = localStorage.getItem("selectedCamera");
        const validCamera = cameras.some((cam) => cam.deviceId === storedCamera)
          ? storedCamera
          : cameras[0].deviceId;
        setSelectedCamera(validCamera);
        localStorage.setItem("selectedCamera", validCamera);
      }
    });
  }, [drawSkeleton]);

  useEffect(() => {
    if (repCount > 0) {
      setShowOverlay(false);
      setTimeout(() => setShowOverlay(true), 10);
      setTimeout(() => setShowOverlay(false), 1000);
    }
  }, [repCount]);

  useEffect(() => {
    setLoading(!stream);
  }, [stream]);

  const handleCameraChange = (event) => {
    const newCamera = event.target.value;
    setLoading(true);
    setSelectedCamera(newCamera);
    localStorage.setItem("selectedCamera", newCamera);
    setForceRemountKey((prev) => prev + 1);
  };

  const handleUserMediaLoaded = (newStream) => {
    setStream(newStream);
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

  const enhancedFeedbackPanel = React.cloneElement(feedbackPanel, {
    handleVideoUpload: handleVideoUpload,
  });

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        setAvailableCameras(cameras);

        if (cameras.length > 0) {
          const storedCamera = localStorage.getItem("selectedCamera");
          const validCamera = cameras.some((cam) => cam.deviceId === storedCamera)
            ? storedCamera
            : cameras[0].deviceId;

          setSelectedCamera(validCamera);
          localStorage.setItem("selectedCamera", validCamera);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras(); // Fetch on mount

    const interval = setInterval(fetchCameras, 2000); // Refresh every 2s

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Box sx={{ padding: "0.5rem" }}>
      <Typography variant="h1" sx={{ textAlign: "center" }}>
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
        }}>
        <Box
          sx={{
            border: `6px solid ${color || "white"}`,
            borderRadius: "1rem",
            overflow: "hidden",
            m: "1.25rem",
            display: useVideo ? "none" : "",
            position: "relative",
            boxShadow: `0px 0px 65px 0px ${color}`,
          }}>
          <WebcamCanvas
            dimensions={{ width: window.innerWidth, height: window.innerHeight }}
            ref={{ webcamRef, canvasRef }}
            videoDeviceId={selectedCamera}
            key={forceRemountKey}
            onUserMediaLoaded={handleUserMediaLoaded}
          />
          {showOverlay && <OverlayBox text={repCount} />}
        </Box>

        <Box
          sx={{
            border: `6px solid ${color || "white"}`,
            borderRadius: "8px",
            overflow: "hidden",
            padding: "5px",
            display: useVideo ? "" : "none",
            boxShadow: `0px 0px 65px 0px ${color}`,
          }}>
          <VideoCanvas handlePlay={handlePlay} ref={{ videoRef, canvasRef: videoCanvasRef }} />
          {showOverlay && <OverlayBox text={repCount} />}
        </Box>

        <Box>
          {enhancedFeedbackPanel}
          <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <FormControl>
              <InputLabel>Choose Camera</InputLabel>
              <Select value={selectedCamera} onChange={handleCameraChange} label="Choose Camera">
                {availableCameras.map((camera) => (
                  <MenuItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ExerciseBox;
