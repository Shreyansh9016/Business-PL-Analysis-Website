// script.js

let inventoryData = [];
let productsData = [];
let chartInstance = null;

/* -------------------------------
   LOAD DATA
--------------------------------*/

// Load inventory data
fetch("data/inventory.json")
  .then(res => res.json())
  .then(data => {
    inventoryData = data;
    initializeDashboard();
  })
  .catch(err => console.error("Inventory load error:", err));

// Load product data
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    productsData = data;
    populateProductFilter();
  })
  .catch(err => console.error("Products load error:", err));

/* -------------------------------
   POPULATE PRODUCT DROPDOWN
--------------------------------*/
function populateProductFilter() {
  const select = document.getElementById("productFilter");

  // Clear existing options (safe practice)
  select.innerHTML = `<option value="all">All Products</option>`;

  productsData.forEach(p => {
    let opt = document.createElement("option");
    opt.value = p.product_id;
    opt.text = p.product_name;
    select.appendChild(opt);
  });

  // Recalculate when product changes
  select.addEventListener("change", initializeDashboard);
}

/* -------------------------------
   DASHBOARD LOGIC (KPIs)
--------------------------------*/
function initializeDashboard() {
  const selectedProduct =
    document.getElementById("productFilter")?.value || "all";

  let profit = 0;
  let loss = 0;

  inventoryData.forEach(item => {
    if (
      selectedProduct === "all" ||
      item.product_id == selectedProduct
    ) {
      profit += Number(item.profit || 0);
      loss += Number(item.loss || 0);
    }
  });

  document.getElementById("totalProfit").innerText =
    "Total Profit: ₹" + profit.toLocaleString();

  document.getElementById("totalLoss").innerText =
    "Total Loss: ₹" + loss.toLocaleString();

  drawChart(profit, loss);
}

/* -------------------------------
   CHART (DATA-DRIVEN)
--------------------------------*/
function drawChart(profit, loss) {
  const ctx = document.getElementById("profitChart");

  // Destroy old chart if exists (important!)
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Profit", "Loss"],
      datasets: [{
        label: "Business P&L",
        data: [profit, loss]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}
