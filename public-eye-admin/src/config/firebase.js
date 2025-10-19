import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Same Firebase project as mobile app
const firebaseConfig = {
  apiKey: "AIzaSyAiJSU0U1vBqq-SXYh_aFbvZUeCB_mTMKc",
  authDomain: "publiceyeja.firebaseapp.com",
  projectId: "publiceyeja",
  storageBucket: "publiceyeja.firebasestorage.app",
  messagingSenderId: "1007226050423",
  appId: "1:1007226050423:web:8e03090a47a69ce3e06bd6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };