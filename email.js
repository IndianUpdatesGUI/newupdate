document.addEventListener("DOMContentLoaded", function () {
  const formEndpoint = "https://formspree.io/f/mldnbzvr";

  const lastSelected = {
    person1: null,
    person2: null
  };

  const emojiMap = {
    "AL": "🟢",
    "DG": "🔴",
    "Not AL": "🔵",
    "SL": "🟡",
    "WAT": "🔔"
  };

  function sendEmail(message) {
    fetch(formEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    })
    .then(response => {
      if (!response.ok) throw new Error("Email failed");
      console.log("✅ Email sent via Formspree");
    })
    .catch(error => {
      console.error("❌ Email failed via Formspree:", error);
    });
  }

  // Radio buttons
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";
      const selectedStatus = this.value;

      lastSelected[person] = selectedStatus;

      const emoji = emojiMap[selectedStatus] || "";
      const message = `${emoji} ${personLabel} selected ${selectedStatus} ${emoji}`;
      sendEmail(message);
    });
  });

  // Notify button
  document.querySelectorAll(".notify-button").forEach(button => {
    button.addEventListener("click", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";
      const selectedStatus = lastSelected[person];

      if (!selectedStatus) {
        alert("No status selected yet to notify.");
        return;
      }

      const emoji = emojiMap[selectedStatus] || "";
      const message = `${emoji} ${personLabel} selected ${selectedStatus} ${emoji}`;
      sendEmail(message);

      // Animation
      button.classList.add("clicked");
      button.style.backgroundColor = "#28a745";
      setTimeout(() => {
        button.classList.remove("clicked");
        button.style.backgroundColor = "#f0c14b";
      }, 2000);
    });
  });

  // WAT toggle
  document.querySelectorAll(".wat-button").forEach(button => {
    button.addEventListener("click", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";

      const isActive = this.classList.toggle("active");

      if (isActive) {
        const message = `🔔⏰ ${personLabel} selected WAT`;
        lastSelected[person] = "WAT";
        sendEmail(message);
      }
    });
  });
});
