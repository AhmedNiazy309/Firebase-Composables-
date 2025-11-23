# Firebase Composables - قابلة لإعادة الاستخدام

هذه المجموعة من Composables تتيح لك استخدام Firebase بسهولة في أي مشروع Nuxt.js مع تغيير البيانات فقط.

## 📁 الملفات

### 1. `useFirebaseConfig.ts`
ملف التكوين الأساسي لـ Firebase - يحتوي على الإعدادات الافتراضية.

### 2. `useFirebaseCore.ts`
Composable أساسي لـ Firebase - يوفر الوظائف الأساسية للاتصال والخدمات.

### 3. `useFirebaseChat.ts`
Composable خاص بالمحادثات - يوفر وظائف المحادثات الفورية.

### 4. `useFirebaseNotifications.ts`
Composable خاص بالإشعارات - يوفر وظائف الإشعارات الفورية.

### 5. `useFirebaseExample.ts`
مثال على كيفية استخدام جميع Composables معاً.

## 📖 شرح تفصيلي للملفات

### 1. `useFirebaseConfig.ts` - ملف التكوين

هذا الملف يحتوي على جميع واجهات التكوين والإعدادات الافتراضية لـ Firebase.

#### الواجهات (Interfaces):

**`FirebaseConfig`**
- واجهة تحتوي على جميع بيانات التكوين الأساسية لـ Firebase
- الحقول المطلوبة:
  - `apiKey`: مفتاح API الخاص بمشروع Firebase
  - `authDomain`: نطاق المصادقة (مثل: `your-project.firebaseapp.com`)
  - `projectId`: معرف المشروع
  - `storageBucket`: حاوية التخزين
  - `messagingSenderId`: معرف المرسل للإشعارات
  - `appId`: معرف التطبيق
- الحقول الاختيارية:
  - `measurementId`: معرف القياس (لـ Google Analytics)

**`FirestoreConfig`**
- واجهة لتكوين Firestore
- الحقول:
  - `collectionPrefix`: بادئة اختيارية لأسماء المجموعات
  - `subCollectionPrefix`: بادئة اختيارية للمجموعات الفرعية

**`RealtimeConfig`**
- واجهة لتكوين Realtime Database
- الحقول:
  - `databaseURL`: رابط قاعدة البيانات (مطلوب)
  - `pathPrefix`: بادئة اختيارية للمسارات

**`MessagingConfig`**
- واجهة لتكوين Cloud Messaging
- الحقول:
  - `vapidKey`: مفتاح VAPID للإشعارات
  - `defaultNotificationOptions`: خيارات افتراضية للإشعارات (عنوان، أيقونة، شارة، صوت)

#### الدالة `useFirebaseConfig()`
- ترجع كائن يحتوي على جميع الإعدادات الافتراضية
- يمكن استخدامها مباشرة أو دمجها مع إعدادات مخصصة
- الإعدادات الافتراضية قابلة للتعديل حسب احتياجات المشروع

---

### 2. `useFirebaseCore.ts` - Composable الأساسي

هذا الملف هو القلب الأساسي لجميع Composables الأخرى. يوفر الوظائف الأساسية لجميع خدمات Firebase.

#### الواجهات:

**`FirebaseCoreOptions`**
- واجهة خيارات التكوين للـ Composable الأساسي
- الحقول:
  - `config`: تكوين Firebase الأساسي (مطلوب)
  - `firestoreConfig`: تكوين Firestore (اختياري)
  - `realtimeConfig`: تكوين Realtime Database (اختياري)
  - `messagingConfig`: تكوين Cloud Messaging (اختياري)
  - `onAuthStateChanged`: دالة callback عند تغيير حالة المصادقة
  - `onMessageReceived`: دالة callback عند استلام رسالة push

#### الحالة (State):

- `app`: مرجع لتطبيق Firebase
- `auth`: خدمة المصادقة
- `firestore`: خدمة Firestore
- `database`: خدمة Realtime Database
- `messaging`: خدمة Cloud Messaging
- `currentUser`: المستخدم الحالي
- `isAuthenticated`: حالة المصادقة (true/false)
- `isInitialized`: حالة التهيئة
- `authLoading`: حالة تحميل المصادقة

#### الوظائف الأساسية:

**المصادقة (Authentication):**
- `initializeFirebase()`: تهيئة Firebase وربط جميع الخدمات
- `signInAnonymouslyUser()`: تسجيل دخول مجهول
- `signInWithEmail(email, password)`: تسجيل دخول بالبريد الإلكتروني
- `signOutUser()`: تسجيل الخروج

**Firestore:**
- `addDocument(collectionName, data)`: إضافة مستند جديد مع إضافة `createdAt` و `updatedAt` تلقائياً
- `updateDocument(collectionName, docId, data)`: تحديث مستند مع تحديث `updatedAt` تلقائياً
- `deleteDocument(collectionName, docId)`: حذف مستند
- `subscribeToCollection(collectionName, callback, constraints)`: الاشتراك في مجموعة مع دعم:
  - `where`: فلاتر الاستعلام
  - `orderBy`: ترتيب النتائج
  - `limit`: تحديد عدد النتائج

**Realtime Database:**
- `setRealtimeData(path, data)`: تعيين بيانات في مسار معين مع إضافة `timestamp` تلقائياً
- `pushRealtimeData(path, data)`: إضافة بيانات جديدة مع توليد مفتاح تلقائي
- `updateRealtimeData(path, data)`: تحديث بيانات مع إضافة `updatedAt` تلقائياً
- `removeRealtimeData(path)`: حذف بيانات من مسار معين
- `subscribeToRealtimeData(path, callback)`: الاشتراك في التغييرات في مسار معين

