import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HelpModal from "../../components/HelpModal";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";
import { resetRepCount } from "../../utils/GenFeedback";

function ExercisePage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const exerciseName = queryParams.get("exercise");

    const [exerciseData, setExerciseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [feedback, setFeedback] = useState("");
    const [repCount, setRepCount] = useState(0);
    const [color, setColor] = useState("white");
    const [angleView, setAngleView] = useState(true);
    const [targetAngles, setTargetAngles] = useState({});
    const [jointAngles, setJointAngles] = useState({});

    useEffect(() => {
        if (!exerciseName) {
            setError(true);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(false);

        import("./ExercisePageData")
            .then((module) => {
                if (module[exerciseName]) {
                    const data = module[exerciseName];
                    setExerciseData(data);

                    const initialTargets = Object.keys(data.fsm.targets).reduce((acc, key) => {
                        if (key.includes("target"))
                            acc[key] = data.fsm.targets[key];
                        return acc;
                    }, {});
                    setTargetAngles(initialTargets);

                    const initialJointAngles = Object.keys(data.fsm.jointInfo.jointAngles).reduce((acc, key) => {
                        acc[key] = 0;
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

    const setAngleFunctions = Object.keys(jointAngles).reduce((acc, key) => {
        acc[key] = (value) => setJointAngles((prev) => ({ ...prev, [key]: value }));
        return acc;
    }, {});

    const setTargetAnglesArray = Object.keys(targetAngles).map((key) => [
        (val) => setTargetAngles((prev) => ({ ...prev, [key]: val })),
        key,
    ]);

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