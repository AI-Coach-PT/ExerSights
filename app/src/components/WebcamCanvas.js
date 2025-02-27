import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

/**
 * WebcamCanvas component provides a webcam interface with responsive dimensions
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.dimensions - Browser dimensions
 * @param {number} props.dimensions.width - Browser window width
 * @param {number} props.dimensions.height - Browser window height
 * @param {React.Ref} ref - Forwarded ref for accessing webcam methods
 * @param {Function} [props.onCameraReady] - Callback when camera is ready
 *
 * @example
 * <WebcamCanvas
 *   dimensions={{ width: window.innerWidth, height: window.innerHeight }}
 *   ref={webcamRef}
 *   onCameraReady={(video) => {  Handle pose modal initialization  }}
 *  />
 */
const WebcamCanvas = React.forwardRef((props, ref) => {
  const { videoDeviceId, dimensions, onCameraReady } = props;
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 360 });
  const [loading, setLoading] = useState(true);
  const webcamStreamRef = useRef(null);
  const videoElementRef = useRef(null);
  const metadataLoaded = useRef(false);

  useEffect(() => {
    console.log("Loading state:", loading);
  }, [loading]);

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
      videoElement.addEventListener("loadedmetadata", () => {
        if (!metadataLoaded.current) {
          metadataLoaded.current = true;
          setLoading(false);
          if (onCameraReady) {
            onCameraReady(videoElement);
          }
        }
        updateCanvasSize();
      });

      timeoutId = setTimeout(() => {
        if (!metadataLoaded.current) {
          setLoading(true);
        }
      }, 3000);

      return () => {
        videoElement.removeEventListener("loadedmetadata", updateCanvasSize);
        clearTimeout(timeoutId);
      };
    }
  }, [ref, dimensions.width, dimensions.height, onCameraReady]);

  const videoConstraints = {
    deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
    facingMode: "user",
  };

  useEffect(() => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
  }, [videoDeviceId]);

  const handleUserMedia = (stream) => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    webcamStreamRef.current = stream;

    if (ref?.webcamRef?.current?.video) {
      videoElementRef.current = ref.webcamRef.current.video;
      if (onCameraReady) {
        onCameraReady(videoElementRef.current);
      }
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <div style={webcamStyle}>
        <Webcam
          key={videoDeviceId}
          ref={ref?.webcamRef}
          className="hidden-webcam"
          disablePictureInPicture
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
        />
      </div>

      {loading && (
        <Box position="absolute" display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" height="100%">
          <CircularProgress />
          <Typography variant="body1" mt={1}>Loading Webcam...</Typography>
          <Typography variant="body1" mt={1}>Taking too long? Click below to reload the page.</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Box>
      )}

      <canvas
        ref={ref?.canvasRef}
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

const webcamStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -1,
};

export default WebcamCanvas;
