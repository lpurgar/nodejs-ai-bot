const API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // index.html
    if (document.getElementById("loginForm")) {
        const loginForm = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");
        const showRegister = document.getElementById("showRegister");
        const showLogin = document.getElementById("showLogin");

        showRegister.addEventListener("click", () => {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
        });

        showLogin.addEventListener("click", () => {
            registerForm.style.display = "none";
            loginForm.style.display = "block";
        });

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                window.location.href = "chat.html";
            } else {
                alert(data.error || "Login failed");
            }
        });

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const firstName = document.getElementById("fname").value;
            const lastName = document.getElementById("lname").value;
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;

            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
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

    // chat.html
    if (document.getElementById("chatForm")) {
        const chatBox = document.getElementById("chatBox");
        const chatForm = document.getElementById("chatForm");
        const userMessage = document.getElementById("userMessage");

        if (role === "ADMIN") {
            const userMgmtBtn = document.getElementById("userManagementBtn");
            userMgmtBtn.style.display = "inline-block";

            userMgmtBtn.addEventListener("click", () => {
                window.location.href = "users.html";
            });
        }

        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const message = userMessage.value;
            appendMessage("You", message, "user");
            const title = message.split(" ").slice(0, 3).join(" ");

            const existingConversation = await fetch(
                `${API_BASE}/conversation/latest`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            let conversation = await existingConversation.json();

            if (conversation.data === null) {
                console.log("in");
                const newConversation = await fetch(
                    `${API_BASE}/conversation`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ title }),
                    }
                );
                conversation = await newConversation.json();
            }

            console.log("out", conversation);

            const res = await fetch(`${API_BASE}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    conversationId: conversation.data.id,
                    content: message,
                }),
            });

            const data = await res.json();
            appendMessage("AI", data.aiMessage.content, "ai");
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