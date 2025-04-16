// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAW1dr1Zupn4BeMrjzCO8ghmKiA1a3a-k",
  authDomain: "oneprojeck-4d330.firebaseapp.com",
  projectId: "oneprojeck-4d330",
  storageBucket: "oneprojeck-4d330.appspot.com",
  messagingSenderId: "576336237274",
  appId: "1:576336237274:web:80f862d2f22ab7b1d48be3",
  measurementId: "G-KZ1YTGT3S1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

