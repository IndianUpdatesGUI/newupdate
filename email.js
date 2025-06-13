function sendEmail() {
  const templateParams = {
    to_name: "User", // Optional: for your template variables
    message: "✅ Semester 1 selected AL" // You can dynamically change this message
  };

  emailjs.send("service_66oz5wv", "template_ilit6e7", templateParams)
    .then(function(response) {
       console.log("✅ SUCCESS!", response.status, response.text);
       alert("✅ Email sent successfully!");
    }, function(error) {
       console.error("❌ FAILED...", error);
       alert("❌ Email failed to send!");
    });
}
