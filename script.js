// Get form, expense list, and total amount elements
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmountElement = document.getElementById("total-amount");

// Initialize expenses array from localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Function to render expenses in tabular form
function renderExpenses() {
    // Clear expense list
    expenseList.innerHTML = "";

    // Initialize total amount
    let totalAmount = 0;

    // Loop through expenses array and create table rows
    for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];
        const expenseRow = document.createElement("tr");
        expenseRow.innerHTML = `
            <td>${expense.name}</td>
            <td>₹${expense.amount}</td>
            <td><i class="fas fa-edit edit-btn" data-id="${i}" title="Edit"></i>
            <i class="fas fa-trash-alt delete-btn" data-id="${i}" title="Delete" style="margin-left: 20px;"></i></td>
           
        `;
        expenseList.appendChild(expenseRow);

        // Update total amount
        totalAmount += expense.amount;
    }

    // Update total amount display
    totalAmountElement.textContent =
        totalAmount.toFixed(2);

    // Save expenses to localStorage
    localStorage.setItem("expenses",
        JSON.stringify(expenses));
}

// Function to add or modify expense
function addOrModifyExpense(event, editMode = false) {
    event.preventDefault();

    // Get expense name and amount from form
    const expenseNameInput =
        document.getElementById("expense-name");
    const expenseAmountInput =
        document.getElementById("expense-amount");
    const expenseName =
        expenseNameInput.value;
    const expenseAmount =
        parseFloat(expenseAmountInput.value);

    // Clear form inputs
    expenseNameInput.value = "";
    expenseAmountInput.value = "";

    // Validate inputs
    if (expenseName === "" || isNaN(expenseAmount)) {
        alert("Please enter valid expense details.");
        return;
    }

    // Create new expense object
    const expense = {
        name: expenseName,
        amount: expenseAmount,
    };

    // Add or update expense in expenses array
    if (editMode) {
        const expenseIndex = parseInt(event.target.getAttribute("data-edit-mode"));
        expenses[expenseIndex] = expense; // Modify existing expense
    } else {
        expenses.push(expense); // Add new expense
    }

    // Render expenses
    renderExpenses();
}

// Function to delete expense
function deleteExpense(event) {
    if (event.target.classList.contains("delete-btn")) {
        // Get expense index from data-id attribute
        const expenseIndex =
            parseInt(event.target.getAttribute("data-id"));

        // Remove expense from expenses array
        expenses.splice(expenseIndex, 1);

        // Render expenses
        renderExpenses();
    }
}

// Function to edit expense
function editExpense(event) {
    if (event.target.classList.contains("edit-btn")) {
        // Get expense index from data-id attribute
        const expenseIndex =
            parseInt(event.target.getAttribute("data-id"));

        // Get expense details
        const expense = expenses[expenseIndex];

        // Populate form fields with existing values
        const expenseNameInput =
            document.getElementById("expense-name");
        const expenseAmountInput =
            document.getElementById("expense-amount");
        expenseNameInput.value = expense.name;
        expenseAmountInput.value = expense.amount;

        // Set edit mode
        expenseForm.setAttribute("data-edit-mode", expenseIndex);

        // Focus on expense name input
        expenseNameInput.focus();
    }
}

// Add event listeners
expenseForm.addEventListener("submit", function(event) {
    const editMode = expenseForm.getAttribute("data-edit-mode");
    if (editMode !== null) {
        addOrModifyExpense(event, true); // Modify existing expense
        expenseForm.removeAttribute("data-edit-mode"); // Reset edit mode
    } else {
        addOrModifyExpense(event); // Add new expense
    }
});
expenseList.addEventListener("click", deleteExpense);
expenseList.addEventListener("click", editExpense);

// Render initial expenses on page load
renderExpenses(); 