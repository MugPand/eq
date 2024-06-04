// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { browserLocalPersistence, browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8kPRpu67l3RI3NInpj853rnpao9ilFEo",
  authDomain: "eq-auth.firebaseapp.com",
  projectId: "eq-auth",
  storageBucket: "eq-auth.appspot.com",
  messagingSenderId: "1065321145821",
  appId: "1:1065321145821:web:75162d8914b6be4ca60234",
  measurementId: "G-D9WMNSHMXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const firestore = getFirestore(app);

// Function to set the persistence based on "Remember Me"
const setAuthPersistence = async (rememberMe: boolean) => {
  try {
    if (rememberMe) {
      await setPersistence(auth, browserLocalPersistence);
    } else {
      await setPersistence(auth, browserSessionPersistence);
    }
  } catch (error) {
    console.error("Error setting auth persistence: ", error);
  }
};

export { auth, firestore, setAuthPersistence };