import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDzZaHtJoZrYXYp4EhffMO5pfmTW_74cho",
  authDomain: "splashpyro-115e8.firebaseapp.com",
  projectId: "splashpyro-115e8",
  storageBucket: "splashpyro-115e8.appspot.com",
  messagingSenderId: "68597559686",
  appId: "1:68597559686:web:20e6e7efeed70a66e57c07",
  measurementId: "G-08XK8QYE3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imgDB= getStorage(app)
const txtDB= getFirestore(app);
const auth = getAuth(app);

const getAccessToken = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const token = await userCredential.user.getIdToken(); 
    return token;  // Return the access token
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    throw error;  // Rethrow the error to handle in the component
  }
};

export { imgDB, txtDB, getAccessToken };