**Cloud Messaging:**
- `requestNotificationPermission()`: طلب إذن الإشعارات والحصول على token
- `subscribeToMessages(callback)`: الاشتراك في استقبال رسائل push

**التنظيف:**
- `cleanup()`: تنظيف الموارد (يتم تلقائياً عند إغلاق التطبيق)

---

### 3. `useFirebaseChat.ts` - Composable المحادثات

هذا الملف يوفر وظائف كاملة لإدارة المحادثات الفورية مع دعم Firestore و Realtime Database.

#### الواجهات:

**`ChatMessage`**
- واجهة تمثل رسالة محادثة
- الحقول:
  - `id`: معرف الرسالة
  - `body`: نص الرسالة
  - `type`: نوع الرسالة (`text` أو `attachment`)
  - `senderId`: معرف المرسل
  - `senderName`: اسم المرسل (اختياري)
  - `senderAvatar`: صورة المرسل (اختياري)
  - `roomId`: معرف الغرفة
  - `createdAt`: تاريخ الإنشاء
  - `updatedAt`: تاريخ التحديث
  - `isTemp`: هل الرسالة مؤقتة (لـ Optimistic Updates)
  - `attachments`: مصفوفة المرفقات (اختياري)

**`ChatRoom`**
- واجهة تمثل غرفة محادثة
- الحقول:
  - `id`: معرف الغرفة
  - `name`: اسم الغرفة (اختياري)
  - `participants`: مصفوفة معرفات المشاركين
  - `lastMessage`: آخر رسالة (اختياري)
  - `lastMessageAt`: تاريخ آخر رسالة (اختياري)
  - `createdAt`: تاريخ الإنشاء
  - `updatedAt`: تاريخ التحديث

**`ChatOptions`**
- واجهة خيارات المحادثات (تمتد من `FirebaseCoreOptions`)
- الحقول الإضافية:
  - `useRealtime`: استخدام Realtime Database بدلاً من Firestore
  - `collectionName`: اسم المجموعة (افتراضي: `chats`)
  - `onNewMessage`: callback عند استلام رسالة جديدة
  - `onMessageSent`: callback عند إرسال رسالة
  - `onMessageError`: callback عند حدوث خطأ
  - `onRoomCreated`: callback عند إنشاء غرفة

#### الحالة (State):

- جميع الحالات من `useFirebaseCore`
- `messages`: مصفوفة الرسائل الحالية
- `rooms`: مصفوفة الغرف
- `currentRoomId`: معرف الغرفة الحالية
- `isSubscribed`: حالة الاشتراك

#### الوظائف:

**إدارة الغرف:**
- `createRoom(participants, name)`: إنشاء غرفة محادثة جديدة
  - `participants`: مصفوفة معرفات المستخدمين
  - `name`: اسم الغرفة (اختياري)
  - ترجع معرف الغرفة الجديدة

**إرسال الرسائل:**
- `sendMessage(roomId, body, type, attachments)`: إرسال رسالة عادية
- `sendMessageOptimistic(roomId, body, type, attachments)`: إرسال رسالة مع Optimistic Update
  - تعرض الرسالة فوراً قبل تأكيد الإرسال من السيرفر
  - تحذف الرسالة المؤقتة عند استلام الرسالة الحقيقية أو عند فشل الإرسال

**الاشتراكات:**
- `subscribeToRoom(roomId)`: الاشتراك في رسائل غرفة معينة
  - تحدث `messages` تلقائياً عند وصول رسائل جديدة
  - ترتيب الرسائل حسب وقت الإنشاء
- `subscribeToUserRooms()`: الاشتراك في جميع غرف المستخدم الحالي
  - تحدث `rooms` تلقائياً
  - ترتيب الغرف حسب آخر رسالة

**وظائف مساعدة:**
- `createTempMessage(body, type, attachments)`: إنشاء رسالة مؤقتة
- `loadMessages(messages)`: تحميل رسائل يدوياً
- `clearMessages()`: مسح جميع الرسائل
- `getCurrentUserId()`: الحصول على معرف المستخدم الحالي

**التنظيف:**
- `cleanupChat()`: تنظيف موارد المحادثات فقط
- `cleanupAll()`: تنظيف جميع الموارد

---

### 4. `useFirebaseNotifications.ts` - Composable الإشعارات

هذا الملف يوفر وظائف كاملة لإدارة الإشعارات مع دعم Push Notifications.

#### الواجهات:

**`Notification`**
- واجهة تمثل إشعار
- الحقول:
  - `id`: معرف الإشعار
  - `title`: عنوان الإشعار
  - `message`: نص الإشعار
  - `type`: نوع الإشعار (`info`, `success`, `warning`, `error`)
  - `userId`: معرف المستخدم (اختياري - للإشعارات الخاصة)
  - `data`: بيانات إضافية (اختياري)
  - `read`: حالة القراءة (true/false)
  - `createdAt`: تاريخ الإنشاء
  - `updatedAt`: تاريخ التحديث

**`NotificationOptions`**
- واجهة خيارات الإشعارات (تمتد من `FirebaseCoreOptions`)
- الحقول الإضافية:
  - `useRealtime`: استخدام Realtime Database
  - `collectionName`: اسم المجموعة (افتراضي: `notifications`)
  - `onNewNotification`: callback عند استلام إشعار جديد
  - `onNotificationRead`: callback عند قراءة إشعار
  - `onNotificationError`: callback عند حدوث خطأ

#### الحالة (State):

