import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, update, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCgtGqEp7V8LAXtqyO3Ac2JZ4l8ESS4tjw",
  authDomain: "liveupdatepvtltd.firebaseapp.com",
  databaseURL: "https://liveupdatepvtltd-default-rtdb.firebaseio.com",
  projectId: "liveupdatepvtltd",
  storageBucket: "liveupdatepvtltd.appspot.com",
  messagingSenderId: "930997114628",
  appId: "1:930997114628:web:29f886eedfd660c866e251",
  measurementId: "G-0D35D4KT1D"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Register service worker (so mobile can show system notifications) ---
let swRegistration = null;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      console.log('Service Worker registered at /sw.js', reg);
      swRegistration = reg;
    })
    .catch(err => {
      console.warn('Service Worker registration failed:', err);
    });
} else {
  console.log('Service Worker not supported in this browser.');
}


// Utility function to get current time
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

//main 

// MAIN STATUS radio buttons
function setStatus(person, value) {
  const timestamp = getCurrentTime();
  const updates = {};
  updates[`/status/${person}/main_status`] = { value, time: timestamp };
  update(ref(db), updates);
}

// WAT checkbox
function setWatStatus(person, isChecked) {
  const timestamp = getCurrentTime();
  const updates = {};
  updates[`/status/${person}/wat_status`] = { value: isChecked, time: timestamp };
  update(ref(db), updates);
}

// Update card color
function updateBoxColor(person, status) {
  const box = document.getElementById(`${person}-box`);
  switch (status) {
    case 'AL': box.style.backgroundColor = 'rgba(0, 128, 0, 0.8)'; break;
    case 'Not AL': box.style.backgroundColor = 'rgba(0, 0, 255, 0.8)'; break;
    case 'DG': box.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'; break;
    case 'SL': box.style.backgroundColor = 'rgba(255, 255, 0, 0.8)'; break;
    default: box.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  }
}

// Listen for changes
function setupRealtime() {
  ['person1', 'person2'].forEach(person => {
    const statusRef = ref(db, `status/${person}`);
    onValue(statusRef, snapshot => {
      const data = snapshot.val();
      if (!data) return;

      if (data.main_status) {
        const status = data.main_status.value;
        const time = data.main_status.time || '';
        document.getElementsByName(person).forEach(r => r.checked = (r.value === status));
        updateBoxColor(person, status);
        document.getElementById(`${person}-time`).textContent = `${status} selected at ${time}`;
      }

      if (data.wat_status) {
        const isChecked = data.wat_status.value;
        const time = data.wat_status.time || '';
        const checkboxId = person === 'person1' ? 'wat1' : 'wat2';
        document.getElementById(checkboxId).checked = isChecked;
        document.getElementById(`${person}-wat-time`).textContent = isChecked ? `WAT selected at ${time}` : '';
      }
    });
  });
}

// Sync message
function syncMessage(sem) {
  const value = document.getElementById(`msg${sem}`).value;
  const timestamp = getCurrentTime();
  const updates = {};
  updates[`/messages/semester${sem}`] = { value, time: timestamp };
  update(ref(db), updates);
}

// Live listen
function setupMessageRealtime() {
  ['1', '2'].forEach(sem => {
    const msgRef = ref(db, `messages/semester${sem}`);
    onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        document.getElementById(`msg${sem}`).value = data.value || '';
        document.getElementById(`time${sem}`).innerText = data.time ? `at ${data.time}` : '';
      } else {
        document.getElementById(`msg${sem}`).value = '';
        document.getElementById(`time${sem}`).innerText = '';
      }
    });
  });
}

// When user types
function updateTime(sem) {
  syncMessage(sem);
}

// Reset button
function resetBox(sem) {
  const msgRef = ref(db, `/messages/semester${sem}`);
  update(msgRef, { value: '', time: '' });
  document.getElementById(`msg${sem}`).value = '';
  document.getElementById(`time${sem}`).innerText = '';
}

// Run on load
window.onload = function () {
  setupRealtime();
  setupMessageRealtime();

  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
};

// Expose functions
window.setStatus = setStatus;
window.setWatStatus = setWatStatus;
window.updateTime = updateTime;
window.resetBox = resetBox;

// -------------------------------
// Notify button (broadcast to all open clients)
// Paste AFTER your window.setStatus / window.resetBox exposures (bottom of script.js)
// -------------------------------

// Set a simple CURRENT_USER id; change manually on the other client or set via dev console
window.CURRENT_USER = window.CURRENT_USER || 'person1'; // change to 'person2' on other client if you want

