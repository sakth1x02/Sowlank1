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

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBrrs9cru9bq3j3OPAqV_UzEtsXa9ovd_8",
//   authDomain: "movies-d7f4e.firebaseapp.com",
//   databaseURL: "https://movies-d7f4e-default-rtdb.firebaseio.com",
//   projectId: "movies-d7f4e",
//   storageBucket: "movies-d7f4e.firebasestorage.app",
//   messagingSenderId: "23450482364",
//   appId: "1:23450482364:web:6de9d074c7dd47221d02b9",
//   measurementId: "G-QGVN023ES7"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need this is by sowalnk
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBzF6vDdHH_r_zt6LYNFtfWeAoc-JHvubo",
//   authDomain: "sowalnk.firebaseapp.com",
//   projectId: "sowalnk",
//   storageBucket: "sowalnk.firebasestorage.app",
//   messagingSenderId: "313768933517",
//   appId: "1:313768933517:web:e9ba0efef7525db2c48ac4",
//   measurementId: "G-J6S8JXPBJC"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