- جميع الحالات من `useFirebaseCore`
- `notifications`: مصفوفة الإشعارات
- `unreadCount`: عدد الإشعارات غير المقروءة (يُحسب تلقائياً)
- `isSubscribed`: حالة الاشتراك

#### الوظائف:

**إدارة الإشعارات:**
- `createNotification(title, message, type, userId, data)`: إنشاء إشعار جديد
  - `title`: عنوان الإشعار (مطلوب)
  - `message`: نص الإشعار (مطلوب)
  - `type`: نوع الإشعار (افتراضي: `info`)
  - `userId`: معرف المستخدم (اختياري - إذا لم يُحدد يستخدم المستخدم الحالي)
  - `data`: بيانات إضافية (اختياري)
  - ترجع معرف الإشعار الجديد

- `markAsRead(notificationId)`: تمييز إشعار كمقروء
  - تحدث `unreadCount` تلقائياً

- `markAllAsRead()`: تمييز جميع إشعارات المستخدم كمقروءة
  - تحدث جميع الإشعارات المحلية والسيرفر

- `deleteNotification(notificationId)`: حذف إشعار
  - تحدث `unreadCount` تلقائياً

**الاشتراكات:**
- `subscribeToUserNotifications()`: الاشتراك في إشعارات المستخدم الحالي فقط
  - تحدث `notifications` تلقائياً
  - ترتيب الإشعارات حسب تاريخ الإنشاء (الأحدث أولاً)

- `subscribeToGeneralNotifications()`: الاشتراك في الإشعارات العامة (بدون `userId`)
  - للإشعارات التي تظهر لجميع المستخدمين

**Push Notifications:**
- `initializePushNotifications()`: تهيئة Push Notifications
  - تطلب إذن الإشعارات من المتصفح
  - ترجع token يمكن إرساله للسيرفر

- `subscribeToPushMessages(callback)`: الاشتراك في استقبال رسائل push
  - يتم استدعاء callback عند استلام رسالة push

**وظائف مساعدة:**
- `getNotificationsByType(type)`: الحصول على إشعارات بنوع معين
- `getUnreadNotifications()`: الحصول على جميع الإشعارات غير المقروءة
- `loadNotifications(notifications)`: تحميل إشعارات يدوياً
- `addNotification(notification)`: إضافة إشعار يدوياً (للاستخدام المحلي)
- `clearNotifications()`: مسح جميع الإشعارات
- `updateUnreadCount()`: تحديث عداد الإشعارات غير المقروءة
- `getCurrentUserId()`: الحصول على معرف المستخدم الحالي

**التنظيف:**
- `cleanupNotifications()`: تنظيف موارد الإشعارات فقط
- `cleanupAll()`: تنظيف جميع الموارد

---

### 5. `useFirebaseExample.ts` - مثال الاستخدام

هذا الملف يحتوي على مثال كامل يوضح كيفية استخدام جميع Composables معاً في مشروع حقيقي.

#### البنية:

**1. تكوين Firebase:**
```typescript
const firebaseConfig: FirebaseConfig = {
  // جميع بيانات التكوين
}
```

**2. تهيئة Composables:**
- `chatFirebase`: instance من `useFirebaseChat`
- `notificationFirebase`: instance من `useFirebaseNotifications`

**3. وظائف مساعدة للمحادثات:**
- `initializeChat()`: تهيئة المحادثات والاشتراك في الغرف
- `joinChatRoom(roomId)`: الانضمام لغرفة محادثة
- `createChatRoom(participants, name)`: إنشاء غرفة جديدة
- `sendChatMessage(roomId, messageText)`: إرسال رسالة نصية
- `sendChatFile(roomId, fileName, fileType, fileUrl, fileSize)`: إرسال ملف

**4. وظائف مساعدة للإشعارات:**
- `initializeNotifications()`: تهيئة الإشعارات والاشتراك
- `createNotification(title, message, type, userId, data)`: إنشاء إشعار
- `markNotificationAsRead(notificationId)`: تمييز إشعار كمقروء
- `markAllNotificationsAsRead()`: تمييز الكل كمقروء
- `deleteNotification(notificationId)`: حذف إشعار

**5. وظائف المصادقة:**
- `signInAnonymously()`: تسجيل دخول كضيف
- `signInWithEmail(email, password)`: تسجيل دخول بالبريد
- `signOut()`: تسجيل الخروج

**6. وظائف التنظيف:**
- `cleanupAll()`: تنظيف جميع الموارد
- `cleanupChat()`: تنظيف موارد المحادثات فقط
- `cleanupNotifications()`: تنظيف موارد الإشعارات فقط

#### القيم المُرجعة:

**حالة المحادثات:**
- `chatMessages`: مصفوفة الرسائل
- `chatRooms`: مصفوفة الغرف
- `chatCurrentRoom`: معرف الغرفة الحالية
- `chatConnected`: حالة الاتصال
- `chatInitialized`: حالة التهيئة
- `chatLoading`: حالة التحميل
- `chatSubscribed`: حالة الاشتراك

**حالة الإشعارات:**
- `notifications`: مصفوفة الإشعارات
- `unreadCount`: عدد الإشعارات غير المقروءة
- `notificationConnected`: حالة الاتصال
- `notificationInitialized`: حالة التهيئة
- `notificationLoading`: حالة التحميل
- `notificationSubscribed`: حالة الاشتراك

**حالة المستخدم:**
- `currentUser`: بيانات المستخدم الحالي

**وظائف مساعدة:**
- `getUnreadNotifications()`: الحصول على الإشعارات غير المقروءة
- `getNotificationsByType(type)`: الحصول على إشعارات بنوع معين
- `getCurrentUserId()`: الحصول على معرف المستخدم

