import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzF6vDdHH_r_zt6LYNFtfWeAoc-JHvubo",
  authDomain: "sowalnk.firebaseapp.com",
  projectId: "sowalnk",
  storageBucket: "sowalnk.firebasestorage.app",
  messagingSenderId: "313768933517",
  appId: "1:313768933517:web:e9ba0efef7525db2c48ac4",
  measurementId: "G-J6S8JXPBJC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
