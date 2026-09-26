
const profileElements = {
    form: document.querySelector("#profile-form"),
    name: document.querySelector("#profile-name"),
    email: document.querySelector("#profile-email"),
    phone: document.querySelector("#profile-phone"),
    emailDisplay: document.querySelector("[data-user='email']"),
    nameDisplay: document.querySelector(".profile-info h2"),
    avatar: document.querySelector(".profile-avatar")
};

function renderProfile(user) {
    if (!user) {
        return;
    }

    const name = user.name || "";
    const email = user.email || "";
    const phone = user.phone || "";

    if (profileElements.name) {
        profileElements.name.value = name;
    }

    if (profileElements.email) {
        profileElements.email.value = email;
    }

    if (profileElements.phone) {
        profileElements.phone.value = phone;
    }

    if (profileElements.emailDisplay) {
        profileElements.emailDisplay.textContent = email;
    }

    if (profileElements.nameDisplay) {
        profileElements.nameDisplay.textContent = name || "User";
    }

    if (profileElements.avatar) {
        profileElements.avatar.textContent = getInitials(name);
    }
}

function getInitials(name) {
    if (!name) {
        return "U";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

async function loadProfile() {
    try {
        const user = await apiRequest("/auth/me");

        renderProfile(user);
    } catch (error) {
        showNotification(error.message, "error");
    }
}

async function updateProfile(event) {
    event.preventDefault();

    const name = profileElements.name?.value.trim() || "";
    const phone = profileElements.phone?.value.trim() || "";

    if (!name) {
        showNotification("Full name cannot be empty.", "warning");
        return;
    }

    const submitButton = profileElements.form?.querySelector("button[type='submit']");

    setButtonLoading(submitButton, true, "Saving...");

    try {
        const updatedUser = await apiRequest("/users/me", {
            method: "PATCH",
            body: JSON.stringify({name, phone})
        });

        renderProfile(updatedUser);

        showNotification("Profile updated successfully.", "success");

    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        setButtonLoading(submitButton, false);
    }
}

if (profileElements.form) {
    profileElements.form.addEventListener("submit", updateProfile);
}

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
});