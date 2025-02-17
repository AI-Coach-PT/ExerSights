import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HelpModal from "../../components/HelpModal";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";
import { resetRepCount } from "../../utils/GenFeedback";
import { exerciseFSMs } from "./ExercisePageData";

function ExercisePage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const exerciseName = queryParams.get("exercise");

    const exerciseData = exerciseFSMs[exerciseName];

    const { fsm, checkFunction, helpImage, instructionsText, instructionsVideo } = exerciseData;

    const [feedback, setFeedback] = useState("");
    const [repCount, setRepCount] = useState(0);
    const [color, setColor] = useState("white");
    const [angleView, setAngleView] = useState(true);

    // Extract target angles from FSM
    const initialTargets = Object.keys(fsm.targets).reduce((acc, key) => {
        if (key.includes("target"))
            acc[key] = fsm.targets[key];
        return acc;
    }, {});
    const [targetAngles, setTargetAngles] = useState(initialTargets);

    // Create states for joint angles dynamically
    const [jointAngles, setJointAngles] = useState(
        Object.keys(fsm.jointInfo.jointAngles).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {})
    );

    // Create setter functions for joint angles dynamically
    const setAngleFunctions = Object.keys(jointAngles).reduce((acc, key) => {
        acc[key] = (value) => setJointAngles((prev) => ({ ...prev, [key]: value }));
        return acc;
    }, {});

    // Store setters in an array for SettingsModal
    const setTargetAnglesArray = Object.keys(targetAngles).map((key) => [
        (val) => setTargetAngles((prev) => ({ ...prev, [key]: val })),
        key,
    ]);

    useEffect(() => {
        setTargetAngles(initialTargets);
    }, [exerciseName]);

    const processPoseResults = (landmarks) => {
        checkFunction(
            landmarks,
            setFeedback,
            setColor,
            ...Object.values(setAngleFunctions),
            setRepCount,
            ...Object.values(targetAngles)
        );
    };

    const handleReset = () => {
        setRepCount(0);
        resetRepCount(0);
    };

    if (!exerciseFSMs[exerciseName]) {
        return <div>Exercise not found!</div>;
    }

    const feedbackPanel = (
        <FeedbackPanel
            feedbackList={[feedback]}
            valuesList={Object.keys(jointAngles).map((key) => ({
                label: key.replace(/([A-Z])/g, " $1").trim().replace(/^./, (str) => str.toUpperCase()),
                value: jointAngles[key],
            }))}
            repCount={repCount}
            handleReset={handleReset}
            HelpModal={
                <HelpModal
                    image={helpImage}
                    description={instructionsText}
                    video={instructionsVideo}
                />
            }
            SettingsModal={
                <SettingsModal
                    exerciseName={exerciseName}
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
            title={exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1)}
            feedbackPanel={feedbackPanel}
            processPoseResults={processPoseResults}
            targetAngles={targetAngles}
            color={color}
            repCount={repCount}
        />
    );
}

export default ExercisePage;