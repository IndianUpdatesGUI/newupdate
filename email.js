document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("dHZgHupkRY9hnhat5");

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "Semester 1" : "Semester 2";
      const selectedStatus = this.value;

      const message = `${personLabel} selected: ${selectedStatus}`;

      emailjs.send("service_cnje7ja", "template_wf9h6xg", {
        message: message
      })
      .then(() => alert("✅ Sent: " + message))
      .catch(error => alert("❌ Failed: " + error.text));
    });
  });
});
