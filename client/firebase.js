// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-894b0.firebaseapp.com",
  projectId: "mern-estate-894b0",
  storageBucket: "mern-estate-894b0.appspot.com",
  messagingSenderId: "636157540502",
  appId: "1:636157540502:web:12b2faafafeadb36f3aab7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
