// Firebase yapılandırma dosyası
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLDqzEYnBd6_2pqMKzDqNzXCG9xXJaLHQ",
  authDomain: "kimrapor.firebaseapp.com",
  databaseURL: "https://kimrapor-default-rtdb.firebaseio.com",
  projectId: "kimrapor",
  storageBucket: "kimrapor.firebasestorage.app",
  messagingSenderId: "457066848242",
  appId: "1:457066848242:web:72f711ffd6c7ba5e3d156b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auth helper fonksiyonları
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { data: { user: userCredential.user }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // User metadata'sını Firestore'da sakla
    if (metadata && user) {
      await setDoc(doc(db, 'users', user.uid), {
        name: metadata.name || email,
        email: email,
        role: metadata.role || 'staff',
        department: metadata.department || 'Genel',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return { data: { user }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message } };
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve({ data: { user }, error: null });
    });
  });
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    const session = user ? { user } : null;
    callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', session);
  });
  
  return {
    data: { subscription: { unsubscribe } },
    error: null
  };
};

// Database helper fonksiyonları
export const getPlatformData = async () => {
  try {
    const q = query(collection(db, 'platform_data'), orderBy('enteredAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const addPlatformData = async (platformData: any) => {
  try {
    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, 'platform_data'), {
      platform: platformData.platform,
      metrics_followers: platformData.metrics.followers,
      metrics_engagement: platformData.metrics.engagement,
      metrics_reach: platformData.metrics.reach,
      metrics_impressions: platformData.metrics.impressions,
      metrics_clicks: platformData.metrics.clicks,
      metrics_conversions: platformData.metrics.conversions,
      month: platformData.month,
      year: platformData.year,
      entered_by: platformData.enteredBy,
      user_id: user?.uid || null,
      enteredAt: new Date()
    });
    return { data: { id: docRef.id }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const getWebsiteData = async () => {
  try {
    const q = query(collection(db, 'website_data'), orderBy('enteredAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const addWebsiteData = async (websiteData: any) => {
  try {
    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, 'website_data'), {
      visitors: websiteData.visitors,
      page_views: websiteData.pageViews,
      bounce_rate: websiteData.bounceRate,
      avg_session_duration: websiteData.avgSessionDuration,
      conversions: websiteData.conversions,
      top_pages: websiteData.topPages,
      month: websiteData.month,
      year: websiteData.year,
      entered_by: websiteData.enteredBy,
      user_id: user?.uid || null,
      enteredAt: new Date()
    });
    return { data: { id: docRef.id }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const getNewsData = async () => {
  try {
    const q = query(collection(db, 'news_data'), orderBy('enteredAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const addNewsData = async (newsData: any) => {
  try {
    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, 'news_data'), {
      mentions: newsData.mentions,
      sentiment: newsData.sentiment,
      reach: newsData.reach,
      top_sources: newsData.topSources,
      month: newsData.month,
      year: newsData.year,
      entered_by: newsData.enteredBy,
      user_id: user?.uid || null,
      enteredAt: new Date()
    });
    return { data: { id: docRef.id }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const getRPAData = async () => {
  try {
    const q = query(collection(db, 'rpa_data'), orderBy('enteredAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

export const addRPAData = async (rpaData: any) => {
  try {
    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, 'rpa_data'), {
      total_incoming_mails: rpaData.totalIncomingMails,
      total_distributed: rpaData.totalDistributed,
      top_redirected_unit1: rpaData.topRedirectedUnits.unit1,
      top_redirected_unit2: rpaData.topRedirectedUnits.unit2,
      top_redirected_unit3: rpaData.topRedirectedUnits.unit3,
      month: rpaData.month,
      year: rpaData.year,
      entered_by: rpaData.enteredBy,
      user_id: user?.uid || null,
      enteredAt: new Date()
    });
    return { data: { id: docRef.id }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

// Real-time subscriptions
export const subscribeToPlatformData = (callback: (payload: any) => void) => {
  const q = query(collection(db, 'platform_data'), orderBy('enteredAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      callback({
        eventType: change.type,
        new: { id: change.doc.id, ...change.doc.data() },
        old: change.type === 'modified' ? { id: change.doc.id, ...change.doc.data() } : null
      });
    });
  });
};

export const subscribeToWebsiteData = (callback: (payload: any) => void) => {
  const q = query(collection(db, 'website_data'), orderBy('enteredAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      callback({
        eventType: change.type,
        new: { id: change.doc.id, ...change.doc.data() },
        old: change.type === 'modified' ? { id: change.doc.id, ...change.doc.data() } : null
      });
    });
  });
};

export const subscribeToNewsData = (callback: (payload: any) => void) => {
  const q = query(collection(db, 'news_data'), orderBy('enteredAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      callback({
        eventType: change.type,
        new: { id: change.doc.id, ...change.doc.data() },
        old: change.type === 'modified' ? { id: change.doc.id, ...change.doc.data() } : null
      });
    });
  });
};

export const subscribeToRPAData = (callback: (payload: any) => void) => {
  const q = query(collection(db, 'rpa_data'), orderBy('enteredAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      callback({
        eventType: change.type,
        new: { id: change.doc.id, ...change.doc.data() },
        old: change.type === 'modified' ? { id: change.doc.id, ...change.doc.data() } : null
      });
    });
  });
}; 