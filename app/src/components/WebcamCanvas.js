import React, { forwardRef } from "react";
import Webcam from "react-webcam";
import { Box } from "@mui/material";

const WebcamCanvas = forwardRef((props, ref) => {
    const aspectRatio = 16 / 9;
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

    const videoContraints = {
        width: newWidth,
        height: newHeight,
        aspectRatio: aspectRatio,
        facingMode: "user", // or 'environment' for rear camera on mobile
    };
    return (
        <Box
        // sx={{
        //     width: { xs: 320, sm: 640, md: 1280, lg: 1366, xl: 1920 },
        //     height: { xs: 240, sm: 480, md: 720, lg: 768, xl: 1080 },
        // }}
        >
            <div style={{ visibility: "hidden", position: "absolute" }}>
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
                width={newWidth}
                height={newHeight}
                // width="100%"
                // height="100%"
                style={{
                    // canvas display size
                    width: `${newWidth}px`,
                    height: `${newHeight}px`,
                    // width: "100%",
                    // height: "100%",
                }}
            />
        </Box>
    );
});

export default WebcamCanvas;
