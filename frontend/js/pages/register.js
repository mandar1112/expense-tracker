
const registerForm = document.querySelector("#register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nameInput = registerForm.querySelector("#name");
        const emailInput = registerForm.querySelector("#email");
        const passwordInput = registerForm.querySelector("#password");
        const confirmPasswordInput = registerForm.querySelector("#confirm-password");
        const submitButton = registerForm.querySelector("button[type='submit']");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!name || !email || !password || !confirmPassword) {
            showNotification("Please fill in all fields.", "warning");
            return;
        }

        if (password !== confirmPassword) {
            showNotification("Passwords do not match.", "warning");
            return;
        }

        setButtonLoading(submitButton, true, "Creating account...");

        try {
            await registerUser(name, email, password);
            showNotification("Account created successfully.", "success");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {
            showNotification(error.message, "error");
        } finally {
            setButtonLoading(submitButton, false);
        }
    });
}