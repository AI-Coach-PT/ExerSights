import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import poseLandmarkerTask from "../shared/models/pose_landmarker_lite.task";


let poseLandmarker;
let enableTwoPoses = false;


export function setEnableTwoPoses(enable) {
  enableTwoPoses = enable;
  if (poseLandmarker) {
    // Dispose of the existing PoseLandmarker
    poseLandmarker.close();
    poseLandmarker = null; // Clear the reference
  }
  createPoseLandmarker(); // Create a new instance
}

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
        numPoses: enableTwoPoses ? 2 : 1,
      });
      // detectPose();
    } catch (e) {
      console.error("ERROR:", e);
    }
  }
  return poseLandmarker;
}

// const detectPose = async (webcamRef, canvasRef, onResultCallback, stopDetection) => {
const detectPose = async (webcamRef, canvasRef, onResultCallback) => {
  poseLandmarker = await createPoseLandmarker();
  let animationID;

  // const createPoseLandmarker = async () => {
  //   try {
  //     const vision = await FilesetResolver.forVisionTasks(
  //       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  //     );
  //     poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
  //       baseOptions: {
  //         modelAssetPath: poseLandmarkerTask,
  //       },
  //       runningMode: "VIDEO",
  //       numPoses: 1,
  //     });
  //     detectPose();
  //   } catch (e) {
  //     console.error("ERROR:", e);
  //   }
  // };

  const detectAndDraw = () => {

    // console.log(`stopDetection in detectAndDraw = ${stopDetection.current}`);
    if (webcamRef.current && webcamRef.current.video.readyState >= 2) {
      poseLandmarker.detectForVideo(webcamRef.current.video, performance.now(), (result) => {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);
        let sortedLandmarks = result.landmarks;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.drawImage(webcamRef.current.video, 0, 0, canvas.width, canvas.height);

        if(result.landmarks.length === 2) {
          sortedLandmarks = result.landmarks.sort((a, b) => b[11].x - a[11].x); //sort based on left shoulder x-coordinate
        }

        for (let i = 0; i < sortedLandmarks.length; i++) {
          const pose = sortedLandmarks[i];
          if (i === 0) {
            // First pose: red dots and blue lines
            drawingUtils.drawLandmarks(pose, {
              color: "red",
              radius: 2.5,
            });
            drawingUtils.drawConnectors(pose, PoseLandmarker.POSE_CONNECTIONS, {
              color: "blue",
              lineWidth: 5,
            });
          } else if (i === 1) {
            // Second pose: purple dots and orange lines
            drawingUtils.drawLandmarks(pose, {
              color: "purple",
              radius: 2.5,
            });
            drawingUtils.drawConnectors(pose, PoseLandmarker.POSE_CONNECTIONS, {
              color: "orange",
              lineWidth: 5,
            });
          } 
        }

        
        canvasCtx.restore();
        
        if (!enableTwoPoses && result.landmarks[0]) {
          onResultCallback(result.landmarks[0]);
        } else if(result.landmarks[0] && result.landmarks[1]) {
          onResultCallback(result.landmarks[0], result.landmarks[1]);
        }
      });
    }
    // if (!stopDetection.current) {
    // console.log("continuing animation!");
    animationID = requestAnimationFrame(detectAndDraw);
    // }
  };

  // createPoseLandmarker();
  detectAndDraw();

  return poseLandmarker;
};



export default detectPose;
