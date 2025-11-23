import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  type Auth, 
  signInAnonymously, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QuerySnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import { 
  getDatabase, 
  type Database,
  ref,
  set,
  push,
  update,
  remove,
  onValue,
  off,
  type DatabaseReference
} from 'firebase/database';
import { 
  getMessaging, 
  type Messaging,
  getToken,
  onMessage,
  type MessagePayload
} from 'firebase/messaging';
import type { FirebaseConfig, FirestoreConfig, RealtimeConfig, MessagingConfig } from './useFirebaseConfig';

export interface FirebaseCoreOptions {
  config: FirebaseConfig;
  firestoreConfig?: FirestoreConfig;
  realtimeConfig?: RealtimeConfig;
  messagingConfig?: MessagingConfig;
  onAuthStateChanged?: (user: User | null) => void;
  onMessageReceived?: (payload: MessagePayload) => void;
}

export function useFirebaseCore(options: FirebaseCoreOptions) {
  const app = ref<FirebaseApp | null>(null);
  const auth = ref<Auth | null>(null);
  const firestore = ref<Firestore | null>(null);
  const database = ref<Database | null>(null);
  const messaging = ref<Messaging | null>(null);
  
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isInitialized = ref(false);
  const authLoading = ref(true);

  // Initialize Firebase
  const initializeFirebase = () => {
    if (app.value) return;

    try {
      // Initialize Firebase app
      app.value = initializeApp(options.config);
      
      // Initialize services
      auth.value = getAuth(app.value);
      firestore.value = getFirestore(app.value);
      
      if (options.realtimeConfig) {
        database.value = getDatabase(app.value);
      }
      
      if (options.messagingConfig && 'serviceWorker' in navigator) {
        messaging.value = getMessaging(app.value);
      }

      // Set up auth state listener
      if (auth.value) {
        onAuthStateChanged(auth.value, (user) => {
          currentUser.value = user;
          isAuthenticated.value = !!user;
          authLoading.value = false;
          options.onAuthStateChanged?.(user);
        });
      }

      isInitialized.value = true;
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('🚨 Firebase initialization error:', error);
      throw error;
    }
  };

  // Authentication methods
  const signInAnonymouslyUser = async () => {
    if (!auth.value) throw new Error('Firebase not initialized');
    
    try {
      const result = await signInAnonymously(auth.value);
      return result.user;
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth.value) throw new Error('Firebase not initialized');
    
    try {
      const result = await signInWithEmailAndPassword(auth.value, email, password);
      return result.user;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    if (!auth.value) throw new Error('Firebase not initialized');
    
    try {
      await signOut(auth.value);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  // Firestore methods
  const addDocument = async (collectionName: string, data: DocumentData) => {
    if (!firestore.value) throw new Error('Firestore not initialized');
    
    try {
      const docRef = await addDoc(collection(firestore.value, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef;
    } catch (error) {
      console.error('Add document error:', error);
      throw error;
    }
  };

  const updateDocument = async (collectionName: string, docId: string, data: DocumentData) => {
    if (!firestore.value) throw new Error('Firestore not initialized');
    
    try {
      const docRef = doc(firestore.value, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Update document error:', error);
      throw error;
    }
  };

  const deleteDocument = async (collectionName: string, docId: string) => {
    if (!firestore.value) throw new Error('Firestore not initialized');
    
    try {
      const docRef = doc(firestore.value, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  };

  const subscribeToCollection = (
    collectionName: string,
    callback: (snapshot: QuerySnapshot) => void,
    constraints?: {
      where?: Array<[string, any, any]>;
      orderBy?: Array<[string, 'asc' | 'desc']>;
      limit?: number;
    }
  ): Unsubscribe => {
    if (!firestore.value) throw new Error('Firestore not initialized');
    
    try {
      let q = query(collection(firestore.value, collectionName));
      
      if (constraints?.where) {
        constraints.where.forEach(([field, operator, value]) => {
          q = query(q, where(field, operator, value));
        });
      }
      
      if (constraints?.orderBy) {
        constraints.orderBy.forEach(([field, direction]) => {
          q = query(q, orderBy(field, direction));
        });
      }
      
      if (constraints?.limit) {
        q = query(q, limit(constraints.limit));
      }
      
      return onSnapshot(q, callback);
    } catch (error) {
      console.error('Subscribe to collection error:', error);
      throw error;
    }
  };

  // Realtime Database methods
  const setRealtimeData = async (path: string, data: any) => {
    if (!database.value) throw new Error('Realtime Database not initialized');
    
    try {
      const dbRef = ref(database.value, path);
      await set(dbRef, {
        ...data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Set realtime data error:', error);
      throw error;
    }
  };

  const pushRealtimeData = async (path: string, data: any) => {
    if (!database.value) throw new Error('Realtime Database not initialized');
    
    try {
      const dbRef = ref(database.value, path);
      const newRef = push(dbRef);
      await set(newRef, {
        ...data,
        timestamp: Date.now()
      });
      return newRef.key;
    } catch (error) {
      console.error('Push realtime data error:', error);
      throw error;
    }
  };

  const updateRealtimeData = async (path: string, data: any) => {
    if (!database.value) throw new Error('Realtime Database not initialized');
    
    try {
      const dbRef = ref(database.value, path);
      await update(dbRef, {
        ...data,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Update realtime data error:', error);
      throw error;
    }
  };

  const removeRealtimeData = async (path: string) => {
    if (!database.value) throw new Error('Realtime Database not initialized');
    
    try {
      const dbRef = ref(database.value, path);
      await remove(dbRef);
    } catch (error) {
      console.error('Remove realtime data error:', error);
      throw error;
    }
  };

  const subscribeToRealtimeData = (
    path: string,
    callback: (data: any) => void
  ): (() => void) => {
    if (!database.value) throw new Error('Realtime Database not initialized');
    
    try {
      const dbRef = ref(database.value, path);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
      });
      
      return () => off(dbRef);
    } catch (error) {
      console.error('Subscribe to realtime data error:', error);
      throw error;
    }
  };

  // Messaging methods
  const requestNotificationPermission = async () => {
    if (!messaging.value) throw new Error('Messaging not initialized');
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return await getToken(messaging.value, {
          vapidKey: options.messagingConfig?.vapidKey
        });
      }
      throw new Error('Notification permission denied');
    } catch (error) {
      console.error('Request notification permission error:', error);
      throw error;
    }
  };

  const subscribeToMessages = (callback: (payload: MessagePayload) => void) => {
    if (!messaging.value) throw new Error('Messaging not initialized');
    
    try {
      return onMessage(messaging.value, (payload) => {
        callback(payload);
        options.onMessageReceived?.(payload);
      });
    } catch (error) {
      console.error('Subscribe to messages error:', error);
      throw error;
    }
  };

  // Cleanup
  const cleanup = () => {
    // Cleanup will be handled by Firebase automatically
    // when the app is destroyed
    console.log('Firebase cleanup completed');
  };

  return {
    // State
    app: readonly(app),
    auth: readonly(auth),
    firestore: readonly(firestore),
    database: readonly(database),
    messaging: readonly(messaging),
    currentUser: readonly(currentUser),
    isAuthenticated: readonly(isAuthenticated),
    isInitialized: readonly(isInitialized),
    authLoading: readonly(authLoading),
    
    // Actions
    initializeFirebase,
    signInAnonymouslyUser,
    signInWithEmail,
    signOutUser,
    addDocument,
    updateDocument,
    deleteDocument,
    subscribeToCollection,
    setRealtimeData,
    pushRealtimeData,
    updateRealtimeData,
    removeRealtimeData,
    subscribeToRealtimeData,
    requestNotificationPermission,
    subscribeToMessages,
    cleanup,
  };
} 