import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Modal,
} from "@mui/material";
import WebcamCanvas from "./WebcamCanvas";
import VideoCanvas from "./VideoCanvas";
import startPoseDetection from "../utils/models/PoseDetectorPoseVideo";
import detectPose from "../utils/models/PoseDetector";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function ExerciseBoxGame({
  title,
  feedbackPanel,
  processPoseResults,
  color,
  repCount,
  drawSkeleton,
  playFeedback,
  setPlayFeedback,
  showSummary,
  setShowSummary,
  handleReset,
  auth,
  isAuth,
}) {
  const [useVideo, setUseVideo] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(
    localStorage.getItem("selectedCamera") || ""
  );
  const [forceRemountKey, setForceRemountKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stream, setStream] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(Date.now());

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);

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
        videoElement.pause();
      };
      setUseVideo(true);
    }
  };

  const handleUploadPlay = () => {
    const videoElement = videoRef.current;
    startPoseDetection(videoElement, videoCanvasRef, processPoseResults);
  };

  const saveExerciseSummary = async (userEmail, exerciseSummary) => {
    try {
      const userRef = doc(db, "users", userEmail);
      await setDoc(userRef, { exerciseHistory: exerciseSummary }, { merge: true });
    } catch (e) {
      console.log("Error saving to Firestore:", e);
    }
  };

  const handleSummaryCloseWithSave = () => {
    setShowSummary(false);
    handleReset();

    if (isAuth) {
      const summary = {
        [Date.now().toString()]: {
          exercise: title,
          repCount,
          duration: (endTime - startTime) / 1000,
        },
      };
      saveExerciseSummary(auth.currentUser.email, summary);
    }
  };

  const enhancedFeedbackPanel = React.cloneElement(feedbackPanel, {
    handleVideoUpload,
  });

  useEffect(() => {
    detectPose(webcamRef, canvasRef, processPoseResults, drawSkeleton);
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setAvailableCameras(cameras);
      if (cameras.length > 0) {
        const stored = localStorage.getItem("selectedCamera");
        const valid = cameras.some((cam) => cam.deviceId === stored)
          ? stored
          : cameras[0].deviceId;
        setSelectedCamera(valid);
        localStorage.setItem("selectedCamera", valid);
      }
    });
  }, [drawSkeleton]);

  useEffect(() => {
    setLoading(!stream);
  }, [stream]);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((d) => d.kind === "videoinput");
        setAvailableCameras(cameras);
        if (cameras.length > 0) {
          const stored = localStorage.getItem("selectedCamera");
          const valid = cameras.some((cam) => cam.deviceId === stored)
            ? stored
            : cameras[0].deviceId;
          setSelectedCamera(valid);
          localStorage.setItem("selectedCamera", valid);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
    const interval = setInterval(fetchCameras, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ padding: "0.5rem" }}>
      <Modal open={showSummary} onClose={handleSummaryCloseWithSave}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "35rem",
            maxWidth: "90%",
            bgcolor: "background.paper",
            borderRadius: 6,
            boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
            p: "2rem",
            textAlign: "center",
          }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Exercise Summary
          </Typography>
          <Typography>Exercise: {title}</Typography>
          <Typography>Reps: {repCount}</Typography>
          <Typography>Duration: {(endTime - startTime) / 1000} sec</Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            {repCount ? "Great job!" : "Try again!"}
          </Typography>
          {isAuth ? (
            <>
              <Typography sx={{ mt: 2 }}>
                Save this summary to your exercise history?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
                <Button variant="contained" onClick={handleSummaryCloseWithSave}>
                  YES
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                  NO
                </Button>
              </Box>
            </>
          ) : (
            <Button variant="contained" onClick={handleReset} sx={{ mt: 2 }}>
              Take me back
            </Button>
          )}
        </Box>
      </Modal>

      <Typography variant="h2" sx={{ textAlign: "center", my: 2 }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <FormControl sx={{ minWidth: 180 }}>
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}>
        {/* Video/Webcam */}
        <Box
          sx={{
            border: `6px solid ${color || "white"}`,
            borderRadius: "1rem",
            overflow: "hidden",
            position: "relative",
            boxShadow: `0px 0px 65px 0px ${color}`,
            width: "100%",
            maxWidth: "900px",
            "@media (orientation: landscape)": {
              width: "auto",
              maxWidth: "100vh",
            },
          }}>
          {useVideo ? (
            <VideoCanvas
              handleUploadPlay={handleUploadPlay}
              ref={{ videoRef, canvasRef: videoCanvasRef }}
            />
          ) : (
            <WebcamCanvas
              dimensions={{ width: window.innerWidth, height: window.innerHeight }}
              ref={{ webcamRef, canvasRef }}
              videoDeviceId={selectedCamera}
              key={forceRemountKey}
              onUserMediaLoaded={handleUserMediaLoaded}
            />
          )}
        </Box>

        {/* Feedback panel below */}
        <Box sx={{ width: "100%", maxWidth: "900px" }}>{enhancedFeedbackPanel}</Box>
      </Box>
    </Box>
  );
}

export default ExerciseBoxGame;
