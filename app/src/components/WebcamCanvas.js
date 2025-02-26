import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

/**
 * The WebcamCanvas component that displays the webcam feed and overlays a canvas for pose detection.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {string} props.videoDeviceId - The device ID of the selected webcam.
 * @param {Object} props.dimensions - The window dimensions.
 * @param {React.Ref} ref - The ref for the webcam and canvas.
 * @returns {JSX.Element} The JSX code for the WebcamCanvas.
 */
const WebcamCanvas = React.forwardRef((props, ref) => {
  const { videoDeviceId, dimensions } = props;
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 360 }); // Default 16:9 ratio
  const [loading, setLoading] = useState(false);

  // Store the webcam stream to stop it on cleanup
  const webcamStreamRef = useRef(null);

  // Update canvas size based on video metadata (video resolution)
  useEffect(() => {
    const videoElement = ref?.webcamRef?.current?.video;
    let timeoutId;

    const updateCanvasSize = () => {
      if (videoElement) {
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;

        const aspectRatio = videoWidth / videoHeight;

        const browserWidth = dimensions.width * 0.7;
        const browserHeight = dimensions.height * 0.7;

        let newWidth, newHeight;

        // Calculate the canvas size based on the aspect ratio
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
      // Update size when metadata is loaded
      videoElement.addEventListener("loadedmetadata", updateCanvasSize);

      timeoutId = setTimeout(() => {
        setLoading(true);
        clearTimeout(timeoutId);
      }, 1000);

      return () => {
        videoElement.removeEventListener("loadedmetadata", updateCanvasSize);
        clearTimeout(timeoutId);
      };
    }
  }, [ref, dimensions.width, dimensions.height]);

  // Set video constraints to select the specified camera device
  const videoContraints = {
    deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined, // Use the selected camera device
    facingMode: "user", // Front-facing camera by default
  };

  // Cleanup the previous webcam stream if any
  useEffect(() => {
    // Stop the previous webcam stream when the component is about to re-render with a new camera
    if (webcamStreamRef.current) {
      const tracks = webcamStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop()); // Stop all tracks
    }
  }, [videoDeviceId]);

  return (
    <Box sx={{ position: "relative" }}>
      <div style={webcamStyle}>
        {/* Webcam component */}
        <Webcam
          key={videoDeviceId} // Use the key prop to force re-mounting when the camera changes
          ref={ref?.webcamRef}
          className="hidden-webcam"
          disablePictureInPicture={true}
          videoConstraints={videoContraints}
          onUserMedia={(stream) => {
            // Save the webcam stream for cleanup
            webcamStreamRef.current = stream;
          }}
        />
      </div>

      {/* Loading and retry UI */}
      <Box
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%">
        <CircularProgress />
        <Typography variant="body1" mt={1}>
          Loading Webcam...
        </Typography>

        {loading && (
          <>
            <Typography variant="body1" mt={1}>
              Taking too long? Click below to reload the page.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => {
                window.location.reload();
              }}>
              Reload
            </Button>
          </>
        )}
      </Box>

      {/* Canvas overlay */}
      <canvas
        ref={ref?.canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          width: "100%",
          height: "100%",
          transform: "scaleX(-1)", // Mirror the webcam feed
          pointerEvents: "none", // Prevent interaction with the canvas
        }}
      />
    </Box>
  );
});

// Styles for the webcam container
const webcamStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -1, // Ensure the webcam feed is behind the canvas
};

export default WebcamCanvas;
