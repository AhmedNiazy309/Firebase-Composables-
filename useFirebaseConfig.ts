export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirestoreConfig {
  collectionPrefix?: string;
  subCollectionPrefix?: string;
}

export interface RealtimeConfig {
  databaseURL: string;
  pathPrefix?: string;
}

export interface MessagingConfig {
  vapidKey?: string;
  defaultNotificationOptions?: {
    title?: string;
    icon?: string;
    badge?: string;
    sound?: string;
  };
}

export const useFirebaseConfig = () => {
  // Default configuration - يمكن تغييرها حسب المشروع
  const defaultConfig: FirebaseConfig = {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef123456',
    measurementId: 'G-XXXXXXXXXX'
  };

  // Default Firestore configuration
  const defaultFirestoreConfig: FirestoreConfig = {
    collectionPrefix: '',
    subCollectionPrefix: ''
  };

  // Default Realtime Database configuration
  const defaultRealtimeConfig: RealtimeConfig = {
    databaseURL: 'https://your-project-id.firebaseio.com',
    pathPrefix: ''
  };

  // Default Messaging configuration
  const defaultMessagingConfig: MessagingConfig = {
    vapidKey: 'YOUR_VAPID_KEY',
    defaultNotificationOptions: {
      title: 'إشعار جديد',
      icon: '/icon.png',
      badge: '/badge.png',
      sound: '/notification.mp3'
    }
  };

  return {
    defaultConfig,
    defaultFirestoreConfig,
    defaultRealtimeConfig,
    defaultMessagingConfig
  };
}; 