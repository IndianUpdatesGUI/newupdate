document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("dHZgHupkRY9hnhat5");

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", function () {
      const parent = this.closest(".person-box");
      const person = parent?.dataset.person;
      const personLabel = person === "person1" ? "👨‍🎓 Semester 1" : "👩‍🎓 Semester 2";
      const selectedStatus = this.value;

      // Choose emoji based on status
      let statusEmoji = "";
      switch (selectedStatus) {
        case "AL":
          statusEmoji = "🟢";
          break;
        case "DG":
          statusEmoji = "🔴";
          break;
        case "Not AL":
          statusEmoji = "🔵";
          break;
        case "SL":
          statusEmoji = "🟡";
          break;
        default:
          statusEmoji = "ℹ️";
      }

      // Final message with emoji
      const message = `${personLabel} selected ${selectedStatus} ${statusEmoji}`;

      emailjs.send("service_cnje7ja", "template_wf9h6xg", {
        message: message
      })
      .then(() => console.log("✅ Email sent"))
      .catch(error => console.error("❌ Email failed:", error));
    });
  });
});
