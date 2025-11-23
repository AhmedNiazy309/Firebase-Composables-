import type { FirebaseCoreOptions } from './useFirebaseCore';
import { useFirebaseCore } from './useFirebaseCore';
import { useFirebaseConfig } from './useFirebaseConfig';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationOptions extends FirebaseCoreOptions {
  useRealtime?: boolean; // true for Realtime Database, false for Firestore
  collectionName?: string;
  onNewNotification?: (notification: Notification) => void;
  onNotificationRead?: (notificationId: string) => void;
  onNotificationError?: (error: any) => void;
}

export function useFirebaseNotifications(options: NotificationOptions) {
  const { defaultConfig, defaultFirestoreConfig, defaultRealtimeConfig, defaultMessagingConfig } = useFirebaseConfig();
  
  // Merge configurations
  const config = {
    ...defaultConfig,
    ...options.config,
  };

  const firestoreConfig = {
    ...defaultFirestoreConfig,
    ...options.firestoreConfig,
  };

  const realtimeConfig = {
    ...defaultRealtimeConfig,
    ...options.realtimeConfig,
  };

  const messagingConfig = {
    ...defaultMessagingConfig,
    ...options.messagingConfig,
  };

  // Use the core Firebase composable
  const {
    app,
    auth,
    firestore,
    database,
    messaging,
    currentUser,
    isAuthenticated,
    isInitialized,
    authLoading,
    initializeFirebase,
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
  } = useFirebaseCore({
    config,
    firestoreConfig,
    realtimeConfig,
    messagingConfig,
    onAuthStateChanged: options.onAuthStateChanged,
    onMessageReceived: options.onMessageReceived,
  });

  // Notification-specific state
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const isSubscribed = ref(false);
  const unsubscribeFunctions = ref<Array<() => void>>([]);

  const collectionName = options.collectionName || 'notifications';
  const useRealtime = options.useRealtime || false;

  // Get current user ID
  const getCurrentUserId = () => {
    return currentUser.value?.uid || null;
  };

  // Create notification
  const createNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    userId?: string,
    data?: any
  ): Promise<string> => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');

    const notificationData: Omit<Notification, 'id'> = {
      title,
      message,
      type,
      userId: userId || getCurrentUserId() || undefined,
      data,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (useRealtime) {
        const notificationId = await pushRealtimeData(`${collectionName}`, notificationData);
        if (notificationId) {
          return notificationId;
        }
        throw new Error('Failed to create notification');
      } else {
        const docRef = await addDocument(collectionName, notificationData);
        return docRef.id;
      }
    } catch (error) {
      console.error('Create notification error:', error);
      options.onNotificationError?.(error);
      throw error;
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');

    try {
      if (useRealtime) {
        await updateRealtimeData(`${collectionName}/${notificationId}`, {
          read: true,
          updatedAt: new Date(),
        });
      } else {
        await updateDocument(collectionName, notificationId, {
          read: true,
          updatedAt: new Date(),
        });
      }

      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        notification.updatedAt = new Date();
        unreadCount.value = Math.max(0, unreadCount.value - 1);
        options.onNotificationRead?.(notificationId);
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');

    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('User ID not found');

    try {
      const unreadNotifications = notifications.value.filter(n => !n.read && n.userId === currentUserId);
      
      for (const notification of unreadNotifications) {
        if (useRealtime) {
          await updateRealtimeData(`${collectionName}/${notification.id}`, {
            read: true,
            updatedAt: new Date(),
          });
        } else {
          await updateDocument(collectionName, notification.id, {
            read: true,
            updatedAt: new Date(),
          });
        }
      }

      // Update local state
      notifications.value.forEach(notification => {
        if (!notification.read && notification.userId === currentUserId) {
          notification.read = true;
          notification.updatedAt = new Date();
        }
      });
      unreadCount.value = 0;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');

    try {
      if (useRealtime) {
        await removeRealtimeData(`${collectionName}/${notificationId}`);
      } else {
        await deleteDocument(collectionName, notificationId);
      }

      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
      
      const index = notifications.value.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        notifications.value.splice(index, 1);
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  };

  // Subscribe to user notifications
  const subscribeToUserNotifications = async () => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');

    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('User ID not found');

    try {
      if (useRealtime) {
        const unsubscribe = subscribeToRealtimeData(
          `${collectionName}`,
          (data) => {
            if (data) {
              const notificationsArray = Object.entries(data)
                .filter(([_, notificationData]: [string, any]) => 
                  notificationData.userId === currentUserId
                )
                .map(([id, notificationData]: [string, any]) => ({
                  id,
                  ...notificationData,
                  createdAt: new Date(notificationData.createdAt),
                  updatedAt: new Date(notificationData.updatedAt),
                })) as Notification[];
              
              // Sort by creation time (newest first)
              notificationsArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
              
              notifications.value = notificationsArray;
              updateUnreadCount();
            } else {
              notifications.value = [];
              unreadCount.value = 0;
            }
          }
        );
        
        unsubscribeFunctions.value.push(unsubscribe);
        isSubscribed.value = true;
      } else {
        const unsubscribe = subscribeToCollection(
          collectionName,
          (snapshot) => {
            const notificationsArray = snapshot.docs
              .filter(doc => {
                const data = doc.data();
                return data.userId === currentUserId;
              })
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
              })) as Notification[];
            
            // Sort by creation time (newest first)
            notificationsArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            
            notifications.value = notificationsArray;
            updateUnreadCount();
          },
          {
            where: [['userId', '==', currentUserId]],
            orderBy: [['createdAt', 'desc']]
          }
        );
        
        unsubscribeFunctions.value.push(unsubscribe);
        isSubscribed.value = true;
      }
    } catch (error) {
      console.error('Subscribe to user notifications error:', error);
      throw error;
    }
  };

  // Subscribe to general notifications
  const subscribeToGeneralNotifications = async () => {
    try {
      if (useRealtime) {
        const unsubscribe = subscribeToRealtimeData(
          `${collectionName}`,
          (data) => {
            if (data) {
              const notificationsArray = Object.entries(data)
                .filter(([_, notificationData]: [string, any]) => 
                  !notificationData.userId // General notifications don't have userId
                )
                .map(([id, notificationData]: [string, any]) => ({
                  id,
                  ...notificationData,
                  createdAt: new Date(notificationData.createdAt),
                  updatedAt: new Date(notificationData.updatedAt),
                })) as Notification[];
              
              // Sort by creation time (newest first)
              notificationsArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
              
              notifications.value = notificationsArray;
              updateUnreadCount();
            } else {
              notifications.value = [];
              unreadCount.value = 0;
            }
          }
        );
        
        unsubscribeFunctions.value.push(unsubscribe);
        isSubscribed.value = true;
      } else {
        const unsubscribe = subscribeToCollection(
          collectionName,
          (snapshot) => {
            const notificationsArray = snapshot.docs
              .filter(doc => {
                const data = doc.data();
                return !data.userId; // General notifications don't have userId
              })
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
              })) as Notification[];
            
            // Sort by creation time (newest first)
            notificationsArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            
            notifications.value = notificationsArray;
            updateUnreadCount();
          },
          {
            where: [['userId', '==', null]],
            orderBy: [['createdAt', 'desc']]
          }
        );
        
        unsubscribeFunctions.value.push(unsubscribe);
        isSubscribed.value = true;
      }
    } catch (error) {
      console.error('Subscribe to general notifications error:', error);
      throw error;
    }
  };

  // Update unread count
  const updateUnreadCount = () => {
    unreadCount.value = notifications.value.filter(n => !n.read).length;
  };

  // Get notifications by type
  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.value.filter(n => n.type === type);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return notifications.value.filter(n => !n.read);
  };

  // Load notifications
  const loadNotifications = (newNotifications: Notification[]) => {
    notifications.value = [...newNotifications];
    updateUnreadCount();
  };

  // Add notification manually
  const addNotification = (notification: Notification) => {
    const notificationExists = notifications.value.some(n => n.id === notification.id);
    if (!notificationExists) {
      notifications.value.unshift(notification);
      if (!notification.read) {
        unreadCount.value++;
      }
      options.onNewNotification?.(notification);
    }
  };

  // Clear all notifications
  const clearNotifications = () => {
    notifications.value = [];
    unreadCount.value = 0;
  };

  // Initialize push notifications
  const initializePushNotifications = async () => {
    if (!messaging.value) {
      console.warn('Messaging not available');
      return;
    }

    try {
      const token = await requestNotificationPermission();
      console.log('Push notification token:', token);
      return token;
    } catch (error) {
      console.error('Initialize push notifications error:', error);
      throw error;
    }
  };

  // Subscribe to push messages
  const subscribeToPushMessages = (callback: (payload: any) => void) => {
    if (!messaging.value) {
      console.warn('Messaging not available');
      return;
    }

    try {
      return subscribeToMessages(callback);
    } catch (error) {
      console.error('Subscribe to push messages error:', error);
      throw error;
    }
  };

  // Cleanup notifications
  const cleanupNotifications = () => {
    // Unsubscribe from all listeners
    unsubscribeFunctions.value.forEach(unsubscribe => unsubscribe());
    unsubscribeFunctions.value = [];
    
    isSubscribed.value = false;
    clearNotifications();
  };

  // Cleanup all
  const cleanupAll = () => {
    cleanupNotifications();
    cleanup();
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
    notifications: readonly(notifications),
    unreadCount: readonly(unreadCount),
    isSubscribed: readonly(isSubscribed),
    
    // Actions
    initializeFirebase,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    subscribeToUserNotifications,
    subscribeToGeneralNotifications,
    loadNotifications,
    addNotification,
    clearNotifications,
    initializePushNotifications,
    subscribeToPushMessages,
    cleanupNotifications,
    cleanupAll,
    
    // Utilities
    getCurrentUserId,
    getNotificationsByType,
    getUnreadNotifications,
    updateUnreadCount,
  };
} 