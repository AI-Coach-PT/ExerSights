import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const POSE_CONNECTIONS_NON_FACE = [
  [11, 12],
  [12, 14],
  [14, 16],
  [11, 13],
  [13, 15],
  [15, 17],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [24, 26],
  [25, 27],
  [26, 28],
  [27, 29],
  [28, 30],
  [29, 31],
  [30, 32],
];

let pose;

/**
 * Initializes the Mediapipe Pose model and sets up real-time pose detection using a webcam feed.
 * It draws the pose landmarks and connections (skeleton) onto a canvas and passes the pose data
 * to a callback for further processing.
 *
 * @param {Object} webcamRef A React reference object pointing to the webcam feed (Webcam component).
 * @param {Object} canvasRef A React reference object pointing to the canvas element where the pose
 *                           landmarks and skeleton will be drawn.
 * @param {Function} onResultsCallback A callback function that receives the detected pose landmarks.
 *                                     It is called every time pose landmarks are detected.
 */
const detectPose = (webcamRef, canvasRef, onResultsCallback) => {
  if (!pose) {
    pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }

  pose.onResults((results) => {
    console.log(`${performance.now()}`);
    const canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.poseLandmarks) {
      const nonFaceLandmarks = results.poseLandmarks.filter((_, index) => index > 10);

      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS_NON_FACE, {
        color: "blue",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, nonFaceLandmarks, { color: "red", radius: 2.5 });

      onResultsCallback(results.poseLandmarks);
    }

    canvasCtx.restore();
  });

  if (webcamRef.current && typeof webcamRef.current.video !== "undefined") {
    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        if (webcamRef.current && webcamRef.current.video) {
          await pose.send({ image: webcamRef.current.video });
        }
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }
};

export default detectPose;
