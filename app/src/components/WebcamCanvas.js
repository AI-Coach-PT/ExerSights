import React, { forwardRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Box, CircularProgress, Typography, Button } from "@mui/material"; // Import Button here

const webcamStyle =
  process.env.REACT_APP_MODEL === "tasks-vision"
    ? { visibility: "hidden", position: "absolute" }
    : { display: "none" };

const WEBCAM_TIMEOUT = 5000;

const WebcamCanvas = forwardRef((props, ref) => {
  const { selectedDeviceId, dimensions } = props;
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 360 });
  const [loading, setLoading] = useState(false);

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
  }, [ref, dimensions.width, dimensions.height]);

  return (
    <Box>
      <div style={webcamStyle}>
        <Webcam
          key={selectedDeviceId}
          ref={ref.webcamRef}
          className="hidden-webcam"
          disablePictureInPicture={true}
          videoConstraints={{ deviceId: selectedDeviceId }}
        />
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
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
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
          pointerEvents: "none",
        }}
      />
    </Box>
  );
});

export default WebcamCanvas;
