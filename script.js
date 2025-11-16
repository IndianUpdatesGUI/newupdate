

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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
