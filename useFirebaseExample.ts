import { useFirebaseChat } from './useFirebaseChat';
import { useFirebaseNotifications } from './useFirebaseNotifications';
import type { FirebaseConfig } from './useFirebaseConfig';

// مثال على كيفية استخدام Firebase في مشروع جديد
export const useFirebaseExample = () => {
  
  // ===== تكوين Firebase للمشروع =====
  const firebaseConfig: FirebaseConfig = {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef123456',
    measurementId: 'G-XXXXXXXXXX'
  };

  // ===== استخدام Firebase للمحادثات =====
  const chatFirebase = useFirebaseChat({
    config: firebaseConfig,
    useRealtime: false, // true للـ Realtime Database، false للـ Firestore
    collectionName: 'chats', // يمكن تغييرها حسب المشروع
    onNewMessage: (message) => {
      console.log('رسالة جديدة:', message);
      // يمكن إضافة منطق إضافي هنا مثل تشغيل صوت أو إظهار إشعار
    },
    onMessageSent: (message) => {
      console.log('تم إرسال الرسالة:', message);
    },
    onMessageError: (error) => {
      console.error('خطأ في إرسال الرسالة:', error);
    },
    onRoomCreated: (room) => {
      console.log('تم إنشاء غرفة محادثة:', room);
    },
    onAuthStateChanged: (user) => {
      console.log('تغير حالة المصادقة:', user);
    }
  });

  // ===== استخدام Firebase للإشعارات =====
  const notificationFirebase = useFirebaseNotifications({
    config: firebaseConfig,
    useRealtime: false, // true للـ Realtime Database، false للـ Firestore
    collectionName: 'notifications', // يمكن تغييرها حسب المشروع
    onNewNotification: (notification) => {
      console.log('إشعار جديد:', notification);
      // يمكن إضافة منطق إضافي هنا مثل إظهار toast أو تشغيل صوت
    },
    onNotificationRead: (notificationId) => {
      console.log('تم قراءة الإشعار:', notificationId);
    },
    onNotificationError: (error) => {
      console.error('خطأ في الإشعارات:', error);
    },
    onAuthStateChanged: (user) => {
      console.log('تغير حالة المصادقة:', user);
    },
    onMessageReceived: (payload) => {
      console.log('رسالة push جديدة:', payload);
    }
  });

  // ===== وظائف مساعدة للمحادثات =====
  const initializeChat = async () => {
    try {
      // تهيئة Firebase
      chatFirebase.initializeFirebase();
      
      // انتظار قليل للاتصال
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // الاشتراك في غرف المستخدم
      await chatFirebase.subscribeToUserRooms();
      
      console.log('تم تهيئة المحادثات بنجاح');
    } catch (error) {
      console.error('خطأ في تهيئة المحادثات:', error);
    }
  };

  const joinChatRoom = async (roomId: string) => {
    try {
      await chatFirebase.subscribeToRoom(roomId);
      console.log('تم الانضمام للغرفة بنجاح');
    } catch (error) {
      console.error('خطأ في الانضمام للغرفة:', error);
    }
  };

  const createChatRoom = async (participants: string[], name?: string) => {
    try {
      const roomId = await chatFirebase.createRoom(participants, name);
      console.log('تم إنشاء الغرفة بنجاح:', roomId);
      return roomId;
    } catch (error) {
      console.error('خطأ في إنشاء الغرفة:', error);
      throw error;
    }
  };

  const sendChatMessage = async (roomId: string, messageText: string) => {
    try {
      const messageId = await chatFirebase.sendMessageOptimistic(roomId, messageText);
      console.log('تم إرسال الرسالة بنجاح:', messageId);
      return messageId;
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      throw error;
    }
  };

  const sendChatFile = async (
    roomId: string, 
    fileName: string, 
    fileType: string, 
    fileUrl: string, 
    fileSize?: number
  ) => {
    try {
      const attachments = [{
        fileName,
        type: fileType,
        url: fileUrl,
        size: fileSize
      }];
      
      const messageId = await chatFirebase.sendMessageOptimistic(
        roomId, 
        fileName, 
        'attachment', 
        attachments
      );
      console.log('تم إرسال الملف بنجاح:', messageId);
      return messageId;
    } catch (error) {
      console.error('خطأ في إرسال الملف:', error);
      throw error;
    }
  };

  // ===== وظائف مساعدة للإشعارات =====
  const initializeNotifications = async () => {
    try {
      // تهيئة Firebase
      notificationFirebase.initializeFirebase();
      
      // انتظار قليل للاتصال
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // الاشتراك في إشعارات المستخدم
      await notificationFirebase.subscribeToUserNotifications();
      
      // تهيئة push notifications
      await notificationFirebase.initializePushNotifications();
      
      console.log('تم تهيئة الإشعارات بنجاح');
    } catch (error) {
      console.error('خطأ في تهيئة الإشعارات:', error);
    }
  };

  const createNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    userId?: string,
    data?: any
  ) => {
    try {
      const notificationId = await notificationFirebase.createNotification(
        title,
        message,
        type,
        userId,
        data
      );
      console.log('تم إنشاء الإشعار بنجاح:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('خطأ في إنشاء الإشعار:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationFirebase.markAsRead(notificationId);
      console.log('تم تمييز الإشعار كمقروء');
    } catch (error) {
      console.error('خطأ في تمييز الإشعار كمقروء:', error);
      throw error;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationFirebase.markAllAsRead();
      console.log('تم تمييز جميع الإشعارات كمقروءة');
    } catch (error) {
      console.error('خطأ في تمييز جميع الإشعارات كمقروءة:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationFirebase.deleteNotification(notificationId);
      console.log('تم حذف الإشعار بنجاح');
    } catch (error) {
      console.error('خطأ في حذف الإشعار:', error);
      throw error;
    }
  };

  // ===== وظائف المصادقة =====
  const signInAnonymously = async () => {
    try {
      const user = await chatFirebase.signInAnonymouslyUser();
      console.log('تم تسجيل الدخول كضيف:', user);
      return user;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول كضيف:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const user = await chatFirebase.signInWithEmail(email, password);
      console.log('تم تسجيل الدخول بالبريد الإلكتروني:', user);
      return user;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول بالبريد الإلكتروني:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await chatFirebase.signOutUser();
      console.log('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      throw error;
    }
  };

  // ===== وظائف التنظيف =====
  const cleanupAll = () => {
    chatFirebase.cleanupAll();
    notificationFirebase.cleanupAll();
  };

  const cleanupChat = () => {
    chatFirebase.cleanupChat();
  };

  const cleanupNotifications = () => {
    notificationFirebase.cleanupNotifications();
  };

  return {
    // ===== حالة المحادثات =====
    chatMessages: chatFirebase.messages,
    chatRooms: chatFirebase.rooms,
    chatCurrentRoom: chatFirebase.currentRoomId,
    chatConnected: chatFirebase.isAuthenticated,
    chatInitialized: chatFirebase.isInitialized,
    chatLoading: chatFirebase.authLoading,
    chatSubscribed: chatFirebase.isSubscribed,

    // ===== حالة الإشعارات =====
    notifications: notificationFirebase.notifications,
    unreadCount: notificationFirebase.unreadCount,
    notificationConnected: notificationFirebase.isAuthenticated,
    notificationInitialized: notificationFirebase.isInitialized,
    notificationLoading: notificationFirebase.authLoading,
    notificationSubscribed: notificationFirebase.isSubscribed,

    // ===== حالة المستخدم =====
    currentUser: chatFirebase.currentUser,

    // ===== وظائف المحادثات =====
    initializeChat,
    joinChatRoom,
    createChatRoom,
    sendChatMessage,
    sendChatFile,
    loadChatMessages: chatFirebase.loadMessages,
    clearChatMessages: chatFirebase.clearMessages,

    // ===== وظائف الإشعارات =====
    initializeNotifications,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    loadNotifications: notificationFirebase.loadNotifications,
    clearNotifications: notificationFirebase.clearNotifications,

    // ===== وظائف المصادقة =====
    signInAnonymously,
    signInWithEmail,
    signOut,

    // ===== وظائف التنظيف =====
    cleanupAll,
    cleanupChat,
    cleanupNotifications,

    // ===== وظائف مساعدة =====
    getUnreadNotifications: notificationFirebase.getUnreadNotifications,
    getNotificationsByType: notificationFirebase.getNotificationsByType,
    getCurrentUserId: chatFirebase.getCurrentUserId,
  };
};

// ===== مثال على الاستخدام في المكون =====
/*
<script setup>
import { useFirebaseExample } from '@/composables/useFirebaseExample';

const {
  chatMessages,
  chatRooms,
  notifications,
  unreadCount,
  currentUser,
  initializeChat,
  joinChatRoom,
  sendChatMessage,
  initializeNotifications,
  createNotification,
  markNotificationAsRead,
  signInAnonymously,
  cleanupAll
} = useFirebaseExample();

const newMessage = ref('');
const selectedRoomId = ref('');

// تهيئة Firebase
onMounted(async () => {
  // تسجيل الدخول كضيف
  await signInAnonymously();
  
  // تهيئة المحادثات والإشعارات
  await Promise.all([
    initializeChat(),
    initializeNotifications()
  ]);
});

// الانضمام لغرفة محادثة
const joinRoom = async (roomId: string) => {
  selectedRoomId.value = roomId;
  await joinChatRoom(roomId);
};

// إرسال رسالة
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedRoomId.value) return;
  
  try {
    await sendChatMessage(selectedRoomId.value, newMessage.value);
    newMessage.value = ''; // مسح الرسالة
  } catch (error) {
    console.error('خطأ في إرسال الرسالة:', error);
  }
};

// إنشاء إشعار تجريبي
const createTestNotification = async () => {
  try {
    await createNotification(
      'إشعار تجريبي',
      'هذا إشعار تجريبي من Firebase',
      'info'
    );
  } catch (error) {
    console.error('خطأ في إنشاء الإشعار:', error);
  }
};

// تنظيف عند إغلاق المكون
onUnmounted(() => {
  cleanupAll();
});
</script>
*/ 