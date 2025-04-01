import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import poseLandmarkerTask from "../../shared/models/pose_landmarker_lite.task";

const POSE_CONNECTIONS_NON_FACE = [
  { start: 11, end: 12 },
  { start: 12, end: 14 },
  { start: 14, end: 16 },
  { start: 11, end: 13 },
  { start: 13, end: 15 },
  { start: 15, end: 17 },
  { start: 11, end: 23 },
  { start: 12, end: 24 },
  { start: 23, end: 24 },
  { start: 23, end: 25 },
  { start: 24, end: 26 },
  { start: 25, end: 27 },
  { start: 26, end: 28 },
  { start: 27, end: 29 },
  { start: 28, end: 30 },
  { start: 29, end: 31 },
  { start: 30, end: 32 },
];

let poseLandmarker;

async function createPoseLandmarker() {
  if (!poseLandmarker) {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm"
      );
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: poseLandmarkerTask,
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
    } catch (e) {
      console.error("ERROR:", e);
    }
  }
  return poseLandmarker;
}

const detectPose = async (webcamRef, canvasRef, onResultCallback, drawSkeleton) => {
  poseLandmarker = await createPoseLandmarker();
  let animationID;

  const detectAndDraw = () => {
    if (webcamRef.current && webcamRef.current.video.readyState >= 2) {
      poseLandmarker.detectForVideo(webcamRef.current.video, performance.now(), (result) => {
        console.log(`${performance.now()}`);
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.drawImage(webcamRef.current.video, 0, 0, canvas.width, canvas.height);

        if (result.landmarks[0] && drawSkeleton) {
          const nonFaceLandmarks = result.landmarks[0].filter((_, index) => index > 10);

          drawingUtils.drawLandmarks(nonFaceLandmarks, {
            color: "red",
            radius: 2.5,
          });

          drawingUtils.drawConnectors(result.landmarks[0], POSE_CONNECTIONS_NON_FACE, {
            color: "blue",
            lineWidth: 5,
          });
        }

        canvasCtx.restore();

        if (result.landmarks[0]) {
          onResultCallback(result.landmarks[0]);
        }
      });
    }
    animationID = requestAnimationFrame(detectAndDraw);
  };

  detectAndDraw();

  return poseLandmarker;
};

export default detectPose;
