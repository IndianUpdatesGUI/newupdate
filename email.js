// ✅ email.js (v4-compatible and working version)
document.addEventListener("DOMContentLoaded", function () {
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

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";
      const selectedStatus = this.value;

      lastSelected[person] = selectedStatus;

      const emoji = emojiMap[selectedStatus] || "";
      const message = `${emoji} ${personLabel} selected ${selectedStatus} ${emoji}`;

      emailjs.send("service_cnje7ja", "template_wf9h6xg", { message })
        .then(() => console.log("✅ Email sent"))
        .catch(err => console.error("❌ Email failed:", err));
    });
  });

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

      emailjs.send("service_cnje7ja", "template_wf9h6xg", { message })
        .then(() => {
          console.log("✅ NOTIFY Email sent");

          // ✅ Animation part
          button.classList.add("clicked");
          button.style.backgroundColor = "#28a745";
          setTimeout(() => {
            button.classList.remove("clicked");
            button.style.backgroundColor = "#f0c14b";
          }, 2000);
        })
        .catch(err => console.error("❌ NOTIFY Email failed:", err));
    });
  });

  document.querySelectorAll(".wat-button").forEach(button => {
    button.addEventListener("click", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";

      const isActive = this.classList.toggle("active");

      if (isActive) {
        const message = `🔔⏰ ${personLabel} selected WAT`;
        lastSelected[person] = "WAT";

        emailjs.send("service_cnje7ja", "template_wf9h6xg", { message })
          .then(() => console.log("✅ WAT Email sent"))
          .catch(err => console.error("❌ WAT Email failed:", err));
      }
    });
  });
});