#### مثال الاستخدام في المكون:

يحتوي الملف على مثال كامل في التعليقات يوضح كيفية:
- استيراد واستخدام `useFirebaseExample`
- تهيئة Firebase عند تحميل المكون
- إرسال الرسائل والانضمام للغرف
- إدارة الإشعارات
- تنظيف الموارد عند إغلاق المكون

---

## 🔍 شرح تفصيلي مع أمثلة عملية

### 1. `useFirebaseConfig.ts` - شرح مفصل

#### الغرض من الملف:
هذا الملف يحتوي على جميع الواجهات (Interfaces) والإعدادات الافتراضية لـ Firebase. يعمل كملف مرجعي لتحديد أنواع البيانات المستخدمة في جميع الملفات الأخرى.

#### كيف يعمل:

```typescript
// 1. تعريف الواجهات (TypeScript Interfaces)
export interface FirebaseConfig {
  apiKey: string;           // مفتاح API - يحصل عليه من Firebase Console
  authDomain: string;        // نطاق المصادقة
  projectId: string;        // معرف المشروع
  // ... إلخ
}

// 2. دالة ترجع الإعدادات الافتراضية
export const useFirebaseConfig = () => {
  const defaultConfig: FirebaseConfig = {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    // ... إلخ
  };
  
  return {
    defaultConfig,
    defaultFirestoreConfig,
    defaultRealtimeConfig,
    defaultMessagingConfig
  };
};
```

#### مثال على الاستخدام:

```typescript
import { useFirebaseConfig } from './useFirebaseConfig';

// الحصول على الإعدادات الافتراضية
const { defaultConfig } = useFirebaseConfig();

// دمج الإعدادات الافتراضية مع إعدادات مخصصة
const myConfig = {
  ...defaultConfig,
  apiKey: 'MY_ACTUAL_API_KEY',
  projectId: 'my-project-id'
};
```

#### ملاحظات مهمة:
- جميع الحقول في `FirebaseConfig` مطلوبة ما عدا `measurementId`
- يمكن استخدام `FirestoreConfig` لإضافة بادئات لأسماء المجموعات
- `RealtimeConfig` يتطلب `databaseURL` فقط
- `MessagingConfig` يحتوي على خيارات Push Notifications

---

### 2. `useFirebaseCore.ts` - شرح مفصل

#### الغرض من الملف:
هذا الملف هو الأساس لجميع Composables الأخرى. يوفر جميع الوظائف الأساسية لخدمات Firebase (Authentication, Firestore, Realtime Database, Messaging).

#### كيف يعمل خطوة بخطوة:

**الخطوة 1: التهيئة**
```typescript
const initializeFirebase = () => {
  // 1. إنشاء تطبيق Firebase
  app.value = initializeApp(options.config);
  
  // 2. تهيئة الخدمات
  auth.value = getAuth(app.value);
  firestore.value = getFirestore(app.value);
  
  // 3. إعداد مستمع حالة المصادقة
  onAuthStateChanged(auth.value, (user) => {
    currentUser.value = user;
    isAuthenticated.value = !!user;
  });
};
```

**الخطوة 2: المصادقة**
```typescript
// تسجيل دخول مجهول
const signInAnonymouslyUser = async () => {
  const result = await signInAnonymously(auth.value);
  return result.user; // يرجع بيانات المستخدم
};

// تسجيل دخول بالبريد
const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth.value, email, password);
  return result.user;
};
```

**الخطوة 3: Firestore**
```typescript
// إضافة مستند
const addDocument = async (collectionName: string, data: DocumentData) => {
  // إضافة createdAt و updatedAt تلقائياً
  const docRef = await addDoc(collection(firestore.value, collectionName), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef; // يرجع مرجع المستند
};

// الاشتراك في مجموعة
const subscribeToCollection = (collectionName, callback, constraints) => {
  let q = query(collection(firestore.value, collectionName));
  
  // إضافة فلاتر
  if (constraints?.where) {
    constraints.where.forEach(([field, operator, value]) => {
      q = query(q, where(field, operator, value));
    });
  }
  
  // إرجاع دالة إلغاء الاشتراك
  return onSnapshot(q, callback);
};
```

**الخطوة 4: Realtime Database**
```typescript
// إضافة بيانات جديدة
const pushRealtimeData = async (path: string, data: any) => {
  const dbRef = ref(database.value, path);
  const newRef = push(dbRef); // ينشئ مفتاح تلقائي
  await set(newRef, {
    ...data,
    timestamp: Date.now()
  });
  return newRef.key; // يرجع المفتاح التلقائي
};

// الاشتراك في التغييرات
const subscribeToRealtimeData = (path: string, callback: Function) => {
  const dbRef = ref(database.value, path);
  onValue(dbRef, (snapshot) => {
    callback(snapshot.val()); // استدعاء callback عند أي تغيير
  });
  
  return () => off(dbRef); // دالة إلغاء الاشتراك
};
```

#### مثال عملي كامل:

```typescript
import { useFirebaseCore } from './useFirebaseCore';

const firebase = useFirebaseCore({
  config: firebaseConfig,
  onAuthStateChanged: (user) => {
    console.log('المستخدم:', user);
  }
});

// تهيئة Firebase
firebase.initializeFirebase();

// تسجيل دخول
await firebase.signInAnonymouslyUser();

// إضافة مستند
await firebase.addDocument('users', {
  name: 'أحمد',
  email: 'ahmed@example.com'
});

// الاشتراك في مجموعة
const unsubscribe = firebase.subscribeToCollection(
  'messages',
  (snapshot) => {
    snapshot.docs.forEach(doc => {
      console.log('رسالة جديدة:', doc.data());
    });
  },
  {
    where: [['read', '==', false]],
    orderBy: [['createdAt', 'desc']],
    limit: 10
  }
);

// إلغاء الاشتراك لاحقاً
unsubscribe();
```

