import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyrHLgNfNWVC20868b_6CzmoU83o1B0bE",
  authDomain: "photofolio-eeb5c.firebaseapp.com",
  projectId: "photofolio-eeb5c",
  storageBucket: "photofolio-eeb5c.firebasestorage.app",
  messagingSenderId: "892639328295",
  appId: "1:892639328295:web:42148ff11267a3c56fb602"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
