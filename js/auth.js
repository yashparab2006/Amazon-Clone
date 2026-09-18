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
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            // Basic validation
            if (!email || !password) {
                errorEl.textContent = "Please fill in all fields.";
                return;
            }

            if (!isValidEmail(email)) {
                errorEl.textContent = "Please enter a valid email address.";
                return;
            }

            // Add loading state
            submitBtn.classList.add("btn-loading");
            submitBtn.textContent = "Signing in...";
            errorEl.textContent = "";

            const result = AmazonStore.loginUser(email, password);

            submitBtn.classList.remove("btn-loading");
            submitBtn.textContent = "Sign in";

            if (result.success) {
                showToast("Welcome back!");
                setTimeout(() => {
                    window.location.href = redirect;
                }, 500);
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
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            // Basic validation
            if (!name || !email || !password || !confirm) {
                errorEl.textContent = "Please fill in all fields.";
                return;
            }

            if (!isValidEmail(email)) {
                errorEl.textContent = "Please enter a valid email address.";
                return;
            }

            if (password !== confirm) {
                errorEl.textContent = "Passwords do not match.";
                return;
            }

            if (password.length < 6) {
                errorEl.textContent = "Password must be at least 6 characters.";
                return;
            }

            if (!isStrongPassword(password)) {
                errorEl.textContent = "Password should contain at least one letter and one number.";
                return;
            }

            // Add loading state
            submitBtn.classList.add("btn-loading");
            submitBtn.textContent = "Creating account...";
            errorEl.textContent = "";

            const result = AmazonStore.registerUser({ name, email, password });

            submitBtn.classList.remove("btn-loading");
            submitBtn.textContent = "Create your Amazon account";

            if (result.success) {
                AmazonStore.loginUser(email, password);
                showToast("Account created successfully!");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 500);
            } else {
                errorEl.textContent = result.message;
            }
        });
    }

    // Password visibility toggle
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.innerHTML = '<i class="fa-regular fa-eye"></i>';
        toggleBtn.style.cssText = "position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #555;";

        input.parentElement.style.position = "relative";
        input.parentElement.appendChild(toggleBtn);

        toggleBtn.addEventListener("click", () => {
            const type = input.getAttribute("type") === "password" ? "text" : "password";
            input.setAttribute("type", type);
            toggleBtn.innerHTML = type === "password" ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
        });
    });
});

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
}
