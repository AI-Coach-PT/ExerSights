import React, { useRef, useEffect, useState } from "react";
import detectPose from "../models/PoseDetector";
import createSquatChecker from "./squatGameCheck"; // updated import
import HelpModal from "../../components/HelpModal";
import squatHelpImg from "../../assets/instructions/squatHelp.png";
import { instructionsTextSquat } from "../../assets/content";
import SettingsModal from "../../components/SettingsModal";
import GameFeedbackPanel from "../../components/GameFeedbackPanel";
import ExerciseBox from "../../components/ExerciseBoxGame";
import { setEnableTwoPoses } from "../models/PoseDetectorTasksVision";

function SquatGamePage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const setEnableTwoPosesState = useState(false)[1];
  const [playFeedback, setPlayFeedback] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Left player
  const [leftRepCount, setLeftRepCount] = useState(0);
  const [leftKneeAngle, setLeftKneeAngle] = useState(0);
  const [leftTargetKneeAngle, setLeftTargetKneeAngle] = useState(90);
  const [leftFeedback, setLeftFeedback] = useState("");

  // Right player
  const [rightRepCount, setRightRepCount] = useState(0);
  const [rightKneeAngle, setRightKneeAngle] = useState(0);
  const [rightTargetKneeAngle, setRightTargetKneeAngle] = useState(90);
  const [rightFeedback, setRightFeedback] = useState("");

  const leftSquatChecker = useRef(createSquatChecker());
  const rightSquatChecker = useRef(createSquatChecker());

  const handleLeftReset = () => {
    setLeftRepCount(0);
    leftSquatChecker.current = createSquatChecker();
  };

  const handleRightReset = () => {
    setRightRepCount(0);
    rightSquatChecker.current = createSquatChecker();
  };

  const handleResetAll = () => {
    handleLeftReset();
    handleRightReset();
  };

  const processPoseResults = (landmarks0, landmarks1) => {
    // landmarks0 = rightmost = right player
    // landmarks1 = leftmost = left player
    if (landmarks0)
      rightSquatChecker.current(
        landmarks0,
        setRightFeedback,
        setRightKneeAngle,
        setRightRepCount,
        rightTargetKneeAngle
      );

    if (landmarks1)
      leftSquatChecker.current(
        landmarks1,
        setLeftFeedback,
        setLeftKneeAngle,
        setLeftRepCount,
        leftTargetKneeAngle
      );
  };

  const updateTargetKneeAngle = (val) => {
    setLeftTargetKneeAngle(val);
    setRightTargetKneeAngle(val);
  };

  useEffect(() => {
    setEnableTwoPoses(true);
    setEnableTwoPosesState(true);
    detectPose(webcamRef, canvasRef, processPoseResults);

    return () => {
      setEnableTwoPoses(false);
      setEnableTwoPosesState(false);
    };
  }, [setEnableTwoPosesState]);

  return (
    <ExerciseBox
      title="Squat Game"
      feedbackPanel={
        <GameFeedbackPanel
          leftRepCount={leftRepCount}
          rightRepCount={rightRepCount}
          handleReset={handleResetAll}
          HelpModal={<HelpModal image={squatHelpImg} description={instructionsTextSquat} />}
          SettingsModal={
            <SettingsModal
              exerciseName="squat"
              targetAngles={{ targetKneeAngle: leftTargetKneeAngle }}
              setTargetAnglesArray={[[updateTargetKneeAngle, "targetKneeAngle"]]}
            />
          }
        />
      }
      processPoseResults={processPoseResults}
      color="transparent"
      repCount={leftRepCount + rightRepCount}
      drawSkeleton={true}
      playFeedback={playFeedback}
      setPlayFeedback={setPlayFeedback}
      showSummary={showSummary}
      setShowSummary={setShowSummary}
      handleReset={handleResetAll}
      dimensions={{ width: 640, height: 480 }}
      ref={{ webcamRef, canvasRef }}
    />
  );
}

export default SquatGamePage;
