import React, { useRef, useEffect, useState } from "react";
import detectPose from "../../utils/PoseDetector";
import { checkChestUp, checkSquats } from "../../utils/Squat";
import HelpModal from "../../components/HelpModal";
import squatHelpImg from "../../assets/squatHelp.png";
import { instructionsTextSquat } from "../../assets/content";
import WebcamCanvas from "../../components/WebcamCanvas";
import { resetRepCount } from "../../utils/GenFeedback";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";

import startPoseDetection from "../../utils/PoseDetectorPoseVideo";
import VideoCanvas from "../../components/VideoCanvas";

/**
 * A React functional component that provides a real-time squat tracking and feedback interface using
 * the Mediapipe Pose model and a webcam feed. The component displays the user's current knee angle,
 * squat count, and feedback on the squat form. It also allows the user to adjust the target knee angle
 * for better squat depth tracking.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Squat tracking page, including webcam feed, feedback,
 *                        squat count, knee angle display, and a reset button.
 */
function SquatPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);
  const [useVideo, setUseVideo] = useState(false);

  const [dimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [targetKneeAngle, setTargetKneeAngle] = useState(90);
  const [feedback, setFeedback] = useState("");
  const [targetHipAngle, setTargetHipAngle] = useState(45);
  const [hipAngleFeedback, setHipAngleFeedback] = useState("");
  const [currKneeAngle, setCurrKneeAngle] = useState(0);
  const [repCount, setRepCount] = useState(0);

  // Object containing key-value pair of target angle label(s) and corresponding value(s);
  // used to store angles into Firebase Cloud Firestore
  const [targetAngles, setTargetAngles] = useState({
    targetKneeAngle: targetKneeAngle,
    targetHipAngle: targetHipAngle,
  });

  // Array of arrays of useState set functions, with the key into the Promise object,
  // returned from getDoc, to retrieve the angle value to be set;
  // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
  // whereas targetAngles is an Object that keeps a store of target angle VALUES;
  // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
  const setTargetAnglesArray = [
    [setTargetKneeAngle, "targetKneeAngle"],
    [setTargetHipAngle, "targetHipAngle"],
  ];

  /**
   * Processes pose results from the Mediapipe model and updates state.
   *
   * @param {Array} landmarks - The array of pose landmarks.
   */
  const processPoseResults = (landmarks) => {
    checkSquats(landmarks, setFeedback, setCurrKneeAngle, setRepCount, targetKneeAngle);
    checkChestUp(landmarks, setHipAngleFeedback, targetHipAngle);
  };

  /**
   * Resets the repetition count to zero.
   */
  const handleReset = () => {
    setRepCount(0);
    resetRepCount(0);
  };

  // Update the targetAngles object whenever targetKneeAngle and/or targetHipAngle changes
  useEffect(() => {
    setTargetAngles({ targetKneeAngle: targetKneeAngle, targetHipAngle: targetHipAngle });
  }, [targetKneeAngle, targetHipAngle]);

  useEffect(() => {
    detectPose(webcamRef, canvasRef, processPoseResults);

    return () => { };
  }, [targetAngles]);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      const videoElement = videoRef.current;

      videoElement.src = videoURL;
      videoElement.onloadeddata = () => {
        videoElement.pause(); // Pause initially until user plays it
      };
    }
  };

  const handlePlay = () => {
    const videoElement = videoRef.current;
    startPoseDetection(videoElement, videoCanvasRef, processPoseResults);
  };

  const webcamCanvas = useVideo ? (
    <VideoCanvas
      handlePlay={handlePlay}
      ref={{ videoRef: videoRef, canvasRef: videoCanvasRef }}
    />
  ) : (
    <WebcamCanvas
      dimensions={dimensions}
      ref={{ webcamRef: webcamRef, canvasRef: canvasRef }}
    />
  );

  const feedbackPanel = (
    <FeedbackPanel
      feedbackList={[feedback, hipAngleFeedback]}
      valuesList={[
        { label: "Knee Angle", value: currKneeAngle },
      ]}
      repCount={repCount}
      handleReset={handleReset}
      HelpModal={
        <HelpModal image={squatHelpImg} description={instructionsTextSquat} />
      }
      SettingsModal={
        <SettingsModal exerciseName="squat" targetAngles={targetAngles} setTargetAnglesArray={setTargetAnglesArray} />
      }
    />
  )

  return (
    <div>
      <ExerciseBox title="Squat" webcamCanvas={webcamCanvas} feedbackPanel={feedbackPanel} />
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
}

export default SquatPage;
