import React, { useRef, useEffect, useState } from "react";
import detectPose from "../models/PoseDetector";
import createPushUpChecker from "./pushUpGameCheck";
import HelpModal from "../../components/HelpModal";
import squatHelpImg from "../../assets/instructions/squatHelp.png";
import { instructionsTextSquat } from "../../assets/content";
import WebcamCanvas from "../../components/WebcamCanvas";
import { resetRepCount } from "../GenFeedback";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";
import { setEnableTwoPoses } from "../models/PoseDetectorTasksVision";
import { Box } from "@mui/material";

function PushUpGamePage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const setEnableTwoPosesState = useState(false)[1];

  // Shared state
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [angleView, setAngleView] = useState(true);
  const [playFeedback, setPlayFeedback] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const toggleAudio = () => setAudioEnabled((prev) => !prev);
  const toggleAngleView = () => setAngleView((prev) => !prev);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Shared video uploaded:", file.name);
      // Extend logic as needed
    }
  };

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

  // Create independent push-up checkers
  const leftPushUpChecker = useRef(createPushUpChecker());
  const rightPushUpChecker = useRef(createPushUpChecker());

  const processPoseResults = (landmarks0, landmarks1) => {
    leftPushUpChecker.current(
      landmarks0,
      setLeftFeedback,
      setLeftElbowAngle,
      setLeftRepCount,
      leftTargetElbowAngle
    );

    rightPushUpChecker.current(
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
    leftPushUpChecker.current = createPushUpChecker(); // Reset logic
  };

  const handleRightReset = () => {
    resetRepCount(0);
    setRightRepCount(0);
    rightPushUpChecker.current = createPushUpChecker(); // Reset logic
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
      handleVideoUpload={handleVideoUpload}
      angleView={angleView}
      color="primary"
      audioEnabled={audioEnabled}
      toggleAudio={toggleAudio}
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
      handleVideoUpload={handleVideoUpload}
      angleView={angleView}
      color="secondary"
      audioEnabled={audioEnabled}
      toggleAudio={toggleAudio}
    />
  );

  return (
    <ExerciseBox
      title="Pushup Game"
      feedbackPanel={
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
          {leftFeedbackPanel}
          {rightFeedbackPanel}
        </Box>
      }
      processPoseResults={processPoseResults}
      color="transparent"
      repCount={leftRepCount + rightRepCount}
      drawSkeleton={true}
      playFeedback={playFeedback}
      setPlayFeedback={setPlayFeedback}
      showSummary={showSummary}
      setShowSummary={setShowSummary}
      handleReset={() => {
        handleLeftReset();
        handleRightReset();
      }}
    />
  );
}

export default PushUpGamePage;
