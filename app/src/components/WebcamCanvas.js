import React, { forwardRef } from "react";
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

    const { width, height } = props.dimensions;
    // Standard 16:9 aspect ratio for video
    // const aspectRatio = 16 / 9;

    // // Calculate 70% of browser dimensions
    // const browserWidth = props.dimensions.width * 0.7;
    // const browserHeight = props.dimensions.height * 0.7;
    // let newWidth, newHeight;

    // // Calculate responsive dimensions while maintaining aspect ratio
    // if (browserWidth / browserHeight > aspectRatio) {
    //     newHeight = browserHeight;
    //     newWidth = newHeight * aspectRatio;
    // } else {
    //     newWidth = browserWidth;
    //     newHeight = newWidth / aspectRatio;
    // }

    /**
     * Video constraints for webcam
     * @type {Object}
     */
    const videoContraints = {
        // width: newWidth,
        // height: newHeight,
        //aspectRatio: aspectRatio,
        facingMode: "user", // or 'environment' for rear camera on mobile
    };
    return (
        <Box
            sx={{
                // Dynamically calculate 70% sizes at each breakpoint
                width: {
                    xs: Math.min(width, 320) * 0.7, // Small screens
                    sm: Math.min(width, 640) * 0.7,
                    md: Math.min(width, 1280) * 0.7,
                    lg: Math.min(width, 1366) * 0.7,
                    xl: Math.min(width, 1920) * 0.7,
                },
                height: {
                    xs: Math.min(height, 240) * 0.7,
                    sm: Math.min(height, 480) * 0.7,
                    md: Math.min(height, 720) * 0.7,
                    lg: Math.min(height, 768) * 0.7,
                    xl: Math.min(height, 1080) * 0.7,
                },
                maxWidth: "100%", // Stop box from  exceeding screen width
                maxHeight: "100%", // Stop box from  exceeding screen height
            }}
        >
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
                // canvas drawing size
                width={width * 0.7}
                height={height * 0.7}
                style={{
                    // canvas display size
                    // width: `${newWidth}px`,
                    // height: `${newHeight}px`,
                    width: "100%",
                    height: "100%",
                }}
            />
        </Box>
    );
});

export default WebcamCanvas;
