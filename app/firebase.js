// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkSc2zASs5K6YDNvFAdC2i7mcarbyrvR8",
  authDomain: "noteapp-2a573.firebaseapp.com",
  projectId: "noteapp-2a573",
  storageBucket: "noteapp-2a573.firebasestorage.app",
  messagingSenderId: "280191210838",
  appId: "1:280191210838:web:59ef3f23df933af54c32f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
