document.addEventListener("DOMContentLoaded", function () {
  const formEndpoint = "https://formspree.io/f/mldnbzvr";

  // Load from localStorage (after refresh)
  const lastSelected = {
    person1: localStorage.getItem("last_person1") || null,
    person2: localStorage.getItem("last_person2") || null
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
      localStorage.setItem(`last_${person}`, selectedStatus); // Save to localStorage

      const message = `${personLabel} selected ${selectedStatus}`;
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

      const message = `${personLabel} selected ${selectedStatus}`;
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

  // WAT toggle button
  document.querySelectorAll(".wat-button").forEach(button => {
    button.addEventListener("click", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";

      const isActive = this.classList.toggle("active");

      if (isActive) {
        const message = `${personLabel} selected WAT`;
        lastSelected[person] = "WAT";
        localStorage.setItem(`last_${person}`, "WAT");
        sendEmail(message);
      }
    });
  });
});