---

### 3. `useFirebaseChat.ts` - شرح مفصل

#### الغرض من الملف:
يوفر نظام محادثات كامل مع دعم الغرف والرسائل الفورية والملفات.

#### كيف يعمل:

**1. إنشاء غرفة محادثة:**
```typescript
const createRoom = async (participants: string[], name?: string) => {
  const roomData = {
    participants,  // مصفوفة معرفات المستخدمين
    name,          // اسم الغرفة (اختياري)
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // حفظ في Firestore أو Realtime Database
  if (useRealtime) {
    const roomId = await pushRealtimeData('chats/rooms', roomData);
  } else {
    const docRef = await addDocument('chats/rooms', roomData);
    const roomId = docRef.id;
  }
  
  return roomId;
};
```

**2. إرسال رسالة:**
```typescript
const sendMessage = async (roomId: string, body: string) => {
  const messageData = {
    body: body.trim(),
    type: 'text',
    senderId: currentUserId,
    senderName: currentUser.value?.displayName || 'Unknown',
    roomId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // حفظ الرسالة
  if (useRealtime) {
    await pushRealtimeData(`chats/rooms/${roomId}/messages`, messageData);
  } else {
    await addDocument(`chats/rooms/${roomId}/messages`, messageData);
  }
  
  // تحديث آخر رسالة في الغرفة
  await updateDocument('chats/rooms', roomId, {
    lastMessage: messageData,
    lastMessageAt: new Date()
  });
};
```

**3. Optimistic Updates (الرسائل المؤقتة):**
```typescript
const sendMessageOptimistic = async (roomId: string, body: string) => {
  // 1. إنشاء رسالة مؤقتة
  const tempMessage = {
    id: `temp-${Date.now()}`,
    body,
    isTemp: true,
    // ... باقي البيانات
  };
  
  // 2. إضافة الرسالة المؤقتة فوراً (قبل الإرسال)
  messages.value.push(tempMessage);
  
  try {
    // 3. إرسال الرسالة الحقيقية
    const messageId = await sendMessage(roomId, body);
    
    // 4. حذف الرسالة المؤقتة (الرسالة الحقيقية ستصل عبر الاشتراك)
    const tempIndex = messages.value.findIndex(msg => msg.id === tempMessage.id);
    messages.value.splice(tempIndex, 1);
    
    return messageId;
  } catch (error) {
    // 5. في حالة الفشل، حذف الرسالة المؤقتة
    const tempIndex = messages.value.findIndex(msg => msg.id === tempMessage.id);
    messages.value.splice(tempIndex, 1);
    throw error;
  }
};
```

**4. الاشتراك في رسائل الغرفة:**
```typescript
const subscribeToRoom = async (roomId: string) => {
  currentRoomId.value = roomId;
  
  if (useRealtime) {
    // Realtime Database
    const unsubscribe = subscribeToRealtimeData(
      `chats/rooms/${roomId}/messages`,
      (data) => {
        // تحويل البيانات من كائن إلى مصفوفة
        const messagesArray = Object.entries(data).map(([id, messageData]) => ({
          id,
          ...messageData,
          createdAt: new Date(messageData.createdAt),
          updatedAt: new Date(messageData.updatedAt)
        }));
        
        // ترتيب حسب الوقت
        messagesArray.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        
        // تحديث الحالة
        messages.value = messagesArray;
      }
    );
    
    unsubscribeFunctions.value.push(unsubscribe);
  } else {
    // Firestore
    const unsubscribe = subscribeToCollection(
      `chats/rooms/${roomId}/messages`,
      (snapshot) => {
        const messagesArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        messages.value = messagesArray;
      },
      {
        orderBy: [['createdAt', 'asc']] // ترتيب تصاعدي
      }
    );
    
    unsubscribeFunctions.value.push(unsubscribe);
  }
};
```

#### مثال عملي كامل:

```typescript
import { useFirebaseChat } from './useFirebaseChat';

const chat = useFirebaseChat({
  config: firebaseConfig,
  useRealtime: false, // استخدام Firestore
  collectionName: 'chats',
  onNewMessage: (message) => {
    console.log('رسالة جديدة:', message);
    // تشغيل صوت
    playNotificationSound();
  }
});

// تهيئة
chat.initializeFirebase();
await chat.signInAnonymouslyUser();

// إنشاء غرفة
const roomId = await chat.createRoom(
  ['user1', 'user2'],
  'غرفة المحادثة'
);

// الاشتراك في الغرفة
await chat.subscribeToRoom(roomId);

// إرسال رسالة مع Optimistic Update
await chat.sendMessageOptimistic(roomId, 'مرحباً!');

// إرسال ملف
await chat.sendMessageOptimistic(
  roomId,
  'ملف مرفق',
  'attachment',
  [{
    fileName: 'document.pdf',
    type: 'application/pdf',
    url: 'https://example.com/file.pdf',
    size: 1024000
  }]
);
```

---

### 4. `useFirebaseNotifications.ts` - شرح مفصل

#### الغرض من الملف:
يوفر نظام إشعارات كامل مع دعم Push Notifications وعداد الإشعارات غير المقروءة.

#### كيف يعمل:

