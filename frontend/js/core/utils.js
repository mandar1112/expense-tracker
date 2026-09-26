
function formatCurrency(amount) {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        return "$0.00";
    }

    return `$${value.toFixed(2)}`;
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    return date.toLocaleDateString();
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value ?? "";
    return element.innerHTML;
}

function showElement(element) {
    if (element) {
        element.hidden = false;
    }
}

function hideElement(element) {
    if (element) {
        element.hidden = true;
    }
}

function setButtonLoading(button, loading, loadingText = "Loading...") {
    if (!button) {
        return;
    }

    if (loading) {
        if (!button.dataset.originalText) {
            button.dataset.originalText = button.textContent;
        }

        button.disabled = true;
        button.textContent = loadingText;
        return;
    }

    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
    delete button.dataset.originalText;
}

function getElement(selector, parent = document) {
    return parent.querySelector(selector);
}

function getElements(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}