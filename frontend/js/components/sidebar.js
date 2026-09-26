const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".mobile-menu");

function closeSidebar() {
    if (!sidebar) {
        return;
    }

    sidebar.style.transform = "translateX(-100%)";
}

function openSidebar() {
    if (!sidebar) {
        return;
    }

    sidebar.style.transform = "translateX(0)";
}

if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        if (sidebar.style.transform === "translateX(0px)" || sidebar.style.transform === "translateX(0)") {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}

document.addEventListener("click", (event) => {
    if (!sidebar || !sidebarToggle) {
        return;
    }

    if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
        closeSidebar();
    }
});

const sidebarLinks = document.querySelectorAll(".sidebar .nav-link");

sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeSidebar();
    });
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 800 && sidebar) {
        sidebar.style.transform = "";
    }
});
