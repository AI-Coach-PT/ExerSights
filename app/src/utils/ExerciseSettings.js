import { doc, setDoc } from "firebase/firestore";
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
        let data = {};
        data["exerciseSettings"] = {};
        data["exerciseSettings"][`${exercise}`] = {};
        Object.entries(targetAngles).forEach(([key, value]) => {
            data["exerciseSettings"][`${exercise}`][key] = value;
        });
        await setDoc(doc(db, "users", username), data, { merge: true }).then((res) => {
            console.log(`Document successfully written to users/${username}!`);
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// const [todos, setTodos] = useState([]);

// const fetchPost = async () => {
//     await getDocs(collection(db, "todos")).then((querySnapshot) => {
//         const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//         setTodos(newData);
//         console.log(todos, newData);
//     });
// };

// useEffect(() => {
//     fetchPost();
// }, []);
