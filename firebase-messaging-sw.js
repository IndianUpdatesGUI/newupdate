// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCgtGqEp7V8LAXtqyO3Ac2JZ4l8ESS4tjw",
  authDomain: "liveupdatepvtltd.firebaseapp.com",
  projectId: "liveupdatepvtltd",
  storageBucket: "liveupdatepvtltd.appspot.com",
  messagingSenderId: "930997114628",
  appId: "1:930997114628:web:29f886eedfd660c866e251"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png'
  });
});

