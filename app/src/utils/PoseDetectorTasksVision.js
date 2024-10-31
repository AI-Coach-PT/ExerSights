import {
    FilesetResolver,
    PoseLandmarker,
    DrawingUtils,
} from "@mediapipe/tasks-vision";
import poseLandmarkerTask from "../shared/models/pose_landmarker_full.task";

const detectPose = (webcamRef, canvasRef, onResultCallback) => {
    console.log('new')
    let poseLandmarker;
    let animationId;

    const createPoseLandmarker = async () => {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            poseLandmarker = await PoseLandmarker.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath: poseLandmarkerTask,
                    },
                    runningMode: "VIDEO",
                    numPoses: 1,
                }
            );
            detectPose();
        } catch (e) {
            console.error("ERROR:", e);
        }
    };

    const detectPose = () => {
        if (webcamRef.current && webcamRef.current.video.readyState >= 2) {
            poseLandmarker.detectForVideo(
                webcamRef.current.video,
                performance.now(),
                (result) => {
                    const canvas = canvasRef.current;
                    const canvasCtx = canvas.getContext("2d");
                    const drawingUtils = new DrawingUtils(canvasCtx);

                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                    canvasCtx.drawImage(
                        webcamRef.current.video,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    for (const landmark of result.landmarks) {
                        drawingUtils.drawLandmarks(landmark, {
                            color: "red",
                            radius: 2.5,
                        });
                        drawingUtils.drawConnectors(
                            landmark,
                            PoseLandmarker.POSE_CONNECTIONS,
                            { color: "blue", lineWidth: 5 }
                        );
                    }
                    canvasCtx.restore();
                    if (result.landmarks[0]) {
                        onResultCallback(result.landmarks[0]);
                    }
                }
            );
        }
        animationId = requestAnimationFrame(detectPose);
    };

    createPoseLandmarker();

    return () => {
        if (poseLandmarker) poseLandmarker.close();
        if (animationId) cancelAnimationFrame(animationId);
    };
};

export default detectPose;