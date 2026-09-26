async function loginUser(email, password) {
    return await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({email, password})
    });
}

async function registerUser(name, email, password) {
    return await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({name, email, password})
    });
}

async function logoutUser() {
    return await apiRequest("/auth/logout", {
        method: "POST"
    });
}

async function getCurrentUser() {
    return await apiRequest("/auth/me", {
        method: "GET"
    });
}

async function handleLogout(event) {
    event.preventDefault();

    try {
        await logoutUser();
        window.location.href = "login.html";
    } catch (error) {
        showNotification(error.message, "error");
    }
}

const logoutButton = document.querySelector("#logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
}
