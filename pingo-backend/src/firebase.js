// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW-VDyd9Iu8_fIHKoUc6g3EicHtCLBLqU",
  authDomain: "pingo-35l.firebaseapp.com",
  projectId: "pingo-35l",
  storageBucket: "pingo-35l.appspot.com",
  messagingSenderId: "844035613728",
  appId: "1:844035613728:web:8f4d8827e014f81c69c845"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Creating instances of Firebase Auth and Database
const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp);

export { firebaseApp, auth, database };
