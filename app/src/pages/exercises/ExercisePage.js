import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import HelpModal from "../../components/HelpModal";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";
import { resetRepCount } from "../../utils/GenFeedback";
import { loadExerciseData } from "./ExercisePageData";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

/**
 * ExercisePage component - Main page for exercise tracking functionality.
 *
 * This component coordinates the exercise experience, loading exercise data,
 * managing state for feedback, repetition counting, and visualization settings.
 * It integrates with pose detection and provides real-time feedback to users.
 *
 * @component
 * @param {string} exerciseName - Name of the exercise to load (can be provided as prop or URL parameter)
 * @returns {JSX.Element} Complete exercise tracking interface with video feed and feedback panel
 */

/**
 * State management:
 * - exerciseData: Loaded configuration for the specific exercise
 * - loading: Indicates if exercise data is being loaded
 * - error: Indicates if there was an error loading exercise data
 * - feedback: Current feedback message to display to the user
 * - repCount: Number of completed exercise repetitions
 * - color: Visual feedback color indicator
 * - jointAngles: Current angles of user's joints from pose detection
 * - angleView: Whether to display joint angle visualization
 * - targetAngles: Target joint angles for correct exercise form
 * - drawSkeleton: Whether to draw skeleton overlay on video
 * - playFeedback: Whether feedback is currently active
 * - showSummary: Whether to show exercise summary
 * - firstPlayFeedback: Tracks if feedback has been started at least once
 */
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
  const [showSummary, setShowSummary] = useState(false);
  const [firstPlayFeedback, setFirstPlayFeedback] = useState(true);

  const targetAnglesRef = useRef({});
  const playFeedbackRef = useRef(playFeedback);

  const auth = getAuth();
  const [isAuth, setIsAuth] = useState(false);

  // call this method whenever authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true); // signed in
      } else {
        setIsAuth(false); // signed out
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    targetAnglesRef.current = targetAngles;
  }, [targetAngles]);

  useEffect(() => {
    // update playFeedbackRef whenever playFeedback changes
    // playFeedback changed in ExerciseBox (user toggle)
    playFeedbackRef.current = playFeedback;

    // for the summary, do not show before the first play feedback
    if (firstPlayFeedback) setFirstPlayFeedback(false);
    setShowSummary(!playFeedback && !firstPlayFeedback);
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
    // skip processing if playFeedback is false
    if (!playFeedbackRef.current) return;

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
      showSummary={showSummary}
      setShowSummary={setShowSummary}
      handleReset={handleReset}
      auth={auth}
      isAuth={isAuth}
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
