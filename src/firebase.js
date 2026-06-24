import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCyoyTfy_yJWbxn_Jj8AnN6fkAES6XIDEM",
  authDomain: "ahava-bria.firebaseapp.com",
  projectId: "ahava-bria",
  storageBucket: "ahava-bria.firebasestorage.app",
  messagingSenderId: "1041857720821",
  appId: "1:1041857720821:web:2aedaafc20fa9891e070bc",
  measurementId: "G-PE7HWELJNS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
