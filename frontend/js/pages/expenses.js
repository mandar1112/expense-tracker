
const expenseElements = {
    searchInput: document.querySelector("#expense-search"),
    categoryFilter: document.querySelector("#category-filter"),
    sortSelect: document.querySelector("#sort-expenses"),
    tableBody: document.querySelector("#expense-table-body"),
    paginationInfo: document.querySelector("#pagination-info"),
    previousPage: document.querySelector("#previous-page"),
    nextPage: document.querySelector("#next-page"),
    addButton: document.querySelector("#add-expense-button"),
    modal: document.querySelector("#expense-modal"),
    closeModalButton: document.querySelector("#close-expense-modal"),
    cancelButton: document.querySelector("#cancel-expense"),
    form: document.querySelector("#expense-form"),
    amountInput: document.querySelector("#expense-amount"),
    categoryInput: document.querySelector("#expense-category"),
    descriptionInput: document.querySelector("#expense-description"),
    dateInput: document.querySelector("#expense-date")
};

const EXPENSES_PER_PAGE = 10;


let expenses = [];
let currentPage = 1;
let editingExpenseId = null;

const expenseCategories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Education",
    "Entertainment",
    "Health",
    "People",
    "Other"
];


function openExpenseModal(expense = null) {
    if (!expenseElements.modal) {
        return;
    }

    editingExpenseId = expense?.id ?? null;

    if (expense) {
        expenseElements.amountInput.value = expense.amount ?? "";
        expenseElements.categoryInput.value = expense.category ?? "";
        expenseElements.descriptionInput.value = expense.description ?? "";
        expenseElements.dateInput.value = expense.date ?? "";

        const title = expenseElements.modal.querySelector(".modal-header h2");

        if (title) {
            title.textContent = "Edit Expense";
        }

    } else {
        expenseElements.form.reset();
        expenseElements.dateInput.value = getTodayDate();

        const title = expenseElements.modal.querySelector(".modal-header h2");

        if (title) {
            title.textContent = "Add Expense";
        }
    }

    openModal(expenseElements.modal);
}

function closeExpenseModal() {
    if (!expenseElements.modal) {
        return;
    }

    closeModal(expenseElements.modal);
    expenseElements.form?.reset();

    editingExpenseId = null;

    const title = expenseElements.modal.querySelector(".modal-header h2");

    if (title) {
        title.textContent = "Add Expense";
    }
}

function getTodayDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function populateExpenseCategories() {
    if (!expenseElements.categoryInput) {
        return;
    }

    expenseCategories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        expenseElements.categoryInput.appendChild(option);
    });
}

function populateFilterCategories() {
    if (!expenseElements.categoryFilter) {
        return;
    }

    expenseCategories.forEach((category) => {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        expenseElements.categoryFilter.appendChild(option);
    });
}

function getFilteredExpenses() {
    const searchValue = expenseElements.searchInput?.value.trim().toLowerCase() || "";
    const categoryValue = expenseElements.categoryFilter?.value || "";

    return expenses.filter((expense) => {
        const description = String(expense.description || "").toLowerCase();
        const category = String(expense.category || "").toLowerCase();

        const matchesSearch =
            !searchValue ||
            description.includes(searchValue) ||
            category.includes(searchValue);

        const matchesCategory =
            !categoryValue ||
            expense.category === categoryValue;

        return matchesSearch && matchesCategory;
    });
}

function sortExpenses(items) {
    const sortValue = expenseElements.sortSelect?.value || "";

    const sortedExpenses = [...items];

    switch (sortValue) {
        case "amount_asc":
            sortedExpenses.sort((a, b) => Number(a.amount) - Number(b.amount));
            break;

        case "amount_desc":
            sortedExpenses.sort((a, b) => Number(b.amount) - Number(a.amount));
            break;

        case "date_asc":
            sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;

        case "date_desc":
            sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;

        case "category_asc":
            sortedExpenses.sort((a, b) => String(a.category).localeCompare(String(b.category)));
            break;

        case "category_desc":
            sortedExpenses.sort((a, b) => String(b.category).localeCompare(String(a.category)));
            break;

        case "description_asc":
            sortedExpenses.sort((a, b) => String(a.description).localeCompare(String(b.description)));
            break;

        case "description_desc":
            sortedExpenses.sort((a, b) => String(b.description).localeCompare(String(a.description)));
            break;
    }

    return sortedExpenses;
}

function renderExpenses() {
    if (!expenseElements.tableBody) {
        return;
    }

    const filteredExpenses = sortExpenses(getFilteredExpenses());

    const totalExpenses = filteredExpenses.length;
    const totalPages = Math.max(1, Math.ceil(totalExpenses / EXPENSES_PER_PAGE));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * EXPENSES_PER_PAGE;
    const endIndex = startIndex + EXPENSES_PER_PAGE;

    const pageExpenses = filteredExpenses.slice(startIndex, endIndex);

    expenseElements.tableBody.innerHTML = "";

    if (pageExpenses.length === 0) {
        expenseElements.tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <h3>No expenses available</h3>
                        <p>No expenses match your current filters.</p>
                    </div>
                </td>
            </tr>
        `;

        updatePagination(0, 0, 0);
        return;
    }

    pageExpenses.forEach((expense) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(formatDate(expense.date))}</td>
            <td>${escapeHtml(expense.category)}</td>
            <td>${escapeHtml(expense.description)}</td>
            <td>${escapeHtml(formatCurrency(expense.amount))}</td>
            <td>
                <div class="expense-actions">
                    <button type="button" class="btn btn-small btn-outline edit-expense" data-id="${escapeHtml(String(expense.id))}">
                        Edit
                    </button>

                    <button type="button" class="btn btn-small btn-outline delete-expense" data-id="${escapeHtml(String(expense.id))}">
                        Delete
                    </button>
                </div>
            </td>
        `;

        expenseElements.tableBody.appendChild(row);
    });

    updatePagination(startIndex + 1, Math.min(endIndex, totalExpenses), totalPages);

    attachExpenseActionListeners();
}

