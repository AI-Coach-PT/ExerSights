import React, { useEffect, useState } from "react";
import { checkPlank } from "../../utils/exercises/Plank";
import HelpModal from "../../components/HelpModal";
import latExtRotationHelpImg from "../../assets/instructions/latExtRotationHelp.png";
import { instructionsTextLatExtRotation } from "../../assets/content";
import { resetRepCount } from "../../utils/GenFeedback";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";

/**
 * A React functional component that provides a real-time lateral external rotation tracking and feedback interface.
 * The component utilizes pose estimation to track the user's side angle during the exercise and provides feedback
 * on form. It displays the current side angle, repetition count, and allows users to adjust the target side angle
 * for improved tracking of lateral external rotation.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Lateral External Rotation tracking page, including feedback display,
 *                        repetition count, side angle display, and a reset button.
 */
function PlankPage() {
  const [targetHipAngle, setTargetHipAngle] = useState(140);
  const [feedback, setFeedback] = useState("");
  const [currHipAngle, setCurrHipAngle] = useState(90);
  const [repCount, setRepCount] = useState(0);
  const [color, setColor] = useState("white");


  // Object containing key-value pair of target angle label(s) and corresponding value(s);
  // used to store angles into Firebase Cloud Firestore
  const [targetAngles, setTargetAngles] = useState({
    targetHipAngle: targetHipAngle,
  });

  // Array of arrays of useState set functions, with the key into the Promise object,
  // returned from getDoc, to retrieve the angle value to be set;
  // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
  // whereas targetAngles is an Object that keeps a store of target angle VALUES;
  // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
  const setTargetAnglesArray = [[setTargetHipAngle, "targetHipAngle"]];

  const processPoseResults = (landmarks) => {
    checkPlank(landmarks, setFeedback, setColor, setCurrHipAngle, setRepCount, targetHipAngle);
  };

  const handleReset = () => {
    resetRepCount(0);
    setRepCount(0);
  };

  // Update the targetAngles object whenever targetKneeAngle and/or targetHipAngle changes
  useEffect(() => {
    setTargetAngles({ targetHipAngle: targetHipAngle });
  }, [targetHipAngle]);

  const feedbackPanel = (
    <FeedbackPanel
      feedbackList={[feedback]}
      valuesList={[{ label: "Hip Angle", value: currHipAngle }]}
      repCount={repCount}
      handleReset={handleReset}
      HelpModal={<HelpModal image={latExtRotationHelpImg} description={instructionsTextLatExtRotation} />}
      SettingsModal={
        <SettingsModal
          exerciseName="plank"
          targetAngles={targetAngles}
          setTargetAnglesArray={setTargetAnglesArray}
        />
      }
    />
  );

  return (
    <ExerciseBox
      title="Plank"
      feedbackPanel={feedbackPanel}
      processPoseResults={processPoseResults}
      targetAngles={targetAngles}
      color = {color}
      repCount = {repCount}
    />
  );
}

export default PlankPage;
