import { useEffect, useState, useRef } from "react";
import {
    FilesetResolver,
    PoseLandmarker,
    DrawingUtils,
} from "@mediapipe/tasks-vision";
import poseLandmarkerTask from "../shared/models/pose_landmarker_full.task";

const useDetectPose = (webcamRef, canvasRef, onResultsCallback) => {
    useEffect(() => {
        let poseLandmarker;

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
                detectAndDrawPose();
            } catch (e) {
                console.error("ERROR:", e);
            }
        };

        const detectAndDrawPose = () => {
            if (webcamRef.current && webcamRef.current.video.readyState >= 2) {
                console.log("HERE2");
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
                                color: "black",
                                radius: 5,
                            });
                            drawingUtils.drawConnectors(
                                landmark,
                                PoseLandmarker.POSE_CONNECTIONS,
                                { color: "black" }
                            );
                        }
                        onResultsCallback(result.landmarks);
                        canvasCtx.restore();
                    }
                );
            }
            requestAnimationFrame(useDetectPose);
        };

        createPoseLandmarker();

        return () => {
            if (poseLandmarker) {
                poseLandmarker.close();
            }
        };
    }, []);
};

export default useDetectPose;