(function setupClickBroadcastNotifications() {
  const notifyBtn = document.getElementById('notifyBtn');
  if (!notifyBtn) {
    console.warn('notifyBtn not found — notifications disabled.');
    return;
  }

  // Ensure browser permissions
  async function ensurePermission() {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.');
      return false;
    }
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') {
      alert('Notifications are blocked for this site. Enable them in browser/site settings.');
      return false;
    }
    const p = await Notification.requestPermission();
    return p === 'granted';
  }

  // Show native notification
  function showNativeNotification(data) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try {
      const n = new Notification(data.title || 'Update', {
        body: data.body || 'Someone clicked notify',
        tag: data.tag || 'broadcast-notify',
        // icon: '/icons/icon-192.png'
      });
      n.onclick = (e) => { e.preventDefault(); window.focus(); n.close(); };
      setTimeout(() => { try { n.close(); } catch(_) {} }, 6000);
    } catch (err) {
      console.error('Notification show error', err);
    }
  }

  // Write a notification record to Firebase
  async function broadcastNotification() {
    const ok = await ensurePermission();
    if (!ok) return;
    const payload = {
      title: 'Manipal Update',
      body: `${window.CURRENT_USER} clicked notify`,
      sender: window.CURRENT_USER,
      createdAt: Date.now()
    };
    push(ref(db, 'notifications'), payload)
      .then(() => console.log('Pushed notification:', payload))
      .catch(err => console.error('Push error', err));
  }

  // Ignore old notifications present before listener started
  const listenerStartTS = Date.now();
  const notificationsRef = ref(db, 'notifications');

  // Listen for new child entries and show notification
  onChildAdded(notificationsRef, (snap) => {
    const data = snap.val();
    if (!data) return;
    if (!data.createdAt || data.createdAt <= listenerStartTS) return;
    // show on all clients (including sender)
    showNativeNotification(data);
  });

  // Hook button
  notifyBtn.addEventListener('click', (e) => { e.preventDefault(); broadcastNotification(); });
})();


// ===== Service-worker-enabled notifications + toast fallback =====
// (Paste this near the bottom of script.js, after your window.* exposures)

window.CURRENT_USER = window.CURRENT_USER || 'person1'; // change on other client to 'person2' if you want

// Simple toast helper (visible on page if system notifications fail)
function showToast(text) {
  let container = document.getElementById('notify-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notify-toast-container';
    Object.assign(container.style, {
      position: 'fixed',
      right: '18px',
      bottom: '18px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-end',
      pointerEvents: 'none'
    });
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.textContent = text;
  Object.assign(t.style, {
    background: 'linear-gradient(90deg,#111827,#1f2937)',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    pointerEvents: 'auto',
    maxWidth: '320px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px'
  });
  container.appendChild(t);
  setTimeout(() => { try { t.remove(); } catch(_) {} }, 5000);
}

// Try to show a system notification. Prefer Service Worker registration on mobile.
async function tryShowSystemNotification(payload) {
  if (!('Notification' in window)) return false;
  // permission flow
  if (Notification.permission === 'denied') return false;
  if (Notification.permission === 'default') {
    const p = await Notification.requestPermission();
    if (p !== 'granted') return false;
  }

  // Prefer service worker (better for Android/Chromium mobile browsers)
  if (swRegistration && typeof swRegistration.showNotification === 'function') {
    try {
      swRegistration.showNotification(payload.title || 'Update', {
        body: payload.body || '',
        tag: payload.tag || 'broadcast-notify',
        data: payload.data || {}
      });
      return true;
    } catch (err) {
      console.error('swRegistration.showNotification error', err);
      // fallthrough to Notification()
    }
  }

  // Fallback to in-page Notification()
  try {
    new Notification(payload.title || 'Update', { body: payload.body || '', tag: payload.tag || 'broadcast-notify' });
    return true;
  } catch (err) {
    console.error('Notification constructor error:', err);
    return false;
  }
}

// Call this to show notification or fallback toast
async function showNotificationOrToast(payload) {
  const ok = await tryShowSystemNotification(payload);
  if (!ok) {
    showToast(`${payload.title || 'Update'} — ${payload.body || ''}`);
  }
}

// Broadcast (push entry to Firebase) — no change here from before
async function broadcastNotification() {
  const payload = {
    title: 'Manipal Update',
    body: `${window.CURRENT_USER} clicked notify`,
    sender: window.CURRENT_USER,
    createdAt: Date.now()
  };
  try {
    await push(ref(db, 'notifications'), payload);
    console.log('Pushed notification:', payload);
  } catch (err) {
    console.error('Push error', err);
    showToast('Failed to push notification (check console).');
  }
}

// Listen for new notifications in DB and show them
const listenerStartTS = Date.now();
const notificationsRef = ref(db, 'notifications');
onChildAdded(notificationsRef, (snap) => {
  const data = snap.val();
  if (!data) return;
  if (!data.createdAt || data.createdAt <= listenerStartTS) return;
  // show via service worker or fallback
  showNotificationOrToast(data);
});

// Hook button (keep the existing notify btn logic)
const notifyBtn = document.getElementById('notifyBtn');
if (notifyBtn) {
  notifyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    broadcastNotification();
  });
} else {
  console.warn('notifyBtn not found — notifications disabled.');
}