**1. إنشاء إشعار:**
```typescript
const createNotification = async (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  userId?: string
) => {
  const notificationData = {
    title,
    message,
    type,
    userId: userId || getCurrentUserId(), // إذا لم يُحدد، يستخدم المستخدم الحالي
    read: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  if (useRealtime) {
    const notificationId = await pushRealtimeData('notifications', notificationData);
  } else {
    const docRef = await addDocument('notifications', notificationData);
    const notificationId = docRef.id;
  }
  
  return notificationId;
};
```

**2. تمييز إشعار كمقروء:**
```typescript
const markAsRead = async (notificationId: string) => {
  // تحديث في قاعدة البيانات
  if (useRealtime) {
    await updateRealtimeData(`notifications/${notificationId}`, {
      read: true,
      updatedAt: new Date()
    });
  } else {
    await updateDocument('notifications', notificationId, {
      read: true,
      updatedAt: new Date()
    });
  }
  
  // تحديث الحالة المحلية
  const notification = notifications.value.find(n => n.id === notificationId);
  if (notification && !notification.read) {
    notification.read = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  }
};
```

**3. الاشتراك في إشعارات المستخدم:**
```typescript
const subscribeToUserNotifications = async () => {
  const currentUserId = getCurrentUserId();
  
  if (useRealtime) {
    const unsubscribe = subscribeToRealtimeData(
      'notifications',
      (data) => {
        // تصفية الإشعارات الخاصة بالمستخدم فقط
        const notificationsArray = Object.entries(data)
          .filter(([_, notificationData]) => 
            notificationData.userId === currentUserId
          )
          .map(([id, notificationData]) => ({
            id,
            ...notificationData,
            createdAt: new Date(notificationData.createdAt)
          }));
        
        // ترتيب حسب التاريخ (الأحدث أولاً)
        notificationsArray.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
        
        notifications.value = notificationsArray;
        updateUnreadCount(); // تحديث العداد
      }
    );
    
    unsubscribeFunctions.value.push(unsubscribe);
  } else {
    // Firestore مع فلتر
    const unsubscribe = subscribeToCollection(
      'notifications',
      (snapshot) => {
        const notificationsArray = snapshot.docs
          .filter(doc => doc.data().userId === currentUserId)
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          }));
        
        notifications.value = notificationsArray;
        updateUnreadCount();
      },
      {
        where: [['userId', '==', currentUserId]],
        orderBy: [['createdAt', 'desc']]
      }
    );
    
    unsubscribeFunctions.value.push(unsubscribe);
  }
};
```

**4. تحديث عداد الإشعارات غير المقروءة:**
```typescript
const updateUnreadCount = () => {
  // حساب عدد الإشعارات غير المقروءة
  unreadCount.value = notifications.value.filter(n => !n.read).length;
};
```

**5. Push Notifications:**
```typescript
const initializePushNotifications = async () => {
  // 1. طلب إذن الإشعارات
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    // 2. الحصول على token
    const token = await getToken(messaging.value, {
      vapidKey: options.messagingConfig?.vapidKey
    });
    
    console.log('Push token:', token);
    // 3. إرسال token للسيرفر لحفظه
    return token;
  } else {
    throw new Error('Notification permission denied');
  }
};

// الاشتراك في استقبال الرسائل
const subscribeToPushMessages = (callback: Function) => {
  return onMessage(messaging.value, (payload) => {
    // استدعاء callback عند استلام رسالة push
    callback(payload);
    
    // يمكن إضافة الإشعار إلى القائمة المحلية
    addNotification({
      id: payload.messageId || Date.now().toString(),
      title: payload.notification?.title || 'إشعار جديد',
      message: payload.notification?.body || '',
      type: 'info',
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
};
```

#### مثال عملي كامل:

```typescript
import { useFirebaseNotifications } from './useFirebaseNotifications';

const notifications = useFirebaseNotifications({
  config: firebaseConfig,
  useRealtime: false,
  collectionName: 'notifications',
  onNewNotification: (notification) => {
    console.log('إشعار جديد:', notification);
    // إظهار toast notification
    showToast(notification.title, notification.message);
  }
});

// تهيئة
notifications.initializeFirebase();
await notifications.signInAnonymouslyUser();

// الاشتراك في الإشعارات
await notifications.subscribeToUserNotifications();

// تهيئة Push Notifications
const token = await notifications.initializePushNotifications();
// إرسال token للسيرفر
await saveTokenToServer(token);

// الاشتراك في Push Messages
notifications.subscribeToPushMessages((payload) => {
  console.log('رسالة push:', payload);
});

// إنشاء إشعار
await notifications.createNotification(
  'مرحباً',
  'هذا إشعار تجريبي',
  'info'
);

// تمييز كمقروء
await notifications.markAsRead(notificationId);

// الحصول على الإشعارات غير المقروءة
const unread = notifications.getUnreadNotifications();
console.log('غير مقروء:', unread.length);
```

---

### 5. `useFirebaseExample.ts` - شرح مفصل

#### الغرض من الملف:
يوفر مثال كامل يوضح كيفية استخدام جميع Composables معاً في مشروع حقيقي. يعمل كـ wrapper يجمع جميع الوظائف في مكان واحد.

#### كيف يعمل:

**1. تهيئة Composables:**
```typescript
export const useFirebaseExample = () => {
  // تكوين Firebase
  const firebaseConfig: FirebaseConfig = {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    // ... باقي التكوين
  };
  
  // تهيئة Chat Composable
  const chatFirebase = useFirebaseChat({
    config: firebaseConfig,
    useRealtime: false,
    collectionName: 'chats',
    onNewMessage: (message) => {
      console.log('رسالة جديدة:', message);
    }
  });
  
  // تهيئة Notifications Composable
  const notificationFirebase = useFirebaseNotifications({
    config: firebaseConfig,
    useRealtime: false,
    collectionName: 'notifications',
    onNewNotification: (notification) => {
      console.log('إشعار جديد:', notification);
    }
  });
  
  // ... باقي الكود
};
```

