import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import poseLandmarkerTask from "../../shared/models/pose_landmarker_lite.task";

const POSE_CONNECTIONS_NON_FACE = [
  { start: 11, end: 12 },
  { start: 12, end: 14 },
  { start: 14, end: 16 },
  { start: 11, end: 13 },
  { start: 13, end: 15 },
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
let enableTwoPoses = false;

export function setEnableTwoPoses(enable) {
  enableTwoPoses = enable;
  if (poseLandmarker) {
    poseLandmarker.close();
    poseLandmarker = null;
  }
  createPoseLandmarker();
}

async function createPoseLandmarker() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm"
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: poseLandmarkerTask },
      runningMode: "VIDEO",
      numPoses: enableTwoPoses ? 2 : 1,
    });
  } catch (e) {
    console.error("ERROR:", e);
  }
  return poseLandmarker;
}

const detectPose = async (webcamRef, canvasRef, onResultCallback, drawSkeleton) => {
  if (!poseLandmarker) {
    poseLandmarker = await createPoseLandmarker();
  }
  let animationID;

  const detectAndDraw = () => {
    if (webcamRef.current && webcamRef.current.video.readyState >= 2) {
      try {
        poseLandmarker.detectForVideo(webcamRef.current.video, performance.now(), (result) => {
          if (!result || !result.landmarks || result.landmarks.length === 0) return;
          
          const canvas = canvasRef.current;
          const canvasCtx = canvas.getContext("2d");
          const drawingUtils = new DrawingUtils(canvasCtx);
          let sortedLandmarks = result.landmarks;

          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          canvasCtx.drawImage(webcamRef.current.video, 0, 0, canvas.width, canvas.height);

          if (result.landmarks.length === 2) {
            sortedLandmarks = result.landmarks.sort((a, b) => {
              if (a[11] && b[11]) return a[11].x - b[11].x;
              return 0;
            });
          }

          for (let i = 0; i < sortedLandmarks.length; i++) {
            const pose = sortedLandmarks[i];
            if (pose) {
              const nonFaceLandmarks = result.landmarks[0].filter((_, index) => index > 10 && (index < 17 || index > 22));
              drawingUtils.drawLandmarks(nonFaceLandmarks, { 
                color: i === 0 ? "red" : "purple", 
                radius: 2.5 
              });
              drawingUtils.drawConnectors(pose, POSE_CONNECTIONS_NON_FACE, {
                color: i === 0 ? "blue" : "orange",
                lineWidth: 5,
              });
            }
          }

          canvasCtx.restore();
          
          if (!enableTwoPoses && result.landmarks[0]) {
            onResultCallback(result.landmarks[0]);
          } else if (enableTwoPoses && result.landmarks.length === 2) {
            onResultCallback(result.landmarks[0], result.landmarks[1]);
          }
        });
      } catch (e) {
        console.error("Pose detection error:", e);
      }
    }
    animationID = requestAnimationFrame(detectAndDraw);
    return () => cancelAnimationFrame(animationID);
  };

  detectAndDraw();
  return poseLandmarker;
};

export default detectPose;
