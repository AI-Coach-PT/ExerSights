import React, { useEffect, useState } from "react";
import { checkLatExtRotation } from "../../utils/exercises/LatExtRotation";
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
function LatExtRotationPage() {
  const [targetSideAngle, setTargetSideAngle] = useState(140);
  const [feedback, setFeedback] = useState("");
  const [currSideAngle, setCurrSideAngle] = useState(90);
  const [repCount, setRepCount] = useState(0);

  // Object containing key-value pair of target angle label(s) and corresponding value(s);
  // used to store angles into Firebase Cloud Firestore
  const [targetAngles, setTargetAngles] = useState({
    targetSideAngle: targetSideAngle,
  });

  // Array of arrays of useState set functions, with the key into the Promise object,
  // returned from getDoc, to retrieve the angle value to be set;
  // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
  // whereas targetAngles is an Object that keeps a store of target angle VALUES;
  // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
  const setTargetAnglesArray = [[setTargetSideAngle, "targetSideAngle"]];

  const processPoseResults = (landmarks) => {
    checkLatExtRotation(landmarks, setFeedback, setCurrSideAngle, setRepCount, targetSideAngle);
  };

  const handleReset = () => {
    resetRepCount(0);
    setRepCount(0);
  };

  // Update the targetAngles object whenever targetKneeAngle and/or targetHipAngle changes
  useEffect(() => {
    setTargetAngles({ targetSideAngle: targetSideAngle });
  }, [targetSideAngle]);

  const feedbackPanel = (
    <FeedbackPanel
      feedbackList={[feedback]}
      valuesList={[{ label: "Side Angle", value: currSideAngle }]}
      repCount={repCount}
      handleReset={handleReset}
      HelpModal={<HelpModal image={latExtRotationHelpImg} description={instructionsTextLatExtRotation} />}
      SettingsModal={
        <SettingsModal
          exerciseName="latExtRotation"
          targetAngles={targetAngles}
          setTargetAnglesArray={setTargetAnglesArray}
        />
      }
    />
  );

  return (
    <ExerciseBox
      title="Lateral External Rotation"
      feedbackPanel={feedbackPanel}
      processPoseResults={processPoseResults}
      targetAngles={targetAngles}
    />
  );
}

export default LatExtRotationPage;
