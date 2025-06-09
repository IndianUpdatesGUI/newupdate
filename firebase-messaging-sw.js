// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

// 🔐 Your Firebase Project Configuration
firebase.initializeApp({
  apiKey: "AIzaSyCgtGqEp7V8LAXtqyO3Ac2JZ4l8ESS4tjw",
  authDomain: "liveupdatepvtltd.firebaseapp.com",
  projectId: "liveupdatepvtltd",
  storageBucket: "liveupdatepvtltd.appspot.com",


  messagingSenderId: "930997114628",
  appId:"1:930997114628:web:29f886eedfd660c866e251",
});

// 🔔 Initialize messaging
const messaging = firebase.messaging();

// 📩 Listen for background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('📨 Received background message ', payload);
  self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://ephemeral-bonbon-45e29e.netlify.app/') // Replace with your app URL or route
  );
});


  const notificationTitle = payload.notification?.title || "New Notification!";
const notificationOptions = {
  body: payload.notification?.body || "You have a new message.",
  icon: '/icon.png',
};


  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log("🔔 Notification clicked");
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow)
        return clients.openWindow('/');
    })
  );
});

messaging.onBackgroundMessage(function(payload) {
  console.log('📩 Received background message ', payload);

  // Check payload structure
  const notificationTitle = payload.data?.title || 'New message!';
  const notificationOptions = {
    body: payload.data?.body || 'You have a notification.',
    icon: '/icon.png',
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});


