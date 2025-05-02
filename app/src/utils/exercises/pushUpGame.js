import React, { useRef, useEffect, useState } from "react";
import detectPose from "../models/PoseDetector";
import createPushUpChecker from "./pushUpGameCheck";
import HelpModal from "../../components/HelpModal";
import squatHelpImg from "../../assets/instructions/squatHelp.png";
import { instructionsTextSquat } from "../../assets/content";
import SettingsModal from "../../components/SettingsModal";
import GameFeedbackPanel from "../../components/GameFeedbackPanel";
import ExerciseBox from "../../components/ExerciseBoxGame";
import { setEnableTwoPoses } from "../models/PoseDetectorTasksVision";
import { resetRepCount } from "../GenFeedback";

function PushUpGamePage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const setEnableTwoPosesState = useState(false)[1];
  const [playFeedback, setPlayFeedback] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Left state
  const [leftRepCount, setLeftRepCount] = useState(0);
  const [leftElbowAngle, setLeftElbowAngle] = useState(0);
  const [leftTargetElbowAngle, setLeftTargetElbowAngle] = useState(100);
  const [leftFeedback, setLeftFeedback] = useState("");

  // Right state
  const [rightRepCount, setRightRepCount] = useState(0);
  const [rightElbowAngle, setRightElbowAngle] = useState(0);
  const [rightTargetElbowAngle, setRightTargetElbowAngle] = useState(100);
  const [rightFeedback, setRightFeedback] = useState("");

  const leftPushUpChecker = useRef(createPushUpChecker());
  const rightPushUpChecker = useRef(createPushUpChecker());

  const handleLeftReset = () => {
    resetRepCount(0);
    setLeftRepCount(0);
    leftPushUpChecker.current = createPushUpChecker();
  };

  const handleRightReset = () => {
    resetRepCount(0);
    setRightRepCount(0);
    rightPushUpChecker.current = createPushUpChecker();
  };

  const handleResetAll = () => {
    handleLeftReset();
    handleRightReset();
  };

  const processPoseResults = (landmarks0, landmarks1) => {
    // Rightmost person (landmarks0) = right, Leftmost = left
    if (landmarks0)
      rightPushUpChecker.current(
        landmarks0,
        setRightFeedback,
        setRightElbowAngle,
        setRightRepCount,
        rightTargetElbowAngle
      );
    if (landmarks1)
      leftPushUpChecker.current(
        landmarks1,
        setLeftFeedback,
        setLeftElbowAngle,
        setLeftRepCount,
        leftTargetElbowAngle
      );
  };

  const updateTargetElbowAngle = (value) => {
    setLeftTargetElbowAngle(value);
    setRightTargetElbowAngle(value);
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
      title="Pushup Game"
      feedbackPanel={
        <GameFeedbackPanel
          leftRepCount={leftRepCount}
          rightRepCount={rightRepCount}
          handleReset={handleResetAll}
          HelpModal={<HelpModal image={squatHelpImg} description={instructionsTextSquat} />}
          SettingsModal={
            <SettingsModal
              exerciseName="pushup"
              targetAngles={{ targetElbowAngle: leftTargetElbowAngle }}
              setTargetAnglesArray={[[updateTargetElbowAngle, "targetElbowAngle"]]}
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
      ref={{ webcamRef: webcamRef, canvasRef: canvasRef }}
    />
  );
}

export default PushUpGamePage;
