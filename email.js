// ✅ Load EmailJS after SDK is ready
window.addEventListener("DOMContentLoaded", function () {
  // Initialize EmailJS with your new public key
  emailjs.init("dHZgHupkRY9hnhat5");

  // ✅ Attach email sending to every radio button
 document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener("change", function () {
    const column = this.closest(".column");
    const personId = column?.id || "";
    const personLabel = personId === "person1-box" ? "Semester 1" : "Semester 2";
    const selectedStatus = this.value;

    const message = `${personLabel} selected: ${selectedStatus}`;

    emailjs.send("service_cnje7ja", "template_wf9h6xg", {
      message: message
    })
    .then(function (response) {
      console.log("✅ Email sent:", message);
      alert("✅ Notification Sent: " + message);
    }, function (error) {
      console.error("❌ Failed to send email:", error);
      alert("❌ Failed to send: " + error.text);
    });
  });
});
