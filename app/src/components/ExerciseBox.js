import React, { useState, useEffect, useRef } from "react";
import { Box, getInitColorSchemeScript, Typography } from "@mui/material";
import WebcamCanvas from "./WebcamCanvas";
import VideoCanvas from "./VideoCanvas";
import startPoseDetection from "../utils/models/PoseDetectorPoseVideo";
import detectPose from "../utils/models/PoseDetector";
import PlusOneBox from "./CounterGraphic";
import OverlayBox from "./CounterGraphic";



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
function ExerciseBox({ title, feedbackPanel, processPoseResults, targetAngles, color, repCount}) {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [dimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const webcamContainerRef = useRef(null);

    const videoRef = useRef(null);
    const videoCanvasRef = useRef(null);
    const [useVideo, setUseVideo] = useState(false);

    useEffect(() => {
        detectPose(webcamRef, canvasRef, processPoseResults);

        return () => { };
    }, [targetAngles]);

    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayKey, setOverlayKey] = useState(0);
    // Timer Trigger PlusOne hide/show whenever repCount changes
    useEffect(() => {
        if (repCount > 0) { // Ensures overlay appears only after the first rep
            setShowOverlay(false); // Reset animation
            setTimeout(() => {
                setShowOverlay(true);
                setOverlayKey(prevKey => prevKey + 1); // Change key to force re-render
            }, 10); // Brief delay to reset component
            setTimeout(() => {
                setShowOverlay(false);
            }, 1000); // Overlay disappears after 1 second
        }
    }, [repCount]);

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
        <Box>
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
                }}
            >
                <Box ref={webcamContainerRef} sx={{ border: `12px solid ${color || "white"}`, // Dynamic border color 
                borderRadius: "8px", 
                overflow: "hidden", 
                padding: "5px",  
                display: useVideo ? "none" : "" }}>
                    <WebcamCanvas
                        dimensions={dimensions}
                        ref={{ webcamRef: webcamRef, canvasRef: canvasRef }}
                    />
                    {showOverlay  && <OverlayBox text="+1" />}
                </Box>
                <Box sx={{ 
                    border: `12px solid ${color || "white"}`, // Dynamic border color 
                    borderRadius: "8px", 
                    overflow: "hidden", 
                    padding: "5px",  
                    display: useVideo ? "" : "none" }}>
                    <VideoCanvas
                        handlePlay={handlePlay}
                        ref={{ videoRef: videoRef, canvasRef: videoCanvasRef }}
                    />
                </Box>


                {enhancedFeedbackPanel}
            </Box>
        </Box>
    );
};

export default ExerciseBox;
