import React, { forwardRef } from "react";
import Webcam from "react-webcam";

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
        <>
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
                style={{
                    border: "1px solid black",
                    // canvas display size
                    width: `${newWidth}px`,
                    height: `${newHeight}px`,
                }}
            />
        </>
    );
});

export default WebcamCanvas;
