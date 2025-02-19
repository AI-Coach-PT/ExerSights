import React, { useEffect, useState } from "react";
import { checkChestUp, checkSquat } from "../../utils/exercises/Squat";
import HelpModal from "../../components/HelpModal";
import squatHelpImg from "../../assets/instructions/squatHelp.png";
import { instructionsTextSquat, instructionsVideoSquat } from "../../assets/content";
import { resetRepCount } from "../../utils/GenFeedback";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";

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
  const [targetKneeAngle, setTargetKneeAngle] = useState(90);
  const [feedback, setFeedback] = useState("");
  const [targetHipAngle, setTargetHipAngle] = useState(45);
  const [hipAngleFeedback, setHipAngleFeedback] = useState("");
  const [currKneeAngle, setCurrKneeAngle] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [color, setColor] = useState("white");
  const [angleView, setAngleView] = useState(true);

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
    checkSquat(landmarks, setFeedback, setColor, setCurrKneeAngle, setRepCount, targetKneeAngle);
    checkChestUp(landmarks, setHipAngleFeedback, setColor, targetHipAngle);
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

  const feedbackPanel = (
    <FeedbackPanel
      feedbackList={[feedback, hipAngleFeedback]}
      valuesList={[{ label: "Knee Angle", value: currKneeAngle }]}
      repCount={repCount}
      handleReset={handleReset}
      HelpModal={
        <HelpModal image={squatHelpImg} description={instructionsTextSquat} video={instructionsVideoSquat} />
      }
      SettingsModal={
        <SettingsModal
          exerciseName="squat"
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
      title="Squat"
      feedbackPanel={feedbackPanel}
      processPoseResults={processPoseResults}
      targetAngles={targetAngles}
      color={color}
      repCount={repCount}
    />
  );
}

export default SquatPage;
