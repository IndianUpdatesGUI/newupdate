document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("dHZgHupkRY9hnhat5");

  let lastSelected = {
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

  // Handle radio buttons (AL, DG, SL, Not AL)
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";
      const selectedStatus = this.value;

      lastSelected[person] = selectedStatus;

      const emoji = emojiMap[selectedStatus] || "";
const message = `${emoji} ${personLabel} selected ${selectedStatus} ${emoji}`;

      emailjs.send("service_cnje7ja", "template_wf9h6xg", {
        message: message
      })
      .then(() => console.log("✅ Email sent"))
      .catch(error => console.error("❌ Email failed:", error));
    });
  });

  // Handle NOTIFY button
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


      emailjs.send("service_cnje7ja", "template_wf9h6xg", {
        message: message
      })
      .then(() => {
        console.log("✅ NOTIFY Email sent");

        // Visual feedback
        button.classList.add("clicked");
        button.style.backgroundColor = "#28a745"; // green highlight
        setTimeout(() => {
          button.classList.remove("clicked");
          button.style.backgroundColor = "#f0c14b"; // restore original
        }, 2000);
      })
      .catch(error => console.error("❌ NOTIFY Email failed:", error));
    });
  });

  // Handle WAT toggle button
  document.querySelectorAll(".wat-button").forEach(button => {
    button.addEventListener("click", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";

      const isActive = this.classList.toggle("active");

      if (isActive) {
        const message = `🔔⏰ ${personLabel} selected WAT`;

        lastSelected[person] = "WAT"; // update last for notify as well

        emailjs.send("service_cnje7ja", "template_wf9h6xg", {
          message: message
        })
        .then(() => console.log("✅ WAT Email sent"))
        .catch(error => console.error("❌ WAT Email failed:", error));
      }
    });
  });
});
