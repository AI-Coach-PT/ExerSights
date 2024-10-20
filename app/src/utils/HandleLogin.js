import { auth, provider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

export const handleLogin = async () => {
    try {
        console.log('trying login');
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('Login Error: ', error);
    }
};