import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyA4HGZWfkrrNZwr8KL8lWk4jiQKknlAzNs",
    authDomain: "vestrade-71fbe.firebaseapp.com",
    projectId: "vestrade-71fbe",
    storageBucket: "vestrade-71fbe.firebasestorage.app",
    messagingSenderId: "670872567578",
    appId: "1:670872567578:web:015254a2696c89f6aa36a3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app; 