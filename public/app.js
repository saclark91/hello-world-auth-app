const API_URL = 'https://hello-world-auth-app-fdcvgxb9dhf7hvd2.eastus2-01.azurewebsites.net/api/auth';

// Register a new user
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => alert("Error: " + error));
}

// Login existing user
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", email);
            window.location.href = "welcome.html";
        } else {
            alert("Login failed: " + data);
        }
    })
    .catch(error => alert("Error: " + error));
}

// Display the welcome message with the user's email
function displayWelcomeMessage() {
    const email = localStorage.getItem("email");
    document.getElementById("welcome-message").innerText = `Welcome, ${email}!`;
}

// Logout function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "index.html";
}

// Automatically display welcome message if on welcome page
if (window.location.pathname.endsWith("welcome.html")) {
    displayWelcomeMessage();
}
