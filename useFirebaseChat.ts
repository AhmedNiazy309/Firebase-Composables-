import type { FirebaseCoreOptions } from './useFirebaseCore';
import { useFirebaseCore } from './useFirebaseCore';
import { useFirebaseConfig } from './useFirebaseConfig';

export interface ChatMessage {
  id: string;
  body: string;
  type: 'text' | 'attachment';
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
  isTemp?: boolean;
  attachments?: Array<{
    fileName: string;
    type: string;
    url: string;
    size?: number;
  }>;
}

export interface ChatRoom {
  id: string;
  name?: string;
  participants: string[];
  lastMessage?: ChatMessage;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatOptions extends FirebaseCoreOptions {
  useRealtime?: boolean; // true for Realtime Database, false for Firestore
  collectionName?: string;
  onNewMessage?: (message: ChatMessage) => void;
  onMessageSent?: (message: ChatMessage) => void;
  onMessageError?: (error: any) => void;
  onRoomCreated?: (room: ChatRoom) => void;
}

export function useFirebaseChat(options: ChatOptions) {
  const { defaultConfig, defaultFirestoreConfig, defaultRealtimeConfig } = useFirebaseConfig();
  
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

  // Use the core Firebase composable
  const {
    app,
    auth,
    firestore,
    database,
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
    cleanup,
  } = useFirebaseCore({
    config,
    firestoreConfig,
    realtimeConfig,
    onAuthStateChanged: options.onAuthStateChanged,
  });

  // Chat-specific state
  const messages = ref<ChatMessage[]>([]);
  const rooms = ref<ChatRoom[]>([]);
  const currentRoomId = ref<string | null>(null);
  const isSubscribed = ref(false);
  const unsubscribeFunctions = ref<Array<() => void>>([]);

  const collectionName = options.collectionName || 'chats';
  const useRealtime = options.useRealtime || false;

  // Get current user ID
  const getCurrentUserId = () => {
    return currentUser.value?.uid || null;
  };

  // Create chat room
  const createRoom = async (participants: string[], name?: string): Promise<string> => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');

    const roomData: Omit<ChatRoom, 'id'> = {
      participants,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (useRealtime) {
        const roomId = await pushRealtimeData(`${collectionName}/rooms`, roomData);
        if (roomId) {
          options.onRoomCreated?.({ id: roomId, ...roomData });
          return roomId;
        }
        throw new Error('Failed to create room');
      } else {
        const docRef = await addDocument(`${collectionName}/rooms`, roomData);
        const roomId = docRef.id;
        options.onRoomCreated?.({ id: roomId, ...roomData });
        return roomId;
      }
    } catch (error) {
      console.error('Create room error:', error);
      throw error;
    }
  };

  // Send message
  const sendMessage = async (
    roomId: string,
    body: string,
    type: 'text' | 'attachment' = 'text',
    attachments?: Array<{ fileName: string; type: string; url: string; size?: number }>
  ): Promise<string> => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');
    if (!body.trim()) throw new Error('Message cannot be empty');

    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('User ID not found');

    const messageData: Omit<ChatMessage, 'id'> = {
      body: body.trim(),
      type,
      senderId: currentUserId,
      senderName: currentUser.value?.displayName || 'Unknown',
      senderAvatar: currentUser.value?.photoURL || '',
      roomId,
      createdAt: new Date(),
      updatedAt: new Date(),
      attachments,
    };

