document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "index.html";

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const errorEl = document.getElementById("loginError");

            const result = AmazonStore.loginUser(email, password);
            if (result.success) {
                window.location.href = redirect;
            } else {
                errorEl.textContent = result.message;
            }
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirm = document.getElementById("confirmPassword").value;
            const errorEl = document.getElementById("registerError");

            if (password !== confirm) {
                errorEl.textContent = "Passwords do not match.";
                return;
            }

            if (password.length < 6) {
                errorEl.textContent = "Password must be at least 6 characters.";
                return;
            }

            const result = AmazonStore.registerUser({ name, email, password });
            if (result.success) {
                AmazonStore.loginUser(email, password);
                window.location.href = "index.html";
            } else {
                errorEl.textContent = result.message;
            }
        });
    }
});
