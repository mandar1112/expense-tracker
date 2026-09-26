
function showNotification(message, type = "info") {
    if (!message) {
        return;
    }

    let container = document.querySelector(".notification-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "notification-container";
        document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    const messageElement = document.createElement("span");
    messageElement.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "notification-close";
    closeButton.setAttribute("aria-label", "Close notification");
    closeButton.textContent = "×";

    notification.appendChild(messageElement);
    notification.appendChild(closeButton);
    container.appendChild(notification);

    const removeNotification = () => {
        notification.remove();
    };

    closeButton.addEventListener("click", removeNotification);

    setTimeout(removeNotification, 5000);
}