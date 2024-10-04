import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

const detectPose = (webcamRef, canvasRef) => {
    const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        canvasCtx.drawImage(
            results.image, 0, 0, canvasRef.current.width, canvasRef.current.height
        );

        if (results.poseLandmarks) {
            drawBody(canvasCtx, results.poseLandmarks);
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

const drawBody = (canvasCtx, landmarks) => {
    canvasCtx.lineWidth = 5;
    canvasCtx.strokeStyle = "blue";
    canvasCtx.fillStyle = "red";

    for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x * canvasCtx.canvas.width;
        const y = landmarks[i].y * canvasCtx.canvas.height;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
        canvasCtx.fill();
    }

    const POSE_CONNECTIONS = [
        [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
        [11, 12], [12, 14], [14, 16], [11, 13], [13, 15], [15, 17], [11, 23], [12, 24],
        [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30],
        [29, 31], [30, 32]
    ];

    for (const connection of POSE_CONNECTIONS) {
        const startIdx = connection[0];
        const endIdx = connection[1];
        const start = landmarks[startIdx];
        const end = landmarks[endIdx];
        canvasCtx.beginPath();
        canvasCtx.moveTo(start.x * canvasCtx.canvas.width, start.y * canvasCtx.canvas.height);
        canvasCtx.lineTo(end.x * canvasCtx.canvas.width, end.y * canvasCtx.canvas.height);
        canvasCtx.stroke();
    }
};

export default detectPose;