**2. وظائف مساعدة للمحادثات:**
```typescript
const initializeChat = async () => {
  // 1. تهيئة Firebase
  chatFirebase.initializeFirebase();
  
  // 2. انتظار قليل للاتصال
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 3. الاشتراك في غرف المستخدم
  await chatFirebase.subscribeToUserRooms();
  
  console.log('تم تهيئة المحادثات بنجاح');
};

const sendChatMessage = async (roomId: string, messageText: string) => {
  // استخدام sendMessageOptimistic للسرعة
  const messageId = await chatFirebase.sendMessageOptimistic(
    roomId,
    messageText
  );
  return messageId;
};
```

**3. وظائف مساعدة للإشعارات:**
```typescript
const initializeNotifications = async () => {
  // 1. تهيئة Firebase
  notificationFirebase.initializeFirebase();
  
  // 2. انتظار قليل
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 3. الاشتراك في إشعارات المستخدم
  await notificationFirebase.subscribeToUserNotifications();
  
  // 4. تهيئة Push Notifications
  await notificationFirebase.initializePushNotifications();
  
  console.log('تم تهيئة الإشعارات بنجاح');
};
```

**4. إرجاع جميع القيم والوظائف:**
```typescript
return {
  // حالة المحادثات
  chatMessages: chatFirebase.messages,
  chatRooms: chatFirebase.rooms,
  chatConnected: chatFirebase.isAuthenticated,
  
  // حالة الإشعارات
  notifications: notificationFirebase.notifications,
  unreadCount: notificationFirebase.unreadCount,
  
  // حالة المستخدم
  currentUser: chatFirebase.currentUser,
  
  // وظائف المحادثات
  initializeChat,
  joinChatRoom,
  sendChatMessage,
  
  // وظائف الإشعارات
  initializeNotifications,
  createNotification,
  markNotificationAsRead,
  
  // وظائف المصادقة
  signInAnonymously,
  signInWithEmail,
  signOut,
  
  // وظائف التنظيف
  cleanupAll
};
```

#### مثال عملي كامل في Vue Component:

```vue
<template>
  <div>
    <!-- حالة الاتصال -->
    <div v-if="chatLoading">جاري التحميل...</div>
    <div v-else-if="chatConnected">متصل ✅</div>
    <div v-else>غير متصل ❌</div>
    
    <!-- غرف المحادثة -->
    <div class="rooms">
      <div 
        v-for="room in chatRooms" 
        :key="room.id"
        @click="joinRoom(room.id)"
        :class="{ active: chatCurrentRoom === room.id }"
      >
        {{ room.name || `غرفة ${room.id}` }}
        <span v-if="room.lastMessage">
          {{ room.lastMessage.body }}
        </span>
      </div>
    </div>
    
    <!-- الرسائل -->
    <div class="messages">
      <div 
        v-for="message in chatMessages" 
        :key="message.id"
        :class="{ temp: message.isTemp }"
      >
        <strong>{{ message.senderName }}:</strong>
        {{ message.body }}
        <span v-if="message.isTemp" class="sending">جاري الإرسال...</span>
      </div>
    </div>
    
    <!-- إرسال رسالة -->
    <div class="send-message">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="اكتب رسالة..."
      />
      <button @click="sendMessage">إرسال</button>
    </div>
    
    <!-- الإشعارات -->
    <div class="notifications">
      <div class="header">
        <h3>الإشعارات</h3>
        <span class="badge">{{ unreadCount }}</span>
        <button @click="markAllAsRead">تمييز الكل كمقروء</button>
      </div>
      
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="{ unread: !notification.read }"
      >
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
  </div>
</template>

<script setup>
import { useFirebaseExample } from '@/composables/useFirebaseExample';

const {
  // الحالة
  chatMessages,
  chatRooms,
  chatCurrentRoom,
  chatConnected,
  chatLoading,
  notifications,
  unreadCount,
  currentUser,
  
  // الوظائف
  initializeChat,
  joinChatRoom,
  sendChatMessage,
  initializeNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  signInAnonymously,
  cleanupAll
} = useFirebaseExample();

const newMessage = ref('');
const selectedRoomId = ref('');

// تهيئة عند تحميل المكون
onMounted(async () => {
  try {
    // 1. تسجيل الدخول
    await signInAnonymously();
    
    // 2. تهيئة المحادثات والإشعارات معاً
    await Promise.all([
      initializeChat(),
      initializeNotifications()
    ]);
    
    console.log('تم التهيئة بنجاح');
  } catch (error) {
    console.error('خطأ في التهيئة:', error);
  }
});

// الانضمام لغرفة
const joinRoom = async (roomId: string) => {
  selectedRoomId.value = roomId;
  await joinChatRoom(roomId);
};

// إرسال رسالة
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedRoomId.value) return;
  
  try {
    await sendChatMessage(selectedRoomId.value, newMessage.value);
    newMessage.value = ''; // مسح الحقل
  } catch (error) {
    console.error('خطأ في إرسال الرسالة:', error);
  }
};

// تمييز إشعار كمقروء
const markAsRead = async (notificationId: string) => {
  await markNotificationAsRead(notificationId);
};

// تمييز الكل كمقروء
const markAllAsRead = async () => {
  await markAllNotificationsAsRead();
};

// تنظيف عند إغلاق المكون
onUnmounted(() => {
  cleanupAll();
});
</script>
```

---

## 🚀 كيفية الاستخدام

