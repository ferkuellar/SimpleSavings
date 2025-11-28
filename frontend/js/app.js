// Referencias a elementos del DOM
const form = document.getElementById("savings-form");
const monthlyInput = document.getElementById("monthlyContribution");
const annualRateInput = document.getElementById("annualRate");
const yearsInput = document.getElementById("years");
const errorMessage = document.getElementById("error-message");

// Botón de nueva consulta
const resetButton = document.getElementById("resetButton");

const totalContributedEl = document.getElementById("totalContributed");
const finalBalanceEl = document.getElementById("finalBalance");
const totalInterestEl = document.getElementById("totalInterest");
const resultsTableBody = document.getElementById("resultsTableBody");

/**
 * Función principal de simulación.
 *
 * P = aporte mensual
 * r = tasa anual (decimal)
 * i = tasa mensual = r / 12
 * n = número de meses = años * 12
 *
 * Valor futuro aproximado:
 * FV = P * ((1 + i)^n - 1) / i
 *
 * Aquí calculamos mes a mes para poder generar la tabla y la gráfica.
 */
function simulateSavings(monthlyContribution, annualRate, years) {
  const monthlyRate = annualRate / 12; // i
  const totalMonths = years * 12;      // n

  let balance = 0;
  const schedule = [];

  for (let month = 1; month <= totalMonths; month++) {
    const interestForMonth = balance * monthlyRate;
    balance = balance + interestForMonth + monthlyContribution;

    schedule.push({
      month,
      contribution: monthlyContribution,
      interest: interestForMonth,
      balance,
    });
  }

  return schedule;
}

/**
 * Formatea un número como moneda (MXN por defecto).
 */
function formatCurrency(value) {
  return value.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  });
}

/**
 * Limpia la tabla de resultados.
 */
function clearTable() {
  resultsTableBody.innerHTML = "";
}

/**
 * Renderiza la tabla mensual a partir del arreglo schedule.
 */
function renderTable(schedule) {
  clearTable();

  schedule.forEach((row) => {
    const tr = document.createElement("tr");

    const tdMonth = document.createElement("td");
    tdMonth.textContent = row.month;

    const tdContribution = document.createElement("td");
    tdContribution.textContent = formatCurrency(row.contribution);

    const tdInterest = document.createElement("td");
    tdInterest.textContent = formatCurrency(row.interest);

    const tdBalance = document.createElement("td");
    tdBalance.textContent = formatCurrency(row.balance);

    tr.appendChild(tdMonth);
    tr.appendChild(tdContribution);
    tr.appendChild(tdInterest);
    tr.appendChild(tdBalance);

    resultsTableBody.appendChild(tr);
  });
}

/**
 * Actualiza los resultados agregados (arriba de la tabla).
 */
function renderSummary(schedule, monthlyContribution) {
  if (schedule.length === 0) {
    totalContributedEl.textContent = formatCurrency(0);
    finalBalanceEl.textContent = formatCurrency(0);
    totalInterestEl.textContent = formatCurrency(0);
    return;
  }

  const totalMonths = schedule.length;
  const totalContributed = monthlyContribution * totalMonths;
  const finalBalance = schedule[schedule.length - 1].balance;
  const totalInterest = finalBalance - totalContributed;

  totalContributedEl.textContent = formatCurrency(totalContributed);
  finalBalanceEl.textContent = formatCurrency(finalBalance);
  totalInterestEl.textContent = formatCurrency(totalInterest);
}

/**
 * Resetea la simulación completa:
 * - Inputs
 * - Mensaje de error
 * - Tabla
 * - Resumen
 * - Gráfica
 */
function resetSimulation() {
  // Limpiar inputs
  monthlyInput.value = "";
  annualRateInput.value = "";
  yearsInput.value = "";

  // Limpiar mensaje de error
  errorMessage.textContent = "";

  // Limpiar tabla y resumen
  clearTable();
  renderSummary([], 0);

  // Limpiar gráfica (función definida en charts.js)
  if (typeof renderChart === "function") {
    renderChart([]);
  }

  // Llevar el foco al primer input
  monthlyInput.focus();
}

/**
 * Maneja el envío del formulario.
 */
form.addEventListener("submit", (event) => {
  event.preventDefault(); // evita que recargue la página

  errorMessage.textContent = "";

  const monthly = parseFloat(monthlyInput.value);
  const annualRatePercent = parseFloat(annualRateInput.value);
  const years = parseInt(yearsInput.value, 10);

  // Validaciones básicas
  if (
    isNaN(monthly) ||
    isNaN(annualRatePercent) ||
    isNaN(years) ||
    monthly <= 0 ||
    annualRatePercent <= 0 ||
    years <= 0
  ) {
    errorMessage.textContent =
      "Por favor ingresa valores válidos (mayores a cero) en todos los campos.";
    clearTable();
    renderSummary([], 0);
    if (typeof renderChart === "function") {
      renderChart([]);
    }
    return;
  }

  // Convertimos tasa anual de % a decimal
  const annualRate = annualRatePercent / 100;

  const schedule = simulateSavings(monthly, annualRate, years);

  renderSummary(schedule, monthly);
  renderTable(schedule);
  if (typeof renderChart === "function") {
    renderChart(schedule);
  }
});

// Evento del botón de nueva consulta
resetButton.addEventListener("click", resetSimulation);
