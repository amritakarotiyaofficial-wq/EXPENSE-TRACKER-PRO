
const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalSpan = document.getElementById("total");
const highestCategorySpan = document.getElementById("highest-category");
const monthTotalSpan = document.getElementById("month-total");
const toast = document.getElementById("toast");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

const emojiMap = {
    Food: "🍔",
    Travel: "🚌",
    Shopping: "🛍",
    Bills: "💡",
    Health: "🏥",
    Entertainment: "🎮",
    Education: "📚",
    Other: "📦"
};

renderExpenses();

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const expense = {
        description,
        amount,
        category,
        date
    };

    expenses.push(expense);

    saveExpenses();

    renderExpenses();

    showToast();

    form.reset();

});

function renderExpenses() {

    expenseList.innerHTML = "";

    let total = 0;
    let monthTotal = 0;

    let categoryTotals = {};

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    expenses.forEach((expense, index) => {

        total += expense.amount;

        const expenseDate = new Date(expense.date);

        if (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        ) {
            monthTotal += expense.amount;
        }

        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += expense.amount;
        } else {
            categoryTotals[expense.category] = expense.amount;
        }

        const li = document.createElement("li");

        li.innerHTML = `
            <span>
                ${emojiMap[expense.category]}
                <strong>${expense.description}</strong><br>
                ₹${expense.amount} • ${expense.category}<br>
                📅 ${expense.date}
            </span>

            <button class="delete-btn"
                onclick="deleteExpense(${index})">
                Delete
            </button>
        `;

        expenseList.appendChild(li);

    });

    totalSpan.textContent = total;
    monthTotalSpan.textContent = monthTotal;

    updateHighestCategory(categoryTotals);

    updateChart(categoryTotals);

}
function deleteExpense(index) {

    expenses.splice(index, 1);

    saveExpenses();

    renderExpenses();

}

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}

function showToast() {

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2000);

}

function updateHighestCategory(categoryTotals) {

    let highest = "None";
    let max = 0;

    for (let category in categoryTotals) {

        if (categoryTotals[category] > max) {

            max = categoryTotals[category];
            highest = category;

        }

    }

    highestCategorySpan.textContent = highest;

}

function updateChart(categoryTotals) {

    const labels = Object.keys(categoryTotals);

    const values = Object.values(categoryTotals);

    if (chart) {

        chart.destroy();

    }

    const ctx = document
        .getElementById("expenseChart")
        .getContext("2d");

    chart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [

                {

                    data: values,

                    backgroundColor: [

                        "#ff6384",
                        "#36a2eb",
                        "#ffce56",
                        "#4bc0c0",
                        "#9966ff",
                        "#ff9f40",
                        "#8dd17e",
                        "#c9cbcf"

                    ]

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}