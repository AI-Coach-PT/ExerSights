import { Pose } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const POSE_CONNECTIONS_NON_FACE = [
    [11, 12], [12, 14], [14, 16], [11, 13], [13, 15], [15, 17], [11, 23], [12, 24],
    [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30],
    [29, 31], [30, 32]
];

let pose;

const startPoseDetection = (videoElement, canvasRef, onResultsCallback) => {
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
        if (!results.poseLandmarks) return;
        if (!canvasRef.current) return;

        const canvasElement = canvasRef.current;
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        const nonFaceLandmarks = results.poseLandmarks.filter((_, index) => index > 10);

        // Draw landmarks and connections
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS_NON_FACE, { color: "blue", lineWidth: 5 });
        drawLandmarks(canvasCtx, nonFaceLandmarks, { color: "red", lineWidth: 2.5 });

        onResultsCallback(results.poseLandmarks);
    });

    const detectPose = async () => {
        if (videoElement.paused || videoElement.ended) {
            return;
        }

        await pose.send({ image: videoElement });
        requestAnimationFrame(detectPose);
    };

    detectPose(); // Start the detection loop
};

export default startPoseDetection;