function updatePagination(start, end, totalPages) {
    if (expenseElements.paginationInfo) {
        if (start === 0) {
            expenseElements.paginationInfo.textContent = "No expenses";
        } else {
            const total = getFilteredExpenses().length;
            expenseElements.paginationInfo.textContent = `${start}-${end} of ${total}`;
        }
    }

    if (expenseElements.previousPage) {
        expenseElements.previousPage.disabled = currentPage <= 1;
    }

    if (expenseElements.nextPage) {
        expenseElements.nextPage.disabled = currentPage >= totalPages;
    }
}

function attachExpenseActionListeners() {
    const editButtons = document.querySelectorAll(".edit-expense");
    const deleteButtons = document.querySelectorAll(".delete-expense");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const expenseId = button.dataset.id;

            const expense = expenses.find(
                (item) => String(item.id) === String(expenseId)
            );

            if (expense) {
                openExpenseModal(expense);
            }
        });
    });

    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const expenseId = button.dataset.id;
            await deleteExpense(expenseId);
        });
    });
}

async function loadExpenses() {
    try {
        const response = await apiRequest("/expenses");

        expenses = Array.isArray(response) ? response : response.expenses || [];
        currentPage = 1;

        renderExpenses();

    } catch (error) {
        expenses = [];

        renderExpenses();

        showNotification(error.message, "error");
    }
}

async function saveExpense(event) {
    event.preventDefault();

    const amount = Number(expenseElements.amountInput.value);
    const category = expenseElements.categoryInput.value;
    const description = expenseElements.descriptionInput.value.trim();
    const date = expenseElements.dateInput.value;

    if (!Number.isFinite(amount) || amount <= 0) {
        showNotification("Please enter a valid amount.", "warning");
        return;
    }

    if (!category) {
        showNotification("Please select a category.", "warning");
        return;
    }

    if (!description) {
        showNotification("Please enter a description.", "warning");
        return;
    }

    if (!date) {
        showNotification("Please select a date.", "warning");
        return;
    }

    const expenseData = {amount, category, description, date};

    const submitButton = expenseElements.form.querySelector("button[type='submit']");

    setButtonLoading(submitButton, true, editingExpenseId ? "Updating..." : "Saving...");

    try {
        if (editingExpenseId) {
            const updatedExpense = await apiRequest(`/expenses/${editingExpenseId}`, {
                method: "PUT",
                body: JSON.stringify(expenseData)
            });

            const index = expenses.findIndex(
                (expense) => String(expense.id) === String(editingExpenseId)
            );

            if (index !== -1) {
                expenses[index] = updatedExpense;
            }

            showNotification("Expense updated successfully.", "success");
        
        } else {
            const createdExpense = await apiRequest("/expenses", {
                method: "POST",
                body: JSON.stringify(expenseData)
            });

            expenses.push(createdExpense);

            showNotification("Expense added successfully.", "success");
        }

        closeExpenseModal();
        renderExpenses();

    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        setButtonLoading(submitButton, false);
    }
}

async function deleteExpense(expenseId) {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(`/expenses/${expenseId}`, {
            method: "DELETE"
        });

        expenses = expenses.filter(
            (expense) => String(expense.id) !== String(expenseId)
        );

        renderExpenses();

        showNotification("Expense deleted successfully.", "success");

    } catch (error) {
        showNotification(error.message, "error");
    }
}

function setupExpenseEvents() {
    expenseElements.searchInput?.addEventListener("input", () => {
        currentPage = 1;
        renderExpenses();
    });

    expenseElements.categoryFilter?.addEventListener("change", () => {
        currentPage = 1;
        renderExpenses();
    });

    expenseElements.sortSelect?.addEventListener("change", () => {
        currentPage = 1;
        renderExpenses();
    });

    expenseElements.previousPage?.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderExpenses();
        }
    });

    expenseElements.nextPage?.addEventListener("click", () => {
        const totalPages = Math.max(1, Math.ceil(getFilteredExpenses().length / EXPENSES_PER_PAGE));

        if (currentPage < totalPages) {
            currentPage++;
            renderExpenses();
        }
    });

    expenseElements.addButton?.addEventListener("click", () => {
        openExpenseModal();
    });

    expenseElements.closeModalButton?.addEventListener("click", () => {
        closeExpenseModal();
    });

    expenseElements.cancelButton?.addEventListener("click", () => {
        closeExpenseModal();
    });

    expenseElements.modal?.addEventListener("click", (event) => {
        if (event.target === expenseElements.modal) {
            closeExpenseModal();
        }
    });

    expenseElements.form?.addEventListener("submit", saveExpense);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !expenseElements.modal?.classList.contains("hidden")) {
            closeExpenseModal();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateExpenseCategories();
    populateFilterCategories();
    setupExpenseEvents();
    loadExpenses();
});