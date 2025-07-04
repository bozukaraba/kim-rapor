// Firebase yapılandırma dosyası
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Buraya kendi Firebase config bilgilerinizi ekleyin
const firebaseConfig = {
  apiKey: "AIzaSyDLDqzEYnBd6_2pqMKzDqNzXCG9xXJaLHQ",
  authDomain: "kimrapor.firebaseapp.com",
  projectId: "kimrapor",
  storageBucket: "kimrapor.firebasestorage.app",
  messagingSenderId: "457066848242",
  appId: "1:457066848242:web:72f711ffd6c7ba5e3d156b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 