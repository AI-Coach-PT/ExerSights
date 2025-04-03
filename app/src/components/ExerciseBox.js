import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import WebcamCanvas from "./WebcamCanvas";
import VideoCanvas from "./VideoCanvas";
import startPoseDetection from "../utils/models/PoseDetectorPoseVideo";
import detectPose from "../utils/models/PoseDetector";
import OverlayBox from "./CounterGraphic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { toast } from "react-hot-toast";
import { Modal } from "@mui/material";

/**
 * ExerciseBox component - A reusable layout component for exercise tracking pages.
 *
 * This component handles camera/video selection, pose detection, and exercise feedback.
 * It manages webcam streams, video uploads, and integrates with pose detection utilities.
 * Focuses on frontend.
 *
 * @component
 * @param {string} title - The title of the exercise page
 * @param {JSX.Element} feedbackPanel - Component for displaying exercise feedback and controls
 * @param {Function} processPoseResults - Function to process pose detection results
 * @param {Object} targetAngles - Target joint angles for the exercise
 * @param {string} color - Color theme for visual feedback
 * @param {number} repCount - Current repetition count
 * @param {boolean} drawSkeleton - Whether to draw skeleton overlay on video
 * @param {boolean} playFeedback - Whether feedback is currently active
 * @param {Function} setPlayFeedback - Function to toggle feedback state
 * @param {boolean} showSummary - Whether to show exercise summary
 * @param {Function} setShowSummary - Function to toggle summary display
 * @returns {JSX.Element} The exercise interface with video feed and controls
 */
function ExerciseBox({
  title,
  feedbackPanel,
  processPoseResults,
  targetAngles,
  color,
  repCount,
  drawSkeleton,
  playFeedback,
  setPlayFeedback,
  showSummary,
  setShowSummary,
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

  const handleSummaryClose = () => {
    toast("Exited Exercise Summary!");
    setShowSummary(!showSummary);
  };

  return (
    <Box sx={{ padding: "0.5rem" }}>
      <Modal open={showSummary} onClose={handleSummaryClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30rem",
            maxWidth: "90%",
            bgcolor: "background.paper",
            borderRadius: 6,
            boxShadow: "0px 0px 20px 0px rgba(255,255,255,1)",
            p: 4,
          }}>
          <Typography variant="h2" sx={{ textAlign: "center", mb: "0.5rem" }}>
            Exercise Summary
          </Typography>
        </Box>
      </Modal>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "1.5rem",
          gap: 2,
        }}>
        <Typography variant="h1" sx={{ textAlign: "center" }}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          height: "fit-content",
          gap: "2rem",
        }}>
        <Box
          sx={{
            border: `6px solid ${color || "white"}`,
            borderRadius: "1rem",
            overflow: "hidden",
            my: "1.25rem",
            display: useVideo ? "none" : "",
            position: "relative",
            boxShadow: `0px 0px 65px 0px ${color}`,
            width: "100%",
            maxWidth: "900px",
            "@media (orientation: landscape)": {
              width: "auto",
              height: "fit-content",
              maxWidth: "100vh", // Makes width equal to height in landscape
            },
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
            width: "100%",
            maxWidth: "900px",
            "@media (orientation: landscape)": {
              width: "auto",
              height: "fit-content",
              maxWidth: "100vh", // Makes width equal to height in landscape
            },
          }}>
          <VideoCanvas handlePlay={handlePlay} ref={{ videoRef, canvasRef: videoCanvasRef }} />
          {showOverlay && <OverlayBox text={repCount} />}
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              mt: "1rem",
              gap: "1rem",
              mb: "1rem",
              width: "28rem",
              maxWidth: "95vw",
            }}>
            <Button variant="contained" onClick={() => setPlayFeedback((prev) => !prev)}>
              {playFeedback ? (
                <>
                  <PauseIcon />
                  <Typography sx={{ mx: "5px" }}>Pause Feedback</Typography>
                </>
              ) : (
                <>
                  <PlayArrowIcon />
                  <Typography sx={{ mx: "5px" }}>Start Feedback</Typography>
                </>
              )}
            </Button>
            <FormControl sx={{ width: "50%" }}>
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

          {enhancedFeedbackPanel}
        </Box>
      </Box>
    </Box>
  );
}

export default ExerciseBox;
