import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDAIFAT21Pucf_YfvQCqqsbcI7mt8dtHfw",
  authDomain: "chamados-f009c.firebaseapp.com",
  projectId: "chamados-f009c",
  storageBucket: "chamados-f009c.appspot.com",
  messagingSenderId: "782889092988",
  appId: "1:782889092988:web:09c6b4d5efcae2026486f9",
  measurementId: "G-1YY2CEX73D"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;