// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-23cab.firebaseapp.com",
  projectId: "mern-estate-23cab",
  storageBucket: "mern-estate-23cab.firebasestorage.app",
  messagingSenderId: "390110381217",
  appId: "1:390110381217:web:1697f0604ab2e9a210dce0"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);