### الخطوة 1: تثبيت Firebase
```bash
npm install firebase
```

### الخطوة 2: نسخ الملفات
انسخ جميع الملفات من مجلد `composables` إلى مشروعك.

### الخطوة 3: تعديل التكوين
في ملف `useFirebaseExample.ts` أو في ملف التكوين الخاص بك:

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

### الخطوة 4: الاستخدام في المكون

```vue
<template>
  <div>
    <!-- حالة الاتصال -->
    <div class="connection-status">
      <span :class="chatConnected ? 'connected' : 'disconnected'">
        {{ chatConnected ? 'متصل' : 'غير متصل' }}
      </span>
    </div>

    <!-- غرف المحادثة -->
    <div class="chat-rooms">
      <div v-for="room in chatRooms" :key="room.id" class="room" @click="joinRoom(room.id)">
        {{ room.name || `غرفة ${room.id}` }}
      </div>
    </div>

    <!-- الرسائل -->
    <div class="messages">
      <div v-for="message in chatMessages" :key="message.id" class="message">
        <strong>{{ message.senderName }}:</strong> {{ message.body }}
      </div>
    </div>

    <!-- إرسال رسالة -->
    <div class="send-message">
      <input v-model="newMessage" placeholder="اكتب رسالة..." />
      <button @click="sendMessage">إرسال</button>
    </div>

    <!-- الإشعارات -->
    <div class="notifications">
      <div v-for="notification in notifications" :key="notification.id" class="notification">
        <h4>{{ notification.title }}</h4>
        <p>{{ notification.message }}</p>
        <button @click="markAsRead(notification.id)">تمييز كمقروء</button>
      </div>
      <span class="unread-count">{{ unreadCount }}</span>
    </div>
  </div>
</template>

<script setup>
import { useFirebaseExample } from '@/composables/useFirebaseExample';

const {
  chatMessages,
  chatRooms,
  notifications,
  unreadCount,
  currentUser,
  chatConnected,
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

// تمييز إشعار كمقروء
const markAsRead = async (notificationId: string) => {
  try {
    await markNotificationAsRead(notificationId);
  } catch (error) {
    console.error('خطأ في تمييز الإشعار كمقروء:', error);
  }
};

// تنظيف عند إغلاق المكون
onUnmounted(() => {
  cleanupAll();
});
</script>
```

## 🔧 التخصيص

### اختيار نوع قاعدة البيانات
```typescript
const chatFirebase = useFirebaseChat({
  config: firebaseConfig,
  useRealtime: false, // true للـ Realtime Database، false للـ Firestore
  collectionName: 'chats', // يمكن تغييرها
  // ...
});
```

### تغيير أسماء المجموعات
```typescript
const notificationFirebase = useFirebaseNotifications({
  config: firebaseConfig,
  collectionName: 'notifications', // يمكن تغييرها
  // ...
});
```

### إضافة معالجات الأحداث
```typescript
const chatFirebase = useFirebaseChat({
  config: firebaseConfig,
  onNewMessage: (message) => {
    // منطق مخصص عند استلام رسالة جديدة
    console.log('رسالة جديدة:', message);
    // يمكن إضافة صوت أو إشعار هنا
  },
  onMessageError: (error) => {
    // منطق مخصص عند حدوث خطأ
    console.error('خطأ في الرسالة:', error);
  },
  // ...
});
```

## 📋 الميزات

### المحادثات
- ✅ رسائل فورية
- ✅ رسائل مؤقتة (Optimistic Updates)
- ✅ إرسال ملفات
- ✅ إدارة الغرف
- ✅ إدارة الأخطاء
- ✅ تنظيف الموارد
- ✅ دعم Firestore و Realtime Database

### الإشعارات
- ✅ إشعارات فورية
- ✅ عداد الإشعارات غير المقروءة
- ✅ تمييز الإشعارات كمقروءة
- ✅ تصفية الإشعارات حسب النوع
- ✅ إدارة الإشعارات
- ✅ Push Notifications
- ✅ دعم Firestore و Realtime Database

### المصادقة
- ✅ تسجيل دخول مجهول
- ✅ تسجيل دخول بالبريد الإلكتروني
- ✅ إدارة حالة المستخدم
- ✅ تسجيل الخروج

### عام
- ✅ إدارة الاتصال
- ✅ معالجة الأخطاء
- ✅ تنظيف الذاكرة
- ✅ قابلية التخصيص
- ✅ TypeScript support
- ✅ دعم جميع خدمات Firebase

## 🛠️ المتطلبات

- Nuxt.js 3.x
- Vue 3.x
- firebase

## 📝 ملاحظات

1. تأكد من إعداد مشروع Firebase في Firebase Console
2. تأكد من تفعيل الخدمات المطلوبة (Authentication, Firestore/Realtime Database, Messaging)
3. استخدم قواعد الأمان المناسبة في Firestore/Realtime Database
4. قم بتنظيف الموارد عند إغلاق المكونات

## 🔥 خدمات Firebase المدعومة

### Authentication
- تسجيل دخول مجهول
- تسجيل دخول بالبريد الإلكتروني
- إدارة حالة المستخدم

### Firestore
- إضافة/تحديث/حذف المستندات
- الاشتراك في التغييرات
- الاستعلامات مع الفلاتر والترتيب

### Realtime Database
- إضافة/تحديث/حذف البيانات
- الاشتراك في التغييرات
- إدارة المسارات

### Cloud Messaging
- Push Notifications
- إدارة الأذونات
- استقبال الرسائل

## 🤝 المساهمة

يمكنك تخصيص هذه Composables حسب احتياجات مشروعك وإضافة ميزات جديدة. 