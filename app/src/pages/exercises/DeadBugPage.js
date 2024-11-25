import React, { useRef, useEffect, useState } from "react";
import detectPose from "../../utils/PoseDetector";
import { checkDeadBug } from "../../utils/DeadBug";
import HelpModal from "../../components/HelpModal";
import squatHelpImg from "../../assets/squatHelp.png";
import { instructionsTextSquat } from "../../assets/content";
import WebcamCanvas from "../../components/WebcamCanvas";
import { resetRepCount } from "../../utils/GenFeedback";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";

/**
 * A React functional component that provides real-time tracking and feedback of the dead bug exercise, using
 * the Mediapipe Pose model and a webcam feed. The component displays the user's current underarm and hip angles,
 * repetition count, and feedback on the exercise form. It also allows the user to adjust the target 'flat' angle,
 * the angle the user must flatten their body towards for a legitimate repetition.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Dead Bug tracking page, including webcam feed, feedback,
 *                        repetition count, target angle display, and a reset button.
 */
function DeadBugPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [targetFlatAngle, setTargetFlatAngle] = useState(140);
  const [leftUnderarmAngle, setLeftUnderarmAngle] = useState(0);
  const [rightUnderarmAngle, setRightUnderarmAngle] = useState(0);
  const [leftHipAngle, setLeftHipAngle] = useState(0);
  const [rightHipAngle, setRightHipAngle] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [repCount, setRepCount] = useState(0);

  // Object containing key-value pair of target angle label(s) and corresponding value(s);
  // used to store angles into Firebase Cloud Firestore
  const [targetAngles, setTargetAngles] = useState({ targetFlatAngle: targetFlatAngle });

  // Array of arrays of useState set functions, with the key into the Promise object,
  // returned from getDoc, to retrieve the angle value to be set;
  // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
  // whereas targetAngles is an Object that keeps a store of target angle VALUES;
  // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
  const setTargetAnglesArray = [[setTargetFlatAngle, "targetFlatAngle"]];

  /**
   * Processes pose results from the Mediapipe model and updates state.
   *
   * @param {Array} landmarks - The array of pose landmarks.
   */
  const processPoseResults = (landmarks) => {
    checkDeadBug(
      landmarks,
      targetFlatAngle,
      setLeftUnderarmAngle,
      setRightUnderarmAngle,
      setLeftHipAngle,
      setRightHipAngle,
      setFeedback,
      setRepCount
    );
  };

  /**
   * Resets the repetition count to zero.
   */
  const handleReset = () => {
    setRepCount(0);
    resetRepCount(0);
  };

  // Update the targetAngles object whenever targetFlatAngle changes
  useEffect(() => {
    setTargetAngles({ targetFlatAngle: targetFlatAngle });
  }, [targetFlatAngle]);

  useEffect(() => {
    detectPose(webcamRef, canvasRef, processPoseResults);

    return () => { };
  }, [targetAngles]);

  const webcamCanvas = (
    <WebcamCanvas
      dimensions={dimensions}
      ref={{ webcamRef: webcamRef, canvasRef: canvasRef }}
    />
  );

  const feedbackPanel = (
    <FeedbackPanel
      feedbackList={[feedback]}
      valuesList={[
        { label: "Left Underarm Angle", value: leftUnderarmAngle },
        { label: "Right Underarm Angle", value: rightUnderarmAngle },
        { label: "Left Hip Angle", value: leftHipAngle },
        { label: "Right Hip Angle", value: rightHipAngle },
      ]}
      repCount={repCount}
      handleReset={handleReset}
      HelpModal={
        <HelpModal image={squatHelpImg} description={instructionsTextSquat} />
      }
      SettingsModal={
        <SettingsModal exerciseName="deadbug" targetAngles={targetAngles} setTargetAnglesArray={setTargetAnglesArray} />
      }
    />
  )

  return (
    <ExerciseBox title="DeadBug" webcamCanvas={webcamCanvas} feedbackPanel={feedbackPanel} />
  );
}

export default DeadBugPage;
