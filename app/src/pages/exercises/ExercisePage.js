import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import HelpModal from "../../components/HelpModal";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";
import { resetRepCount } from "../../utils/GenFeedback";
import { loadExerciseData } from "./ExercisePageData";

function ExercisePage({ exerciseName: propExerciseName }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryExerciseName = queryParams.get("exercise");
  const exerciseName = propExerciseName || queryExerciseName;

  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [repCount, setRepCount] = useState(0);
  const [color, setColor] = useState("white");
  const [jointAngles, setJointAngles] = useState({});
  const [angleView, setAngleView] = useState(true);
  const [targetAngles, setTargetAngles] = useState({});
  const [drawSkeleton, setDrawSkeleton] = useState(true);
  const [playFeedback, setPlayFeedback] = useState(false);

  const targetAnglesRef = useRef({});
  const playFeedbackRef = useRef(playFeedback);

  useEffect(() => {
    targetAnglesRef.current = targetAngles;
  }, [targetAngles]);

  useEffect(() => {
    playFeedbackRef.current = playFeedback;
  }, [playFeedback]);

  useEffect(() => {
    if (!exerciseName) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    loadExerciseData(exerciseName)
      .then((data) => {
        if (data) {
          setExerciseData(data);

          const initialTargets = Object.keys(data.fsm.targets).reduce((acc, key) => {
            if (key.includes("target")) acc[key] = data.fsm.targets[key];
            return acc;
          }, {});
          setTargetAngles(initialTargets);

          const angleSetters = data.fsm.angleSetters || [];
          const initialJointAngles = angleSetters.reduce((acc, param) => {
            acc[param] = 0;
            return acc;
          }, {});
          setJointAngles(initialJointAngles);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [exerciseName]);

  if (loading) {
    return <div>Loading exercise...</div>;
  }

  if (error || !exerciseData) {
    return <div>Exercise not found!</div>;
  }

  const { fsm, checkFunction, helpImage, instructionsText, instructionsVideo } = exerciseData;

  const setAngleFunctions = (fsm.angleSetters || []).reduce((acc, param) => {
    acc[param] = (value) => setJointAngles((prev) => ({ ...prev, [param]: value }));
    return acc;
  }, {});

  const setTargetAnglesArray = Object.keys(targetAngles).map((key) => [
    (val) => setTargetAngles((prev) => ({ ...prev, [key]: val })),
    key,
  ]);

  const processPoseResults = (landmarks) => {
    if (!playFeedbackRef.current)
      return;

    checkFunction(
      landmarks,
      setFeedback,
      setColor,
      ...Object.values(setAngleFunctions),
      setRepCount,
      ...Object.values(targetAnglesRef.current)
    );
  };

  const handleReset = () => {
    setRepCount(0);
    resetRepCount(0);
  };

  const feedbackPanel = (
    <FeedbackPanel
      feedbackList={[feedback]}
      valuesList={Object.keys(jointAngles).map((key) => ({
        label: formatJointName(key),
        value: jointAngles[key],
      }))}
      repCount={repCount}
      handleReset={handleReset}
      HelpModal={
        <HelpModal image={helpImage} description={instructionsText} video={instructionsVideo} />
      }
      SettingsModal={
        <SettingsModal
          exerciseName={exerciseName}
          targetAngles={targetAngles}
          setTargetAnglesArray={setTargetAnglesArray}
          angleView={angleView}
          setAngleView={setAngleView}
          drawSkeleton={drawSkeleton}
          setDrawSkeleton={setDrawSkeleton}
        />
      }
      angleView={angleView}
      color={color}
    />
  );

  return (
    <ExerciseBox
      title={fsm.title ? fsm.title : exerciseName}
      feedbackPanel={feedbackPanel}
      processPoseResults={processPoseResults}
      targetAngles={targetAngles}
      color={color}
      repCount={repCount}
      drawSkeleton={drawSkeleton}
      playFeedback={playFeedback}
      setPlayFeedback={setPlayFeedback}
    />
  );
}

export default ExercisePage;

function formatJointName(name) {
  return name
    .replace(/^set/, "")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
}
