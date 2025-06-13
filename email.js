document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("1ch1m_pa1yt65kcbk"); // ✅ NEW USER ID

  let lastSelected = {
    person1: null,
    person2: null
  };

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";
      const selectedStatus = this.value;

      lastSelected[person] = selectedStatus;

      const emojiMap = {
        "AL": "🟢",
        "DG": "🔴",
        "Not AL": "🔵",
        "SL": "🟡",
        "WAT": "🔔"
      };

      const message = `${emojiMap[selectedStatus] || ""} ${personLabel} selected ${selectedStatus}`;

      emailjs.send("service_66oz5wv", "template_ilit6e7", {
        message: message
      })
      .then(() => console.log("✅ Email sent"))
      .catch(error => console.error("❌ Email failed:", error));
    });
  });

  // NOTIFY buttons
  document.querySelectorAll(".notify-button").forEach(button => {
    button.addEventListener("click", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";
      const selectedStatus = lastSelected[person];

      if (!selectedStatus) return;

      const emojiMap = {
        "AL": "🟢",
        "DG": "🔴",
        "Not AL": "🔵",
        "SL": "🟡",
        "WAT": "🔔"
      };

      const message = `${emojiMap[selectedStatus] || ""} ${personLabel} selected ${selectedStatus}`;

      emailjs.send("service_66oz5wv", "template_ilit6e7", {
        message: message
      })
      .then(() => console.log("✅ NOTIFY Email sent"))
      .catch(error => console.error("❌ NOTIFY Email failed:", error));
    });
  });

  // WAT button
  document.querySelectorAll(".wat-button").forEach(button => {
    button.addEventListener("click", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";

      const isActive = this.classList.toggle("active");

      if (isActive) {
        const message = `🔔⏰ ${personLabel} selected WAT`;

        lastSelected[person] = "WAT"; // save for notify too

        emailjs.send("service_66oz5wv", "template_ilit6e7", {
          message: message
        })
        .then(() => console.log("✅ WAT Email sent"))
        .catch(error => console.error("❌ WAT Email failed:", error));
      }
    });
  });
});
