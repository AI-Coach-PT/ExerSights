import React, { forwardRef } from 'react';
import Webcam from 'react-webcam';

/**
 * WebcamBox is a React functional component that wraps the `react-webcam` component. 
 * It hides the webcam feed by default but still allows access to the video stream through the ref.
 *
 * The webcam video stream uses the front-facing camera by default.
 *
 * @component
 * @param {object} props Properties passed to the component.
 * @param {React.Ref} ref Forwarded reference of the `Webcam` component. 
 * @returns {JSX.Element} Hidden JSX div wrapping the `Webcam` component.
 */
const WebcamBox = forwardRef((props, ref) => {
    return (
        <div style={{ visibility: 'hidden', position: 'absolute' }}>
            <Webcam
                ref={ref}
                className="hidden-webcam"
                videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                }}
            />
        </div>
    );
});

export default WebcamBox;
