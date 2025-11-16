// sw.js - simple service worker to enable system notifications on mobile/Chromium
self.addEventListener('install', (e) => {
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Take control of pages immediately
  e.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (ev) => {
  ev.notification.close();
  ev.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if ('focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/');
      })
  );
});
