// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

// 🔐 Your Firebase Project Configuration
firebase.initializeApp({
  apiKey: "AIzaSyDNH6BsFOyMDNVf-02Qp67zqDwYzfPZKAo",
  authDomain: "live-6404e.firebaseapp.com",
  projectId: "live-6404e",
  storageBucket: "live-6404e.firebasestorage.app",
  messagingSenderId: "1081821552530",
  appId: "1:1081821552530:web:b556b357d958d1fe5d2b4b",
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


