import { auth, provider } from "../../firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Handles user login using Firebase Google Single Sign-On.
 * Opens a pop-up for Google SSO and authenticates the user.
 *
 * @async
 * @function handleLogin
 * @returns {Promise<void>} Resolves once user is authenticated or logs an error if login fails.
 * @throws Logs an error message in the console if login fails.
 */
export const handleLogin = async () => {
  try {
    await signInWithPopup(auth, provider);
    console.log("User logged in successfully!");
  } catch (error) {
    console.error("Login Error: ", error);
  }
};

/**
 * Logs out user using Firebase Google SSO authentication.
 *
 * @function handleLogout
 * @returns {void} Resolves and logs success or failure message in the console the logout attempt.
 * @throws Logs error message in the console if logout fails.
 */
export const handleLogout = () => {
  signOut(auth)
    .then(() => {
      console.log("User logged out successfully!");
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
};
