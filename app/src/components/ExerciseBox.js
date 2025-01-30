import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import WebcamCanvas from "./WebcamCanvas";
import VideoCanvas from "./VideoCanvas";
import startPoseDetection from "../utils/models/PoseDetectorPoseVideo";
import detectPose from "../utils/models/PoseDetector";

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
function ExerciseBox({ title, feedbackPanel, processPoseResults, targetAngles }) {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [dimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const videoRef = useRef(null);
    const videoCanvasRef = useRef(null);
    const [useVideo, setUseVideo] = useState(false);

    useEffect(() => {
        detectPose(webcamRef, canvasRef, processPoseResults);

        return () => { };
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
                <Box sx={{ display: useVideo ? "none" : "" }}>
                    <WebcamCanvas
                        dimensions={dimensions}
                        ref={{ webcamRef: webcamRef, canvasRef: canvasRef }}
                    />
                </Box>
                <Box sx={{ display: useVideo ? "" : "none" }}>
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
