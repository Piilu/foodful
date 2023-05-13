// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBrzhdcuY1UgKuY8CDAh7TN_BW4RdB0SuQ",
    authDomain: "foodful.firebaseapp.com",
    projectId: "foodful",
    storageBucket: "foodful.appspot.com",
    messagingSenderId: "168923710979",
    appId: "1:168923710979:web:cc7bc67430b56f0f1bb036"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);