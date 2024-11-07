// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhx7hz2Qu_AVRi5cPL5hcItcPeh9oS304",
  authDomain: "un-badminton.firebaseapp.com",
  projectId: "un-badminton",
  storageBucket: "un-badminton.appspot.com",
  messagingSenderId: "860804883335",
  appId: "1:860804883335:web:37543a9cb98e94e1002922",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
