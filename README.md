# 🔥 Firebase Composables - مكتبة قابلة لإعادة الاستخدام

<div dir="rtl">

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [الميزات](#-الميزات)
- [التركيب](#-التركيب)
- [البدء السريع](#-البدء-السريع)
- [الملفات والوظائف](#-الملفات-والوظائف)
- [أمثلة الاستخدام](#-أمثلة-الاستخدام)
- [التوثيق الكامل](#-التوثيق-الكامل)
- [المساهمة](#-المساهمة)

---

## 🎯 نظرة عامة

مكتبة **Firebase Composables** هي مجموعة من Composables جاهزة للاستخدام في مشاريع **Nuxt.js 3** و **Vue 3**، تتيح لك استخدام جميع خدمات Firebase بسهولة مع دعم كامل لـ **TypeScript**.

### ✨ لماذا هذه المكتبة؟

```
┌─────────────────────────────────────────────────────────┐
│  ✅ سهولة الاستخدام - فقط غيّر بيانات التكوين          │
│  ✅ دعم كامل لـ TypeScript                              │
│  ✅ دعم Firestore و Realtime Database                   │
│  ✅ محادثات فورية مع Optimistic Updates                │
│  ✅ نظام إشعارات كامل مع Push Notifications            │
│  ✅ تنظيف تلقائي للموارد                                │
│  ✅ معالجة أخطاء شاملة                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 الميزات

### 📱 المحادثات (Chat)
- ✅ رسائل فورية (Real-time)
- ✅ رسائل مؤقتة (Optimistic Updates)
- ✅ إرسال ملفات ومرفقات
- ✅ إدارة الغرف والمشاركين
- ✅ دعم Firestore و Realtime Database

### 🔔 الإشعارات (Notifications)
- ✅ إشعارات فورية
- ✅ عداد الإشعارات غير المقروءة
- ✅ تمييز الإشعارات كمقروءة
- ✅ تصفية حسب النوع
- ✅ Push Notifications
- ✅ دعم Firestore و Realtime Database

### 🔐 المصادقة (Authentication)
- ✅ تسجيل دخول مجهول
- ✅ تسجيل دخول بالبريد الإلكتروني
- ✅ إدارة حالة المستخدم
- ✅ تسجيل الخروج

### 🛠️ عام
- ✅ إدارة الاتصال
- ✅ معالجة الأخطاء
- ✅ تنظيف الذاكرة
- ✅ قابلية التخصيص الكاملة

---

## 📦 التركيب

### الخطوة 1: تثبيت Firebase

```bash
npm install firebase
# أو
yarn add firebase
# أو
pnpm add firebase
```

### الخطوة 2: نسخ الملفات

انسخ جميع ملفات TypeScript إلى مجلد `composables` في مشروعك:

```
composables/
├── useFirebaseConfig.ts
├── useFirebaseCore.ts
├── useFirebaseChat.ts
├── useFirebaseNotifications.ts
└── useFirebaseExample.ts
```

---

## ⚡ البدء السريع

### 1️⃣ تعديل التكوين

افتح ملف `useFirebaseExample.ts` وعدّل بيانات Firebase:

```typescript
const firebaseConfig: FirebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
  measurementId: 'G-XXXXXXXXXX'
};
```

### 2️⃣ الاستخدام في المكون

```vue
<script setup>
import { useFirebaseExample } from '@/composables/useFirebaseExample';

const {
  chatMessages,
  chatRooms,
  notifications,
  unreadCount,
  initializeChat,
  sendChatMessage,
  initializeNotifications,
  signInAnonymously,
  cleanupAll
} = useFirebaseExample();

// تهيئة Firebase
onMounted(async () => {
  await signInAnonymously();
  await Promise.all([
    initializeChat(),
    initializeNotifications()
  ]);
});

// تنظيف عند الإغلاق
onUnmounted(() => {
  cleanupAll();
});
</script>
```

---

## 📁 الملفات والوظائف

### 📄 1. `useFirebaseConfig.ts`

**الغرض:** ملف التكوين الأساسي - يحتوي على جميع الواجهات والإعدادات الافتراضية.

```
┌─────────────────────────────────────┐
│  useFirebaseConfig.ts                │
├─────────────────────────────────────┤
│  • FirebaseConfig                    │
│  • FirestoreConfig                   │
│  • RealtimeConfig                    │
│  • MessagingConfig                   │
│  • useFirebaseConfig()               │
└─────────────────────────────────────┘
```

**الواجهات:**
- `FirebaseConfig`: تكوين Firebase الأساسي
- `FirestoreConfig`: تكوين Firestore
- `RealtimeConfig`: تكوين Realtime Database
- `MessagingConfig`: تكوين Cloud Messaging

---

### 🔧 2. `useFirebaseCore.ts`

**الغرض:** Composable الأساسي - يوفر جميع الوظائف الأساسية لخدمات Firebase.

```
┌─────────────────────────────────────┐
│  useFirebaseCore.ts                 │
├─────────────────────────────────────┤
│  🔐 Authentication                   │
│    • signInAnonymouslyUser()        │
│    • signInWithEmail()              │
│    • signOutUser()                  │
│                                     │
│  📊 Firestore                       │
│    • addDocument()                  │
│    • updateDocument()               │
│    • deleteDocument()               │
│    • subscribeToCollection()        │
│                                     │
│  ⚡ Realtime Database               │
│    • pushRealtimeData()             │
│    • updateRealtimeData()           │
│    • subscribeToRealtimeData()     │
│                                     │
│  📱 Messaging                       │
│    • requestNotificationPermission()│
│    • subscribeToMessages()          │
└─────────────────────────────────────┘
```

**الحالة (State):**
```typescript
{
  app: FirebaseApp | null
  auth: Auth | null
  firestore: Firestore | null
  database: Database | null
  messaging: Messaging | null
  currentUser: User | null
  isAuthenticated: boolean
  isInitialized: boolean
  authLoading: boolean
}
```

---

### 💬 3. `useFirebaseChat.ts`

**الغرض:** Composable خاص بالمحادثات - يوفر نظام محادثات كامل.

```
┌─────────────────────────────────────┐
│  useFirebaseChat.ts                  │
├─────────────────────────────────────┤
│  🏠 إدارة الغرف                     │
│    • createRoom()                   │
│    • subscribeToUserRooms()         │
│                                     │
│  💬 إدارة الرسائل                   │
│    • sendMessage()                  │
│    • sendMessageOptimistic()        │
│    • subscribeToRoom()              │
│                                     │
│  📎 المرفقات                        │
│    • دعم إرسال الملفات              │
│                                     │
│  ⚡ Optimistic Updates              │
│    • رسائل مؤقتة فورية              │
└─────────────────────────────────────┘
```

**الحالة:**
```typescript
{
  messages: ChatMessage[]      // الرسائل الحالية
  rooms: ChatRoom[]            // الغرف المتاحة
  currentRoomId: string | null // الغرفة الحالية
  isSubscribed: boolean        // حالة الاشتراك
}
```

**مثال الاستخدام:**
```typescript
const chat = useFirebaseChat({
  config: firebaseConfig,
  useRealtime: false, // true للـ Realtime Database
  collectionName: 'chats',
  onNewMessage: (message) => {
    console.log('رسالة جديدة:', message);
  }
});

// إنشاء غرفة
const roomId = await chat.createRoom(['user1', 'user2'], 'الغرفة 1');

// الاشتراك في الغرفة
await chat.subscribeToRoom(roomId);

// إرسال رسالة
await chat.sendMessageOptimistic(roomId, 'مرحباً!');
```

---

### 🔔 4. `useFirebaseNotifications.ts`

**الغرض:** Composable خاص بالإشعارات - يوفر نظام إشعارات كامل مع Push Notifications.

```
┌─────────────────────────────────────┐
│  useFirebaseNotifications.ts         │
├─────────────────────────────────────┤
│  📝 إدارة الإشعارات                  │
│    • createNotification()            │
│    • markAsRead()                    │
│    • markAllAsRead()                 │
│    • deleteNotification()           │
│                                     │
│  📡 Push Notifications               │
│    • initializePushNotifications() │
│    • subscribeToPushMessages()      │
│                                     │
│  🔍 التصفية والبحث                   │
│    • getNotificationsByType()        │
│    • getUnreadNotifications()        │
│                                     │
│  📊 العداد                           │
│    • unreadCount (تلقائي)            │
└─────────────────────────────────────┘
```

**الحالة:**
```typescript
{
  notifications: Notification[]  // جميع الإشعارات
  unreadCount: number            // عدد غير المقروءة
  isSubscribed: boolean         // حالة الاشتراك
}
```

**مثال الاستخدام:**
```typescript
const notifications = useFirebaseNotifications({
  config: firebaseConfig,
  useRealtime: false,
  collectionName: 'notifications',
  onNewNotification: (notification) => {
    console.log('إشعار جديد:', notification);
  }
});

// تهيئة
await notifications.initializeFirebase();
await notifications.subscribeToUserNotifications();

// إنشاء إشعار
await notifications.createNotification(
  'مرحباً',
  'هذا إشعار تجريبي',
  'info'
);

// تمييز كمقروء
await notifications.markAsRead(notificationId);
```

---

### 📚 5. `useFirebaseExample.ts`

**الغرض:** مثال كامل يوضح كيفية استخدام جميع Composables معاً.

```
┌─────────────────────────────────────┐
│  useFirebaseExample.ts              │
├─────────────────────────────────────┤
│  🔄 يجمع جميع Composables           │
│                                     │
│  💬 وظائف المحادثات                 │
│    • initializeChat()               │
│    • joinChatRoom()                  │
│    • sendChatMessage()               │
│                                     │
│  🔔 وظائف الإشعارات                 │
│    • initializeNotifications()      │
│    • createNotification()           │
│    • markNotificationAsRead()       │
│                                     │
│  🔐 وظائف المصادقة                  │
│    • signInAnonymously()            │
│    • signInWithEmail()               │
│    • signOut()                       │
│                                     │
│  🧹 وظائف التنظيف                   │
│    • cleanupAll()                    │
└─────────────────────────────────────┘
```

---

## 💡 أمثلة الاستخدام

### مثال 1: محادثة بسيطة

```vue
<template>
  <div>
    <!-- الرسائل -->
    <div class="messages">
      <div v-for="message in chatMessages" :key="message.id">
        <strong>{{ message.senderName }}:</strong>
        {{ message.body }}
      </div>
    </div>
    
    <!-- إرسال رسالة -->
    <input v-model="newMessage" @keyup.enter="send" />
    <button @click="send">إرسال</button>
  </div>
</template>

<script setup>
import { useFirebaseExample } from '@/composables/useFirebaseExample';

const { chatMessages, sendChatMessage, initializeChat, signInAnonymously } = useFirebaseExample();
const newMessage = ref('');

onMounted(async () => {
  await signInAnonymously();
  await initializeChat();
  await joinChatRoom('room-id');
});

const send = async () => {
  if (newMessage.value.trim()) {
    await sendChatMessage('room-id', newMessage.value);
    newMessage.value = '';
  }
};
</script>
```

### مثال 2: نظام إشعارات

```vue
<template>
  <div>
    <!-- عداد الإشعارات -->
    <div class="notification-badge">
      إشعارات غير مقروءة: {{ unreadCount }}
    </div>
    
    <!-- قائمة الإشعارات -->
    <div v-for="notification in notifications" :key="notification.id">
      <h4>{{ notification.title }}</h4>
      <p>{{ notification.message }}</p>
      <button 
        v-if="!notification.read"
        @click="markAsRead(notification.id)"
      >
        تمييز كمقروء
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFirebaseExample } from '@/composables/useFirebaseExample';

const {
  notifications,
  unreadCount,
  initializeNotifications,
  markNotificationAsRead,
  signInAnonymously
} = useFirebaseExample();

onMounted(async () => {
  await signInAnonymously();
  await initializeNotifications();
});

const markAsRead = async (id) => {
  await markNotificationAsRead(id);
};
</script>
```

### مثال 3: استخدام كامل

```vue
<template>
  <div class="app">
    <!-- حالة الاتصال -->
    <div :class="chatConnected ? 'connected' : 'disconnected'">
      {{ chatConnected ? '✅ متصل' : '❌ غير متصل' }}
    </div>
    
    <!-- غرف المحادثة -->
    <div class="rooms">
      <div 
        v-for="room in chatRooms" 
        :key="room.id"
        @click="joinRoom(room.id)"
      >
        {{ room.name }}
      </div>
    </div>
    
    <!-- الرسائل -->
    <div class="messages">
      <div 
        v-for="message in chatMessages" 
        :key="message.id"
        :class="{ temp: message.isTemp }"
      >
        {{ message.senderName }}: {{ message.body }}
      </div>
    </div>
    
    <!-- إرسال -->
    <div class="input-area">
      <input v-model="newMessage" @keyup.enter="sendMessage" />
      <button @click="sendMessage">إرسال</button>
    </div>
    
    <!-- الإشعارات -->
    <div class="notifications">
      <h3>الإشعارات ({{ unreadCount }})</h3>
      <div v-for="notification in notifications" :key="notification.id">
        <h4>{{ notification.title }}</h4>
        <p>{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFirebaseExample } from '@/composables/useFirebaseExample';

const {
  // الحالة
  chatMessages,
  chatRooms,
  chatConnected,
  notifications,
  unreadCount,
  currentUser,
  
  // الوظائف
  initializeChat,
  joinChatRoom,
  sendChatMessage,
  initializeNotifications,
  signInAnonymously,
  cleanupAll
} = useFirebaseExample();

const newMessage = ref('');
const selectedRoomId = ref('');

// التهيئة
onMounted(async () => {
  await signInAnonymously();
  await Promise.all([
    initializeChat(),
    initializeNotifications()
  ]);
});

// الانضمام للغرفة
const joinRoom = async (roomId) => {
  selectedRoomId.value = roomId;
  await joinChatRoom(roomId);
};

// إرسال رسالة
const sendMessage = async () => {
  if (newMessage.value.trim() && selectedRoomId.value) {
    await sendChatMessage(selectedRoomId.value, newMessage.value);
    newMessage.value = '';
  }
};

// التنظيف
onUnmounted(() => {
  cleanupAll();
});
</script>
```

---

## 📖 التوثيق الكامل

للحصول على شرح تفصيلي كامل لكل ملف ووظيفة، راجع ملف [README-Firebase.md](./README-Firebase.md) الذي يحتوي على:

- ✅ شرح تفصيلي لكل ملف
- ✅ شرح جميع الوظائف
- ✅ أمثلة عملية كاملة
- ✅ شرح كيفية عمل الكود خطوة بخطوة
- ✅ أفضل الممارسات

---

## 🎨 التخصيص

### اختيار نوع قاعدة البيانات

```typescript
// استخدام Firestore (افتراضي)
const chat = useFirebaseChat({
  config: firebaseConfig,
  useRealtime: false,
  collectionName: 'chats'
});

// استخدام Realtime Database
const chat = useFirebaseChat({
  config: firebaseConfig,
  useRealtime: true,
  collectionName: 'chats'
});
```

### تغيير أسماء المجموعات

```typescript
const chat = useFirebaseChat({
  config: firebaseConfig,
  collectionName: 'my-custom-chats' // اسم مخصص
});
```

### إضافة معالجات الأحداث

```typescript
const chat = useFirebaseChat({
  config: firebaseConfig,
  onNewMessage: (message) => {
    // منطق مخصص عند استلام رسالة
    playSound();
    showToast('رسالة جديدة');
  },
  onMessageError: (error) => {
    // معالجة الأخطاء
    console.error('خطأ:', error);
  }
});
```


---

## ⚠️ ملاحظات مهمة

1. **إعداد Firebase Console**
   - تأكد من إنشاء مشروع Firebase
   - فعّل الخدمات المطلوبة (Authentication, Firestore/Realtime Database, Messaging)

2. **قواعد الأمان**
   - استخدم قواعد أمان مناسبة في Firestore/Realtime Database
   - لا تترك قاعدة البيانات مفتوحة للجميع

3. **التنظيف**
   - دائماً استدعِ `cleanupAll()` عند إغلاق المكونات
   - هذا يمنع تسريب الذاكرة

4. **الأخطاء**
   - جميع الوظائف ترمي أخطاء عند الفشل
   - استخدم try/catch لمعالجة الأخطاء

---

## 🔥 خدمات Firebase المدعومة

```
┌─────────────────────────────────────┐
│  Authentication                      │
│  • تسجيل دخول مجهول                 │
│  • تسجيل دخول بالبريد               │
│  • إدارة حالة المستخدم              │
├─────────────────────────────────────┤
│  Firestore                           │
│  • إضافة/تحديث/حذف المستندات        │
│  • الاشتراك في التغييرات            │
│  • الاستعلامات مع الفلاتر           │
├─────────────────────────────────────┤
│  Realtime Database                   │
│  • إضافة/تحديث/حذف البيانات         │
│  • الاشتراك في التغييرات            │
│  • إدارة المسارات                    │
├─────────────────────────────────────┤
│  Cloud Messaging                     │
│  • Push Notifications                │
│  • إدارة الأذونات                    │
│  • استقبال الرسائل                   │
└─────────────────────────────────────┘
```

---

## 🤝 المساهمة

يمكنك تخصيص هذه Composables حسب احتياجات مشروعك وإضافة ميزات جديدة.

### اقتراحات التحسين:
- ✨ إضافة ميزات جديدة
- 🐛 إصلاح الأخطاء
- 📝 تحسين التوثيق
- 🎨 تحسين الكود

---

## 📄 الترخيص

هذا المشروع متاح للاستخدام الحر في أي مشروع.

---

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك أسئلة:
1. راجع ملف [README-Firebase.md](./README-Firebase.md) للتوثيق الكامل
2. تحقق من أمثلة الاستخدام أعلاه
3. راجع كود المصدر للفهم الأعمق

---

<div align="center">

**صُنع بـ ❤️ للمجتمع العربي**

</div>

</div>

