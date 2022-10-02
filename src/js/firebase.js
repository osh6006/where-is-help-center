// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc9sS7BiLq7wZ8sNWahL1ow3-vNP6jGnA",
  authDomain: "foodtruckarea.firebaseapp.com",
  projectId: "foodtruckarea",
  storageBucket: "foodtruckarea.appspot.com",
  messagingSenderId: "689413924072",
  appId: "1:689413924072:web:950ca41c8f14942def155d",
  measurementId: "G-WTDYPKGMR0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
