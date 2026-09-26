
function openModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

function closeModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
}

function setupModal(modal) {
    if (!modal) {
        return;
    }

    const closeButtons = modal.querySelectorAll("[data-modal-close]");

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            closeModal(modal);
        });
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
}


document.querySelectorAll(".modal-overlay").forEach((modal) => {
    setupModal(modal);
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    document.querySelectorAll(".modal-overlay:not(.hidden)").forEach((modal) => {
        closeModal(modal);
    });
});