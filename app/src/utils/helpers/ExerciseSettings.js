import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

/**
 * Stores exercise settings for a user in the Firestore database.
 *
 * This function updates the user's exercise settings in the Firestore database by
 * merging the provided target angles into the existing document. If the document
 * does not exist, it will be created.
 *
 * @async
 * @function storeExerciseSettings
 * @param {string} userEmail - The email of the user whose settings are being saved.
 * @param {string} exercise - The name of the exercise for which settings are being saved.
 * @param {Object} targetAngles - An object containing key-value pairs of target angles for the exercise.
 * @returns {Promise<void>} A promise that resolves when the document is successfully written.
 * @throws Will log an error message to the console if there is an error writing to Firestore.
 */
export const storeExerciseSettings = (userEmail, exercise, targetAngles) => {
    try {
        // Set up data to be written to document
        let data = {};
        Object.entries(targetAngles).forEach(([key, value]) => {
            data[key] = value;
        });
        // Overwrite existing document with new data
        setDoc(doc(db, "users", userEmail, "exerciseSettings", exercise), data, {
            merge: false,
        })
            .then(() => {
                console.log(`Document successfully added to users/${userEmail}!`);
            })
            .catch((e) => {
                console.log(`Error: ${e}`);
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
 * @param {string} userEmail - The email of the user whose settings are being loaded.
 * @param {string} exercise - The name of the exercise for which settings are being loaded.
 * @param {Array.<[Function, string]>} setTargetAnglesArray - An array of pairs, where each pair consists of a state setter function and a key string. The setter function is called with the value from Firestore corresponding to the key.
 * @returns {Promise<void>} A promise that resolves when the document is successfully read and state is updated.
 * @throws Will log an error message to the console if there is an error reading from Firestore.
 */
export const loadExerciseSettings = (userEmail, exercise, setTargetAnglesArray) => {
    try {
        if (userEmail === "") {
            console.log("No userEmail inputted to loadExerciseSettings().");
            return;
        }
        getDoc(doc(db, "users", userEmail, "exerciseSettings", exercise))
            .then((docSnap) => {
                console.log("Got data:");
                console.log(docSnap.data());
                let settings = docSnap.data();
                // iterate through setTargetAnglesArray, calling each set function with its corresponding value
                setTargetAnglesArray.forEach(([setFunct, key]) => {
                    setFunct(Number(settings[key]));
                });
            })
            .catch((e) => console.log(`Error: ${e}`));
    } catch (e) {
        console.error(`Error reading document: ${e}`);
    }
};
