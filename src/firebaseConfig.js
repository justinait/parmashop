import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
    signInWithEmailAndPassword, 
    getAuth, 
    signOut, 
    sendPasswordResetEmail
} from "firebase/auth"
  
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import {v4} from "uuid"

const firebaseConfig = {
  apiKey: "AIzaSyBgZHEih7Vwh-QjeQc_1MfYgSMJYQkDpwU",
  authDomain: "parmashop-41ea8.firebaseapp.com",
  projectId: "parmashop-41ea8",
  storageBucket: "parmashop-41ea8.appspot.com",
  messagingSenderId: "919437739579",
  appId: "1:919437739579:web:8155926428e6caec6bfe1e",
  measurementId: "G-SL0NQ2FPTG"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const auth = getAuth(app);

export const db = getFirestore(app);

export const onSignIn = async ({email, password}) => {
    
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    return res;
  } catch (error) {
    console.log(error);
  }
    
}
  
export const onLogOut = () => {
  signOut(auth);
}
  
export const forgotPassword = async ({email}) => {
  try {
    let res = await sendPasswordResetEmail(auth, email)
    return res;
  } catch (error) {
    console.log(error);
  }
}
  
export const uploadFile = async (file) =>{
  const storageRef = ref(storage, v4() )
  await uploadBytes(storageRef, file);
  let url = await getDownloadURL(storageRef)
  return url;
}