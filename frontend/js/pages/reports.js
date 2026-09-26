
const reportElements = {
    period: document.querySelector("#report-period"),
    spendingChart: document.querySelector("#spending-chart"),
    total: document.querySelector("[data-report='total']"),
    average: document.querySelector("[data-report='average']")
};

function setReportLoading(isLoading) {
    if (!isLoading) {
        return;
    }

    if (reportElements.total) {
        reportElements.total.textContent = "Loading...";
    }

    if (reportElements.average) {
        reportElements.average.textContent = "Loading...";
    }

    if (reportElements.spendingChart) {
        reportElements.spendingChart.textContent = "Loading report...";
    }
}

function renderReportSummary(summary) {
    if (!summary) {
        return;
    }

    if (reportElements.total) {
        reportElements.total.textContent = formatCurrency(summary.total);
    }

    if (reportElements.average) {
        reportElements.average.textContent = formatCurrency(summary.average);
    }
}

function renderSpendingOverview(data) {
    if (!reportElements.spendingChart) {
        return;
    }

    if (!Array.isArray(data) || data.length === 0) {
        reportElements.spendingChart.innerHTML = `
            <div class="empty-state">
                <h3>No report data available</h3>
                <p>Select another period or add some expenses.</p>
            </div>
        `;
        return;
    }

    reportElements.spendingChart.innerHTML = "";

    const list = document.createElement("div");
    list.className = "spending-report-list";

    data.forEach((item) => {
        const row = document.createElement("div");
        row.className = "spending-report-item";

        row.innerHTML = `
            <span>${escapeHtml(item.label)}</span>
            <strong>${formatCurrency(item.total)}</strong>
        `;

        list.appendChild(row);
    });

    reportElements.spendingChart.appendChild(list);
}

async function loadReports(period = "") {
    setReportLoading(true);

    try {
        const endpoint = period
            ? `/reports?period=${encodeURIComponent(period)}`
            : "/reports";

        const response = await apiRequest(endpoint);

        renderReportSummary(response.summary);
        renderSpendingOverview(response.spending_overview);
    
    } catch (error) {
        if (reportElements.total) {
            reportElements.total.textContent = "--";
        }

        if (reportElements.average) {
            reportElements.average.textContent = "--";
        }

        if (reportElements.spendingChart) {
            reportElements.spendingChart.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to load report</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }

        showNotification(error.message, "error");
    }
}

if (reportElements.period) {
    reportElements.period.addEventListener("change", () => {
        loadReports(reportElements.period.value);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadReports();
});