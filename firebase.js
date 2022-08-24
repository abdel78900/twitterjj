import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDUJ6-g266BVchtBu-SUpTeu2huncQdgww",
    authDomain: "twitterjj-be5b8.firebaseapp.com",
    projectId: "twitterjj-be5b8",
    storageBucket: "twitterjj-be5b8.appspot.com",
    messagingSenderId: "774759186948",
    appId: "1:774759186948:web:a3bf77a2aafeca1c092b51"
  };

  // Initialize Firebase
//   config app propre à next 
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };