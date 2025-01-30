import React, { forwardRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Box } from "@mui/material";

// Webcam style based on environment variable
const webcamStyle =
    process.env.REACT_APP_MODEL === "tasks-vision"
        ? { visibility: "hidden", position: "absolute" }
        : { display: "none" };

/**
 * WebcamCanvas component provides a webcam interface with responsive dimensions
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.dimensions - Browser dimensions
 * @param {number} props.dimensions.width - Browser window width
 * @param {number} props.dimensions.height - Browser window height
 * @param {React.Ref} ref - Forwarded ref for accessing webcam methods
 *
 * @example
 * // Usage
 * <WebcamCanvas
 *   dimensions={{ width: window.innerWidth, height: window.innerHeight }}
 *   ref={webcamRef}
 * />
 */
const WebcamCanvas = forwardRef((props, ref) => {
    const [canvasSize, setCanvasSize] = useState({ width: 640, height: 360 }); // Default 16:9 ratio

    useEffect(() => {
        const videoElement = ref?.webcamRef?.current?.video;

        const updateCanvasSize = () => {
            if (videoElement) {
                const videoWidth = videoElement.videoWidth ; // Default width
                const videoHeight = videoElement.videoHeight ;

                const aspectRatio = videoWidth / videoHeight;

                const browserWidth = props.dimensions.width * 0.7;
                const browserHeight = props.dimensions.height * 0.7;

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
            // Update size when metadata is loaded
            videoElement.addEventListener("loadedmetadata", updateCanvasSize);

            // Cleanup listener on unmount
            return () => {
                videoElement.removeEventListener("loadedmetadata", updateCanvasSize);
            };
        }
    }, [ref, props.dimensions.width, props.dimensions.height]);

    /**
     * Video constraints for webcam
     * @type {Object}
     */
    const videoContraints = {
        facingMode: "user", // or 'environment' for rear camera on mobile
    };

    return (
        <Box>
            <div style={webcamStyle}>
                <Webcam
                    ref={ref.webcamRef}
                    className="hidden-webcam"
                    disablePictureInPicture={true}
                    videoConstraints={videoContraints}
                />
            </div>
            <canvas
                ref={ref.canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
        </Box>
    );
});

export default WebcamCanvas;
