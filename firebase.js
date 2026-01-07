// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyARQqXg3L8luRb01k-yn2chyiFWEbn_9iM",
  authDomain: "startiq-ae6af.firebaseapp.com",
  projectId: "startiq-ae6af",
  storageBucket: "startiq-ae6af.firebasestorage.app",
  messagingSenderId: "1081848840736",
  appId: "1:1081848840736:web:66b7b4c093cf41711a3245",
  measurementId: "G-FM0VL2W0Q1"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

