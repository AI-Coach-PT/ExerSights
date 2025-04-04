import React, { forwardRef } from "react";

const VideoCanvas = forwardRef((props, ref) => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <video
        ref={ref.videoRef}
        style={{
          maxWidth: "100%",
          maxHeight: "75vh",
          display: "block",
        }}
        controls
        onPlay={props.handleUploadPlay}
      />
      <canvas
        ref={ref.canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none", // Allow pointer events to pass through the canvas
        }}
      />
    </div>
  );
});

export default VideoCanvas;
