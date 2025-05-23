const API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Ako si na index.html
  if (document.getElementById("loginForm")) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showRegister = document.getElementById("showRegister");

    showRegister.addEventListener("click", () => {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
    });

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "chat.html";
      } else {
        alert(data.error || "Login failed");
      }
    });

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! You can now log in.");
        window.location.reload();
      } else {
        alert(data.error || "Registration failed");
      }
    });
  }

  // Ako si na chat.html
  if (document.getElementById("chatForm")) {
    const chatBox = document.getElementById("chatBox");
    const chatForm = document.getElementById("chatForm");
    const userMessage = document.getElementById("userMessage");

    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = userMessage.value;
      appendMessage("You", message, "user");

      const res = await fetch(`${API_BASE}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      appendMessage("AI", data.response, "ai");
      userMessage.value = "";
    });
  }
});

function appendMessage(sender, text, className) {
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.textContent = `${sender}: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
