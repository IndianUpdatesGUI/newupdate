// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

// 🔐 Your Firebase Project Configuration
firebase.initializeApp({
  apiKey: "AIzaSyCgtGqEp7V8LAXtqyO3Ac2JZ4l8ESS4tjw",
  authDomain: "liveupdatepvtltd.firebaseapp.com",
  projectId: "liveupdatepvtltd",
  storageBucket: "liveupdatepvtltd.firebasestorage.app",
  messagingSenderId: "930997114628",
  appId:"1:930997114628:web:29f886eedfd660c866e251",
});

// 🔔 Initialize messaging
const messaging = firebase.messaging();

// 📩 Listen for background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('📨 Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png', // Optional: path to icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
