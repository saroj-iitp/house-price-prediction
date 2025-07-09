document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle
  const toggle = document.getElementById("theme-switch");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggle.checked = true;
  }

  toggle?.addEventListener("change", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
  });

  // ChatBot Logic
  const chatIcon = document.getElementById("chat-icon");
  const chatBox = document.getElementById("chat-box");
  const closeChat = document.getElementById("close-chat");
  const sendBtn = document.getElementById("send-btn");
  const inputField = document.getElementById("user-input");
  const chatBody = document.getElementById("chat-body");

  const faqButtons = document.querySelectorAll(".faq-quick-buttons button");
  faqButtons.forEach(button => {
    button.addEventListener("click", () => {
      inputField.value = button.textContent;
      sendMessage();
    });
  });

  chatIcon?.addEventListener("click", () => {
    chatBox.classList.toggle("show");
    chatBox.classList.toggle("hidden");
  });

  closeChat?.addEventListener("click", () => {
    chatBox.classList.add("hidden");
    chatBox.classList.remove("show");
  });

  sendBtn?.addEventListener("click", sendMessage);
  inputField?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    appendMessage("user", text);
    inputField.value = "";

    setTimeout(() => {
      appendMessage("bot", getResponse(text));
    }, 800);
  }

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `${sender}-message message`;
    msg.innerHTML = `${text}<time>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>`;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getResponse(text) {
    text = text.toLowerCase();

    if (text.includes("how to use")) {
      return "Just enter your house details in the form and click 'Predict Price'.";
    }
    if (text.includes("accurate")) {
      return "The predictions are based on real construction data and provide a solid estimate for planning your budget.";
    }
    if (text.includes("data required") || text.includes("what data")) {
      return "You need to enter building area, number of floors, material quality, etc.";
    }
    if (text.includes("multiple cities") || text.includes("city")) {
      return "Currently, it provides average estimates. City-specific predictions will be added in the future.";
    }

    return "Sorry, I didn’t understand that. Please try asking another question.";
  }

  // Breakdown link logic (optional if needed)
  if (typeof calculateTotalFromForm === "function") {
    const total = calculateTotalFromForm(); // your logic here
    const breakdownLink = document.querySelector("#link-to-breakdown");
    if (breakdownLink) {
      breakdownLink.href = `breakdown.html?base=${total}`;
    }
  }

  // ✅ Email form validation
  const emailForm = document.getElementById("email-form");
  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Trigger browser validation UI
      if (!emailForm.checkValidity()) {
        emailForm.reportValidity();
        return;
      }

      // EmailJS send
      emailjs.sendForm('service_xa90k7b', 'template_1f2pzyd', this)
        .then(() => {
          alert("✅ Estimate sent successfully!");
          this.reset();
        })
        .catch((error) => {
          console.error("Email sending failed:", error);
          alert("❌ Failed to send estimate.");
        });
    });
  }

});
