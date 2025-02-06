import React, { useEffect, useState } from "react";
import { checkMuscleUp } from "../../utils/exercises/MuscleUp";
import HelpModal from "../../components/HelpModal";
import muscleupHelpImg from "../../assets/instructions/muscleupHelp.png";
import { instructionsTextMuscleup, instructionsVideoMuscleup } from "../../assets/content";
import { resetRepCount } from "../../utils/GenFeedback";
import SettingsModal from "../../components/SettingsModal";
import FeedbackPanel from "../../components/FeedbackPanel";
import ExerciseBox from "../../components/ExerciseBox";

/**
 * A React functional component that provides a real-time squat tracking and feedback interface using
 * the Mediapipe Pose model and a webcam feed. The component displays the user's current knee angle,
 * squat count, and feedback on the squat form. It also allows the user to adjust the target knee angle
 * for better squat depth tracking.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Squat tracking page, including webcam feed, feedback,
 *                        squat count, knee angle display, and a reset button.
 */
function MuscleUpPage() {
    const [targetElbowLockOutAngle, setTargetElbowLockOutAngle] = useState(170);
    const [feedback, setFeedback] = useState("");
    const [currElbowAngle, setCurrElbowAngle] = useState(0);
    const [repCount, setRepCount] = useState(0);
    const [color, setColor] = useState("white");

    // Object containing key-value pair of target angle label(s) and corresponding value(s);
    // used to store angles into Firebase Cloud Firestore
    const [targetAngles, setTargetAngles] = useState({
        targetElbowLockOutAngle: targetElbowLockOutAngle,
    });

    // Array of arrays of useState set functions, with the key into the Promise object,
    // returned from getDoc, to retrieve the angle value to be set;
    // differs from the targetAngles state in that this is an array array of FUNCTIONS + KEYS,
    // whereas targetAngles is an Object that keeps a store of target angle VALUES;
    // both states are used to modularize usage of the store/load functions in ExerciseSettings.js
    const setTargetAnglesArray = [[setTargetElbowLockOutAngle, "targetElbowLockOutAngle"]];

    const processPoseResults = (landmarks) => {
        checkMuscleUp(landmarks, setFeedback, setColor, setCurrElbowAngle, setRepCount, targetElbowLockOutAngle);
    };

    const handleReset = () => {
        resetRepCount(0);
        setRepCount(0);
    };

    // Update the targetAngles object whenever targetKneeAngle and/or targetHipAngle changes
    useEffect(() => {
        setTargetAngles({ targetElbowLockOutAngle: targetElbowLockOutAngle });
    }, [targetElbowLockOutAngle]);

    const feedbackPanel = (
        <FeedbackPanel
            feedbackList={[feedback]}
            valuesList={[
                { label: "Elbow Angle", value: currElbowAngle },
            ]}
            repCount={repCount}
            handleReset={handleReset}
            HelpModal={
                <HelpModal image={muscleupHelpImg} description={instructionsTextMuscleup} video={instructionsVideoMuscleup} />
            }
            SettingsModal={
                <SettingsModal exerciseName="muscleup" targetAngles={targetAngles} setTargetAnglesArray={setTargetAnglesArray} />
            }
        />
    )

    return (
        <ExerciseBox
            title="Muscle-Up"
            feedbackPanel={feedbackPanel}
            processPoseResults={processPoseResults}
            targetAngles={targetAngles}
            color={color}
            repCount={repCount}
        />
    );
}

export default MuscleUpPage;
