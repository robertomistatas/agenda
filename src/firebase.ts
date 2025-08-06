// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCS9fF81NIw-w6KecO6jefZUMOZQBFNFxU",
  authDomain: "agenda-f1799.firebaseapp.com",
  projectId: "agenda-f1799",
  storageBucket: "agenda-f1799.firebasestorage.app",
  messagingSenderId: "210697546824",
  appId: "1:210697546824:web:6b41e48f381c949790bc7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Cloud Messaging (only if supported)
let messaging: any = null;

const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      console.log('Firebase Messaging initialized successfully');
    } else {
      console.log('Firebase Messaging not supported in this environment');
    }
  } catch (error) {
    console.log('Error initializing Firebase Messaging:', error);
  }
};

// Initialize messaging
initializeMessaging();

// VAPID key for push notifications - Obtén tu clave en Firebase Console > Project Settings > Cloud Messaging
const VAPID_KEY = "BLuosnrH3h1VkefWciI-sp_c7TqxSgzFQzjOJTfpHP2HTkoG9gnD6NqhtKs_lBwg9-hf3HLfPmPxcGA8YwTUw"; 

// Request permission for notifications and get registration token
export const requestNotificationPermission = async () => {
  console.log('Requesting notification permission...');
  
  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  // Check if messaging is available
  if (!messaging) {
    console.log('Firebase Messaging not available');
    return null;
  }
  
  try {
    // Request permission
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      try {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        console.log('FCM Registration token:', token);
        
        // Store token for the user (you can save this to Firestore)
        if (token) {
          console.log('✅ Push notifications enabled successfully');
          return token;
        } else {
          console.log('❌ Failed to get FCM token');
          return null;
        }
      } catch (tokenError: any) {
        console.error('Error getting FCM token:', tokenError);
        if (tokenError?.code === 'messaging/invalid-vapid-key') {
          console.error('❌ Invalid VAPID key. Please check your Firebase Console.');
        }
        return null;
      }
    } else if (permission === 'denied') {
      console.log('❌ Notification permission denied by user');
      return null;
    } else {
      console.log('⏳ Notification permission not granted yet');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = (): Promise<any> =>
  new Promise((resolve) => {
    if (!messaging) {
      resolve(null);
      return;
    }
    
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      resolve(payload);
    });
  });

export { app };
