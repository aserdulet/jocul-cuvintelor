import { initializeApp } from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBjFQ863UL7Ynv9g6qVBibWF8akvJci4mw",
    authDomain: "jocul-cuvintelor.firebaseapp.com",
    projectId: "jocul-cuvintelor",
    storageBucket: "jocul-cuvintelor.appspot.com",
    messagingSenderId: "92859322355",
    appId: "1:92859322355:web:3fb8ae0c738ad9ddfccc86",
    measurementId: "G-70SWPL41CG"
};

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const auth = getAuth(app)

export {db, auth}