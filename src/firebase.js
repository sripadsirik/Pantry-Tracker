// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBqRgxK_pmkXxR1MNj0Lr7W40MHv1nRAYE",
    authDomain: "pantry-tracker-3.firebaseapp.com",
    projectId: "pantry-tracker-3",
    storageBucket: "pantry-tracker-3.appspot.com",
    messagingSenderId: "56018804849",
    appId: "1:56018804849:web:3bed0b8093943fc6657bd0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
