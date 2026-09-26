
const dashboardElements = {
    totalExpenses: document.querySelector("[data-stat='total']"),
    monthlyExpenses: document.querySelector("[data-stat='month']"),
    averageExpense: document.querySelector("[data-stat='average']"),
    categoryCount: document.querySelector("[data-stat='categories']"),
    recentExpenses: document.querySelector("#recent-expenses"),
    categorySummary: document.querySelector("#category-summary")
};

function setDashboardLoading(isLoading) {
    if (!isLoading) {
        return;
    }

    if (dashboardElements.totalExpenses) {
        dashboardElements.totalExpenses.textContent = "Loading...";
    }

    if (dashboardElements.monthlyExpenses) {
        dashboardElements.monthlyExpenses.textContent = "Loading...";
    }

    if (dashboardElements.averageExpense) {
        dashboardElements.averageExpense.textContent = "Loading...";
    }

    if (dashboardElements.categoryCount) {
        dashboardElements.categoryCount.textContent = "Loading...";
    }
}

function renderDashboardStats(stats) {
    if (!stats) {
        return;
    }

    if (dashboardElements.totalExpenses) {
        dashboardElements.totalExpenses.textContent = formatCurrency(stats.total_expenses);
    }

    if (dashboardElements.monthlyExpenses) {
        dashboardElements.monthlyExpenses.textContent = formatCurrency(stats.monthly_expenses);
    }

    if (dashboardElements.averageExpense) {
        dashboardElements.averageExpense.textContent = formatCurrency(stats.average_expense);
    }

    if (dashboardElements.categoryCount) {
        dashboardElements.categoryCount.textContent = stats.category_count ?? 0;
    }
}

function renderRecentExpenses(expenses) {
    if (!dashboardElements.recentExpenses) {
        return;
    }

    if (!Array.isArray(expenses) || expenses.length === 0) {
        dashboardElements.recentExpenses.innerHTML = `
            <div class="empty-state">
                <h3>No expenses available</h3>
                <p>Your recent expenses will appear here.</p>
            </div>
        `;
        return;
    }

    dashboardElements.recentExpenses.innerHTML = "";

    expenses.forEach((expense) => {
        const item = document.createElement("div");

        item.className = "expense-item";

        item.innerHTML = `
            <div class="expense-item-info">
                <strong>${escapeHtml(expense.description)}</strong>
                <span>${escapeHtml(expense.category)}</span>
            </div>
            <div class="expense-item-details">
                <strong>${formatCurrency(expense.amount)}</strong>
                <span>${formatDate(expense.date)}</span>
            </div>
        `;

        dashboardElements.recentExpenses.appendChild(item);
    });
}

function renderCategorySummary(categories) {
    if (!dashboardElements.categorySummary) {
        return;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
        dashboardElements.categorySummary.innerHTML = `
            <div class="empty-state">
                <h3>No category data</h3>
                <p>Category information will appear here.</p>
            </div>
        `;
        return;
    }

    dashboardElements.categorySummary.innerHTML = "";

    categories.forEach((category) => {
        const item = document.createElement("div");

        item.className = "category-item";

        item.innerHTML = `
            <div>
                <strong>${escapeHtml(category.category)}</strong>
                <span>${category.count ?? 0} expenses</span>
            </div>
            <strong>${formatCurrency(category.total)}</strong>
        `;

        dashboardElements.categorySummary.appendChild(item);
    });
}

async function loadDashboard() {
    setDashboardLoading(true);

    try {
        const dashboard = await apiRequest("/dashboard");

        renderDashboardStats(dashboard.stats);
        renderRecentExpenses(dashboard.recent_expenses);
        renderCategorySummary(dashboard.category_summary);
        
    } catch (error) {
        if (dashboardElements.totalExpenses) {
            dashboardElements.totalExpenses.textContent = "--";
        }

        if (dashboardElements.monthlyExpenses) {
            dashboardElements.monthlyExpenses.textContent = "--";
        }

        if (dashboardElements.averageExpense) {
            dashboardElements.averageExpense.textContent = "--";
        }

        if (dashboardElements.categoryCount) {
            dashboardElements.categoryCount.textContent = "--";
        }

        showNotification(error.message, "error");
    }
}

document.addEventListener("DOMContentLoaded", loadDashboard);