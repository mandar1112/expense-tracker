const settingsElements = {
    profileLink: document.querySelector("#manage-profile"),
    passwordButton: document.querySelector("#change-password"),
    exportButton: document.querySelector("#export-data"),
    navigationLinks: document.querySelectorAll(".settings-navigation a")
};

function setupSettingsNavigation() {
    settingsElements.navigationLinks.forEach((link) => {
        link.addEventListener("click", () => {
            settingsElements.navigationLinks.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });
}

function setupProfileAction() {
    settingsElements.profileLink?.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
}

function setupPasswordAction() {
    settingsElements.passwordButton?.addEventListener("click", () => {
        showNotification("Password change will be available when the backend authentication system is connected.", "info");
    });
}

async function exportUserData() {
    const confirmed = window.confirm("Do you want to export your expense data?");

    if (!confirmed) {
        return;
    }

    const button = settingsElements.exportButton;
    setButtonLoading(button, true, "Exporting...");

    try {
        const response = await apiRequest("/users/me/export", {
            method: "GET"
        });

        if (!response) {
            throw new Error("No export data was returned.");
        }

        const data = JSON.stringify(response, null, 2);
        const blob = new Blob([data], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "expense-tracker-data.json";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
        showNotification("Your data has been exported successfully.", "success");
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        setButtonLoading(button, false);
    }
}

function setupExportAction() {
    settingsElements.exportButton?.addEventListener("click", exportUserData);
}

document.addEventListener("DOMContentLoaded", () => {
    setupSettingsNavigation();
    setupProfileAction();
    setupPasswordAction();
    setupExportAction();
});
