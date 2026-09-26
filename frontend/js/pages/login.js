
const loginForm = document.querySelector("#login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailInput = loginForm.querySelector("#email");
        const passwordInput = loginForm.querySelector("#password");
        const submitButton = loginForm.querySelector("button[type='submit']");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showNotification("Please enter your email and password.", "warning");
            return;
        }

        setButtonLoading(submitButton, true, "Signing in...");

        try {
            await loginUser(email, password);

            showNotification("Login successful.", "success");

            window.location.href = "dashboard.html";

        } catch (error) {
            showNotification(error.message, "error");
        } finally {
            setButtonLoading(submitButton, false);
        }
    });
}