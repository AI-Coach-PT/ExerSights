import React, { forwardRef } from "react";
import Webcam from "react-webcam";

const WebcamCanvas = forwardRef((props) => {
    const aspectRatio = 16 / 9;
    const browserWidth = props.dimensions.width * 0.9;
    const browserHeight = props.dimensions.height * 0.9;
    let newWidth, newHeight;
    if (browserWidth / browserHeight > aspectRatio) {
        newHeight = browserHeight;
        newWidth = newHeight * aspectRatio;
    } else {
        newWidth = browserWidth;
        newHeight = newWidth / aspectRatio;
    }

    const videoContraints = {
        width: newWidth, // Scale to 90% of browser width
        height: newHeight, // Scale to 90% of browser height
        aspectRatio: { aspectRatio },
        facingMode: "user", // or 'environment' for rear camera on mobile
    };
    return (
        <>
            <div style={{ display: "none" }}>
                <Webcam
                    ref={props.webcamRef}
                    className="hidden-webcam"
                    disablePictureInPicture="true"
                    videoConstraints={videoContraints}
                />
            </div>
            <canvas
                ref={props.canvasRef}
                width={newWidth} // Scale to 90% of browser width
                height={newHeight} // Scale to 90% of browser height
                style={{ border: "1px solid black" }}
            />
        </>
    );
});

export default WebcamCanvas;
