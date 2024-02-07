// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-realestate-a3654.firebaseapp.com",
    projectId: "mern-realestate-a3654",
    storageBucket: "mern-realestate-a3654.appspot.com",
    messagingSenderId: "624536007353",
    appId: "1:624536007353:web:071727aa30ce950ee06168"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);