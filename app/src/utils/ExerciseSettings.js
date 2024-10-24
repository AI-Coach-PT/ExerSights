import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Stores exercise settings for a user in the Firestore database.
 *
 * This function updates the user's exercise settings in the Firestore database by
 * merging the provided target angles into the existing document. If the document
 * does not exist, it will be created.
 *
 * @async
 * @function storeExerciseSettings
 * @param {string} username - The username of the user whose settings are being saved.
 * @param {string} exercise - The name of the exercise for which settings are being saved.
 * @param {Object} targetAngles - An object containing key-value pairs of target angles for the exercise.
 * @returns {Promise<void>} A promise that resolves when the document is successfully written.
 * @throws Will log an error message to the console if there is an error writing to Firestore.
 */
export const storeExerciseSettings = (username, exercise, targetAngles) => {
    try {
        // set up data to be written to document
        let data = {};
        Object.entries(targetAngles).forEach(([key, value]) => {
            data[key] = value;
        });
        // overwrite existing document with new data
        setDoc(doc(db, "users", username, "exerciseSettings", exercise), data, {
            merge: false,
        }).then(() => {
            console.log(`Document successfully added to users/${username}!`);
        });
    } catch (e) {
        console.error(`Error adding document: ${e}`);
    }
};

/**
 * Loads exercise settings for a user from the Firestore database and updates the state.
 *
 * This function retrieves the exercise settings for a specific user and exercise from Firestore.
 * It then iterates over an array of setter functions and keys, updating the state with the retrieved values.
 *
 * @function loadExerciseSettings
 * @param {string} username - The username of the user whose settings are being loaded.
 * @param {string} exercise - The name of the exercise for which settings are being loaded.
 * @param {Array.<[Function, string]>} setTargetAnglesArray - An array of pairs, where each pair consists of a state setter function and a key string. The setter function is called with the value from Firestore corresponding to the key.
 * @returns {Promise<void>} A promise that resolves when the document is successfully read and state is updated.
 * @throws Will log an error message to the console if there is an error reading from Firestore.
 */
export const loadExerciseSettings = (username, exercise, setTargetAnglesArray) => {
    try {
        // const docRef = doc(db, "users", username, "exerciseSettings", exercise);
        // const docSnap = getDoc(docRef);
        // if (docSnap.exists()) {
        //     console.log(docSnap.data());
        //     let settings = docSnap.data();
        //     // iterate through array, calling the set function (index 0),
        //     // passing the value of settings, given the respective key (index 1) into it
        //     setTargetAnglesArray.forEach((pair) => {
        //         pair[0](Number(settings[pair[1]]));
        //         console.log(`pair 0 = ${pair[0]}`);
        //         console.log(`pair 1 = ${pair[1]}`);
        //         console.log(`settings at the pair[1] = ${settings[pair[1]]}`);
        //     });
        // }
        getDoc(doc(db, "users", username, "exerciseSettings", exercise)).then((docSnap) => {
            console.log(docSnap.data());
            let settings = docSnap.data();
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
