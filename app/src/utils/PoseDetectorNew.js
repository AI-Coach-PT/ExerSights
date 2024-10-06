import { useEffect, useState, useRef } from "react";
import {
    FilesetResolver,
    PoseLandmarker,
    DrawingUtils,
} from "@mediapipe/tasks-vision";
import poseLandmarkerTask from "../shared/models/pose_landmarker_full.task";
import Webcam from "react-webcam";

const PoseDetector = (props) => {
    const webcamRef = props.webcamRef;
    const canvasRef = props.canvasRef;
    // const processPoseResults = props.processPoseResults;

    const videoConstraints = {
        facingMode: "user",
    };

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
                detectPose();
            } catch (e) {
                console.error("ERROR:", e);
            }
        };

        const detectPose = () => {
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
                        // props.processPoseResults(result.landmarks);
                        canvasCtx.restore();
                    }
                );
            }
            requestAnimationFrame(detectPose);
        };

        createPoseLandmarker();

        return () => {
            if (poseLandmarker) {
                poseLandmarker.close();
            }
        };
    }, []);

    return (
        <div className="App" style={{ position: "relative" }}>
            <Webcam
                ref={webcamRef}
                audio={false}
                width={640}
                height={480}
                videoConstraints={videoConstraints}
                style={{ top: 0, left: 0 }}
            />
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{
                    top: 0,
                    left: 0,
                    zIndex: 1,
                }}
            />
        </div>
    );
};

export default PoseDetector;
