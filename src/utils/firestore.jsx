// import firebase from "firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCNPExiM2KE-5vrZ1-_fqn63ww4x4yeQaY",
    authDomain: "apli-web.firebaseapp.com",
    databaseURL: "https://apli-web-default-rtdb.firebaseio.com",
    projectId: "apli-web",
    storageBucket: "apli-web.appspot.com",
    messagingSenderId: "934363405104",
    appId: "1:934363405104:web:6940846cb11d06bf6486f5",
    measurementId: "G-PM4MK9FGH4"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export { db };
