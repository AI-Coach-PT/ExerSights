import React, { useRef, useEffect, useState, useCallback } from "react";
import detectPose from "../../utils/PoseDetector";
import { checkPushup } from "../../utils/PushUp";
import HelpModal from "../../components/HelpModal";
import squatHelpImg from "../../assets/squatHelp.png";
import { instructionsTextSquat } from "../../assets/content";
import WebcamCanvas from "../../components/WebcamCanvas";
import { resetRepCount } from "../../utils/GenFeedback";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBoxWithDualFeedback from "../../components/ExerciseBoxWithDualFeedback";
import { setEnableTwoPoses } from "../../utils/PoseDetectorTasksVision";

function PushUpGamePage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const setEnableTwoPosesState = useState(false)[1];

  // State for the left pose
  const [leftFeedback, setLeftFeedback] = useState("");
  const [leftElbowAngle, setLeftElbowAngle] = useState(0);
  const [leftRepCount, setLeftRepCount] = useState(0);
  const [leftTargetElbowAngle, setLeftTargetElbowAngle] = useState(100);

  // State for the right pose
  const [rightFeedback, setRightFeedback] = useState("");
  const [rightElbowAngle, setRightElbowAngle] = useState(0);
  const [rightRepCount, setRightRepCount] = useState(0);
  const [rightTargetElbowAngle, setRightTargetElbowAngle] = useState(100);

  // Memoized processPoseResults to avoid triggering useEffect on every render
  const processPoseResults = (landmarks0, landmarks1) => {
      // Process both poses from the same landmarks

      checkPushup(
        landmarks0,
        setLeftFeedback,
        setLeftElbowAngle,
        setLeftRepCount,
        leftTargetElbowAngle
      );

      checkPushup(
        landmarks1,
        setRightFeedback,
        setRightElbowAngle,
        setRightRepCount,
        rightTargetElbowAngle
      );
    };


  const handleLeftReset = () => {
    resetRepCount(0);
    setLeftRepCount(0);
  };

  const handleRightReset = () => {
    resetRepCount(0);
    setRightRepCount(0);
  };

  useEffect(() => {
    setEnableTwoPoses(true); // Enable two poses when the component mounts
    setEnableTwoPosesState(true);

    // Shared pose detection for both feedback panels
    detectPose(webcamRef, canvasRef, processPoseResults);

    return () => {
      setEnableTwoPoses(false); // Disable two poses when the component unmounts
      setEnableTwoPosesState(false);
    };
  }, [leftTargetElbowAngle, rightTargetElbowAngle, processPoseResults, setEnableTwoPosesState]);

  const webcamCanvas = (
    <WebcamCanvas
      dimensions={dimensions}
      ref={{ webcamRef: webcamRef, canvasRef: canvasRef }}
    />
  );

  const leftFeedbackPanel = (
    <FeedbackPanel
      feedbackList={[leftFeedback]}
      valuesList={[{ label: "Elbow Angle", value: leftElbowAngle }]}
      repCount={leftRepCount}
      handleReset={handleLeftReset}
      HelpModal={<HelpModal image={squatHelpImg} description={instructionsTextSquat} />}
      SettingsModal={
        <SettingsModal
          exerciseName="leftPushup"
          targetAngles={{ targetElbowAngle: leftTargetElbowAngle }}
          setTargetAnglesArray={[[setLeftTargetElbowAngle, "targetElbowAngle"]]}
        />
      }
    />
  );

  const rightFeedbackPanel = (
    <FeedbackPanel
      feedbackList={[rightFeedback]}
      valuesList={[{ label: "Elbow Angle", value: rightElbowAngle }]}
      repCount={rightRepCount}
      handleReset={handleRightReset}
      HelpModal={<HelpModal image={squatHelpImg} description={instructionsTextSquat} />}
      SettingsModal={
        <SettingsModal
          exerciseName="rightPushup"
          targetAngles={{ targetElbowAngle: rightTargetElbowAngle }}
          setTargetAnglesArray={[[setRightTargetElbowAngle, "targetElbowAngle"]]}
        />
      }
    />
  );

  return (
    <ExerciseBoxWithDualFeedback
      title="Pushup Game"
      webcamCanvas={webcamCanvas}
      leftFeedbackPanel={leftFeedbackPanel}
      rightFeedbackPanel={rightFeedbackPanel}
    />
  );
}

export default PushUpGamePage;
