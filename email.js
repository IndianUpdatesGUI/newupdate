document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("dHZgHupkRY9hnhat5");

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

      // Save the last selected status
      lastSelected[person] = selectedStatus;

      const emojiMap = {
        "AL": "🟢",
        "DG": "🔴",
        "Not AL": "🔵",
        "SL": "🟡",
        "WAT": "🔔"
      };

      const message = `${emojiMap[selectedStatus] || ""} ${personLabel} selected ${selectedStatus}`;

      emailjs.send("service_cnje7ja", "template_wf9h6xg", {
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

    const message = `<b><span style="color: black;">${emojiMap[selectedStatus] || ""} ${personLabel} selected ${selectedStatus}</span></b>`;

    emailjs.send("service_cnje7ja", "template_wf9h6xg", {
      message: message
    })
    .then(() => {
      console.log("✅ NOTIFY Email sent");

      // Visual feedback
      button.classList.add("clicked");
      setTimeout(() => {
        button.classList.remove("clicked");
      }, 2000); // 2 seconds
    })
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

        lastSelected[person] = "WAT"; // store as last for notify too

        emailjs.send("service_cnje7ja", "template_wf9h6xg", {
          message: message
        })
        .then(() => console.log("✅ WAT Email sent"))
        .catch(error => console.error("❌ WAT Email failed:", error));
      }
    });
  });
});
