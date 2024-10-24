import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Saves exercise settings for a user in the Firestore database.
 *
 * This function updates the user's exercise settings in the Firestore database by
 * merging the provided target angles into the existing document. If the document
 * does not exist, it will be created.
 *
 * @async
 * @function saveExerciseSettings
 * @param {string} username - The username of the user whose settings are being saved.
 * @param {string} exercise - The name of the exercise for which settings are being saved.
 * @param {Object} targetAngles - An object containing key-value pairs of target angles for the exercise.
 * @returns {Promise<void>} A promise that resolves when the document is successfully written.
 * @throws Will log an error message to the console if there is an error writing to Firestore.
 */
export const saveExerciseSettings = async (username, exercise, targetAngles) => {
    try {
        // set up data to be written to document
        let data = {};
        Object.entries(targetAngles).forEach(([key, value]) => {
            data[key] = value;
        });
        // overwrite existing document with new data
        await setDoc(doc(db, "users", username, "exerciseSettings", exercise), data, {
            merge: false,
        }).then(() => {
            console.log(`Document successfully added to users/${username}!`);
        });
    } catch (e) {
        console.error(`Error adding document: ${e}`);
    }
};

export const loadExerciseSettings = async (username, exercise, setTargetAnglesArray) => {
    try {
        await getDoc(doc(db, "users", username, "exerciseSettings", exercise)).then((snap) => {
            console.log(snap.data());
            let settings = snap.data();
            // iterate through array, calling the set function (index 0),
            // passing the value of settings, given the respective key (index 1) into it
            setTargetAnglesArray.forEach((pair) => {
                pair[0](Number(settings[pair[1]]));
                console.log(`pair 0 = ${pair[0]}`);
                console.log(`pair 1 = ${pair[1]}`);
                console.log(`settings at the pair[1] = ${settings[pair[1]]}`);
            });
        });
    } catch (e) {
        console.error(`Error reading document: ${e}`);
    }
};
