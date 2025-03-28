
import { getApp, getApps, initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDbc1ZzDoS4Fbs55yWZvGqrJ1sIQg3R_ps",
  authDomain: "e-com-cbd19.firebaseapp.com",
  projectId: "e-com-cbd19",
  storageBucket: "e-com-cbd19.firebasestorage.app",
  messagingSenderId: "545797472905",
  appId: "1:545797472905:web:9d834105d82a88c8c47c58",
  measurementId: "G-EP6TCMK78H"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)


export {app,auth}