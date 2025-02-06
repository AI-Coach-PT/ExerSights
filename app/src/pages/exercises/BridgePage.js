import React, { useEffect, useState } from "react";
import { checkBridges } from "../../utils/exercises/Bridge";
import HelpModal from "../../components/HelpModal";
import bridgeHelpImg from "../../assets/instructions/bridgeHelp.png";
import { instructionsTextBridge, instructionsVideoBridge } from "../../assets/content";
import { resetRepCount } from "../../utils/GenFeedback";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";

/**
 * A React functional component that provides a real-time Bridge tracking and feedback interface using
 * the Mediapipe Pose model and a webcam feed. The component displays the user's current Hip angle,
 * Bridge count, and feedback on the Bridge form. It also allows the user to adjust the target Hip angle
 * for better Bridge depth tracking.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Bridge tracking page, including webcam feed, feedback,
 *                        Bridge count, Hip angle display, and a reset button.
 */
function BridgePage() {
  const [targetHipAngle, setTargetHipAngle] = useState(140);
  const [targetKneeAngle, setTargetKneeAngle] = useState(90);
  const [feedback, setFeedback] = useState("");
  const [leftHipAngle, setLeftHipAngle] = useState(0);
  const [leftKneeAngle, setLeftKneeAngle] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [color, setColor] = useState("white");
  const [angleView, setAngleView] = useState(true);

  // Object containing key-value pair of target angle label(s) and corresponding value(s);
  // used to store angles into Firebase Cloud Firestore
  const [targetAngles, setTargetAngles] = useState({
    targetHipAngle: targetHipAngle,
    targetKneeAngle: targetKneeAngle,
  });

  // Array of arrays of useState set functions, with the key into the Promise object,
  // returned from getDoc, to retrieve the angle value to be set;
  // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
  // whereas targetAngles is an Object that keeps a store of target angle VALUES;
  // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
  const setTargetAnglesArray = [
    [setTargetHipAngle, "targetHipAngle"],
    [setTargetKneeAngle, "targetKneeAngle"],
  ];

  /**
   * Processes pose results from the Mediapipe model and updates state.
   *
   * @param {Array} landmarks - The array of pose landmarks.
   */
  const processPoseResults = (landmarks) => {
    checkBridges(
      landmarks,
      setFeedback,
      setColor,
      setLeftHipAngle,
      setLeftKneeAngle,
      setRepCount,
      targetHipAngle,
      targetKneeAngle
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
    setTargetAngles({ targetHipAngle: targetHipAngle, targetKneeAngle: targetKneeAngle });
  }, [targetHipAngle, targetKneeAngle]);

  const feedbackPanel = (
    <FeedbackPanel
      feedbackList={[feedback]}
      valuesList={[
        { label: "Hip Angle", value: leftHipAngle },
        { label: "Knee Angle", value: leftKneeAngle },
      ]}
      repCount={repCount}
      handleReset={handleReset}
      HelpModal={
        <HelpModal image={bridgeHelpImg} description={instructionsTextBridge} video={instructionsVideoBridge} />
      }
      SettingsModal={
        <SettingsModal
          exerciseName="bridge"
          targetAngles={targetAngles}
          setTargetAnglesArray={setTargetAnglesArray}
          angleView={angleView}
          setAngleView={setAngleView}
        />
      }
      angleView={angleView}
    />
  );

  return (
    <ExerciseBox
      title="Bridge"
      feedbackPanel={feedbackPanel}
      processPoseResults={processPoseResults}
      targetAngles={targetAngles}
      color={color}
      repCount={repCount}
    />
  );
}

export default BridgePage;