    try {
      if (useRealtime) {
        const messageId = await pushRealtimeData(`${collectionName}/rooms/${roomId}/messages`, messageData);
        if (messageId) {
          // Update room's last message
          await updateRealtimeData(`${collectionName}/rooms/${roomId}`, {
            lastMessage: { id: messageId, ...messageData },
            lastMessageAt: new Date(),
            updatedAt: new Date(),
          });
          return messageId;
        }
        throw new Error('Failed to send message');
      } else {
        const docRef = await addDocument(`${collectionName}/rooms/${roomId}/messages`, messageData);
        const messageId = docRef.id;
        
        // Update room's last message
        await updateDocument(`${collectionName}/rooms`, roomId, {
          lastMessage: { id: messageId, ...messageData },
          lastMessageAt: new Date(),
          updatedAt: new Date(),
        });
        
        return messageId;
      }
    } catch (error) {
      console.error('Send message error:', error);
      options.onMessageError?.(error);
      throw error;
    }
  };

  // Subscribe to room messages
  const subscribeToRoom = async (roomId: string) => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');

    currentRoomId.value = roomId;

    try {
      if (useRealtime) {
        const unsubscribe = subscribeToRealtimeData(
          `${collectionName}/rooms/${roomId}/messages`,
          (data) => {
            if (data) {
              const messagesArray = Object.entries(data).map(([id, messageData]: [string, any]) => ({
                id,
                ...messageData,
                createdAt: new Date(messageData.createdAt),
                updatedAt: new Date(messageData.updatedAt),
              })) as ChatMessage[];
              
              // Sort by creation time
              messagesArray.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
              messages.value = messagesArray;
            } else {
              messages.value = [];
            }
          }
        );
        
        unsubscribeFunctions.value.push(unsubscribe);
        isSubscribed.value = true;
      } else {
        const unsubscribe = subscribeToCollection(
          `${collectionName}/rooms/${roomId}/messages`,
          (snapshot) => {
            const messagesArray = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as ChatMessage[];
            
            messages.value = messagesArray;
          },
          {
            orderBy: [['createdAt', 'asc']]
          }
        );
        
        unsubscribeFunctions.value.push(unsubscribe);
        isSubscribed.value = true;
      }
    } catch (error) {
      console.error('Subscribe to room error:', error);
      throw error;
    }
  };

  // Subscribe to user rooms
  const subscribeToUserRooms = async () => {
    if (!isAuthenticated.value) throw new Error('User not authenticated');

    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('User ID not found');

    try {
      if (useRealtime) {
        const unsubscribe = subscribeToRealtimeData(
          `${collectionName}/rooms`,
          (data) => {
            if (data) {
              const roomsArray = Object.entries(data)
                .filter(([_, roomData]: [string, any]) => 
                  roomData.participants && roomData.participants.includes(currentUserId)
                )
                .map(([id, roomData]: [string, any]) => ({
                  id,
                  ...roomData,
                  createdAt: new Date(roomData.createdAt),
                  updatedAt: new Date(roomData.updatedAt),
                  lastMessageAt: roomData.lastMessageAt ? new Date(roomData.lastMessageAt) : undefined,
                })) as ChatRoom[];
              
              // Sort by last message time
              roomsArray.sort((a, b) => {
                const aTime = a.lastMessageAt?.getTime() || a.createdAt.getTime();
                const bTime = b.lastMessageAt?.getTime() || b.createdAt.getTime();
                return bTime - aTime;
              });
              
              rooms.value = roomsArray;
            } else {
              rooms.value = [];
            }
          }
        );
        
        unsubscribeFunctions.value.push(unsubscribe);
      } else {
        const unsubscribe = subscribeToCollection(
          `${collectionName}/rooms`,
          (snapshot) => {
            const roomsArray = snapshot.docs
              .filter(doc => {
                const data = doc.data();
                return data.participants && data.participants.includes(currentUserId);
              })
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
                lastMessageAt: doc.data().lastMessageAt?.toDate(),
              })) as ChatRoom[];
            
            // Sort by last message time
            roomsArray.sort((a, b) => {
              const aTime = a.lastMessageAt?.getTime() || a.createdAt.getTime();
              const bTime = b.lastMessageAt?.getTime() || b.createdAt.getTime();
              return bTime - aTime;
            });
            
            rooms.value = roomsArray;
          },
          {
            where: [['participants', 'array-contains', currentUserId]],
            orderBy: [['lastMessageAt', 'desc'], ['createdAt', 'desc']]
          }
        );
        
        unsubscribeFunctions.value.push(unsubscribe);
      }
    } catch (error) {
      console.error('Subscribe to user rooms error:', error);
      throw error;
    }
  };

  // Create temporary message for optimistic updates
  const createTempMessage = (
    body: string,
    type: 'text' | 'attachment' = 'text',
    attachments?: Array<{ fileName: string; type: string; url: string; size?: number }>
  ): ChatMessage => {
    const currentUserId = getCurrentUserId();
    
    return {
      id: `temp-${Date.now()}`,
      body,
      type,
      senderId: currentUserId || '',
      senderName: currentUser.value?.displayName || 'Unknown',
      senderAvatar: currentUser.value?.photoURL || '',
      roomId: currentRoomId.value || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemp: true,
      attachments,
    };
  };

  // Send message with optimistic update
  const sendMessageOptimistic = async (
    roomId: string,
    body: string,
    type: 'text' | 'attachment' = 'text',
    attachments?: Array<{ fileName: string; type: string; url: string; size?: number }>
  ): Promise<string> => {
    // Create temporary message
    const tempMessage = createTempMessage(body, type, attachments);
    
    // Add temporary message immediately
    messages.value.push(tempMessage);
    options.onMessageSent?.(tempMessage);

    try {
      // Send real message
      const messageId = await sendMessage(roomId, body, type, attachments);
      
      // Remove temporary message (real message will be added via subscription)
      const tempIndex = messages.value.findIndex(msg => msg.id === tempMessage.id);
      if (tempIndex !== -1) {
        messages.value.splice(tempIndex, 1);
      }
      
      return messageId;
    } catch (error) {
      // Remove temporary message if sending failed
      const tempIndex = messages.value.findIndex(msg => msg.id === tempMessage.id);
      if (tempIndex !== -1) {
        messages.value.splice(tempIndex, 1);
      }
      throw error;
    }
  };

  // Load messages for a room
  const loadMessages = (newMessages: ChatMessage[]) => {
    messages.value = [...newMessages];
  };

  // Clear messages
  const clearMessages = () => {
    messages.value = [];
  };

  // Cleanup chat
  const cleanupChat = () => {
    // Unsubscribe from all listeners
    unsubscribeFunctions.value.forEach(unsubscribe => unsubscribe());
    unsubscribeFunctions.value = [];
    
    currentRoomId.value = null;
    isSubscribed.value = false;
    clearMessages();
  };

  // Cleanup all
  const cleanupAll = () => {
    cleanupChat();
    rooms.value = [];
  };

  return {
    // State
    app: readonly(app),
    auth: readonly(auth),
    firestore: readonly(firestore),
    database: readonly(database),
    currentUser: readonly(currentUser),
    isAuthenticated: readonly(isAuthenticated),
    isInitialized: readonly(isInitialized),
    authLoading: readonly(authLoading),
    messages: readonly(messages),
    rooms: readonly(rooms),
    currentRoomId: readonly(currentRoomId),
    isSubscribed: readonly(isSubscribed),
    
    // Actions
    initializeFirebase,
    createRoom,
    sendMessage,
    sendMessageOptimistic,
    subscribeToRoom,
    subscribeToUserRooms,
    loadMessages,
    clearMessages,
    cleanupChat,
    cleanupAll,
    
    // Utilities
    getCurrentUserId,
    createTempMessage,
  };
} 