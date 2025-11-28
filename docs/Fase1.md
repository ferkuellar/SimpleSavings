Buenísimo, Fer. Día 2 = dejar esto  **bonito y en AWS** .

Ya traemos casi todo armado de Día 1, así que ahora lo vamos a:

* Pulir visualmente (UI decente).
* Confirmar gráfica con Chart.js.
* Armar un README v1.
* Subirlo a **S3 + CloudFront** como un sitio estático profesional.

Te lo dejo todo en orden.

---

## A. Código frontend v1 (UI decente + gráfica + reset)

La estructura del proyecto (lado frontend) queda así:

```text
simple-savings/
└─ frontend/
   ├─ index.html
   ├─ css/
   │  └─ styles.css
   └─ js/
      ├─ charts.js
      └─ app.js
```

### 1️⃣ `index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>SimpleSavings - Simulador de Ahorro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Estilos -->
    <link rel="stylesheet" href="css/styles.css" />

    <!-- Chart.js desde CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <main class="container">
      <h1>SimpleSavings – Simulador de Ahorro con Interés Compuesto</h1>
      <p class="subtitle">
        Ingresa tus parámetros de ahorro y calcula cómo crecería tu dinero con aportes mensuales e interés compuesto.
      </p>

      <!-- Formulario -->
      <section class="card">
        <h2>Parámetros de simulación</h2>
        <form id="savings-form">
          <div class="form-group">
            <label for="monthlyContribution">Aporte mensual</label>
            <input
              type="number"
              id="monthlyContribution"
              min="0"
              step="0.01"
              placeholder="Ej. 1000"
              required
            />
          </div>

          <div class="form-group">
            <label for="annualRate">Tasa de interés anual (%)</label>
            <input
              type="number"
              id="annualRate"
              min="0"
              step="0.01"
              placeholder="Ej. 10"
              required
            />
          </div>

          <div class="form-group">
            <label for="years">Plazo (años)</label>
            <input
              type="number"
              id="years"
              min="1"
              step="1"
              placeholder="Ej. 10"
              required
            />
          </div>

          <!-- Botones -->
          <div class="buttons-row">
            <button type="submit" class="btn-primary">Calcular</button>
            <button type="button" id="resetButton" class="btn-secondary">
              Nueva consulta
            </button>
          </div>

          <p id="error-message" class="error-message"></p>
        </form>
      </section>

      <!-- Resultados numéricos -->
      <section class="card">
        <h2>Resultados de la simulación</h2>
        <div class="results-grid">
          <div class="result-item">
            <span class="result-label">Total aportado</span>
            <span id="totalContributed" class="result-value">$0.00</span>
          </div>
          <div class="result-item">
            <span class="result-label">Valor futuro</span>
            <span id="finalBalance" class="result-value">$0.00</span>
          </div>
          <div class="result-item">
            <span class="result-label">Intereses generados</span>
            <span id="totalInterest" class="result-value">$0.00</span>
          </div>
        </div>
      </section>

      <!-- Gráfica -->
      <section class="card">
        <h2>Gráfica de crecimiento</h2>
        <div class="chart-wrapper">
          <canvas id="growthChart" height="140"></canvas>
        </div>
      </section>

      <!-- Tabla de detalle mensual -->
      <section class="card">
        <h2>Detalle mensual</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Aporte</th>
                <th>Interés del mes</th>
                <th>Saldo acumulado</th>
              </tr>
            </thead>
            <tbody id="resultsTableBody">
              <!-- Filas generadas por JS -->
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Scripts de la app -->
    <script src="js/charts.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```

---

### 2️⃣ `styles.css` (UI dark, tipo dashboard fintech)

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #0f172a; /* azul oscuro */
  color: #e5e7eb;      /* gris claro */
}

.container {
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  margin-bottom: 2rem;
  color: #9ca3af;
}

.card {
  background: #020617;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  border: 1px solid #1f2937;
}

h2 {
  margin-top: 0;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #cbd5f5;
}

input[type="number"] {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
}

input[type="number"]:focus {
  outline: none;
  border-color: #38bdf8;
}

/* Botones */

.buttons-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-block;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  border: none;
  background: #38bdf8;
  color: #020617;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0ea5e9;
}

.btn-secondary {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: transparent;
  color: #e5e7eb;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #111827;
}

.error-message {
  color: #f97373;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  min-height: 1rem;
}

/* Resultados */

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.result-item {
  background: #020617;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid #1f2937;
}

.result-label {
  display: block;
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.result-value {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Gráfica */

.chart-wrapper {
  position: relative;
  height: 260px;
}

/* Tabla */

.table-wrapper {
  max-height: 340px;
  overflow-y: auto;
  border-radius: 0.75rem;
  border: 1px solid #1f2937;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

thead {
  position: sticky;
  top: 0;
  background: #020617;
}

th,
td {
  padding: 0.5rem;
  border-bottom: 1px solid #1f2937;
  text-align: right;
}

th:first-child,
td:first-child {
  text-align: left;
}

tbody tr:nth-child(even) {
  background: #020617;
}
```

---

### 3️⃣ `charts.js` (Chart.js, línea de crecimiento)

```js
// Referencia global al gráfico para poder actualizarlo
let growthChart = null;

/**
 * Renderiza o actualiza la gráfica de crecimiento.
 * Recibe el arreglo schedule (mes, aporte, interés, saldo).
 */
function renderChart(schedule) {
  const canvas = document.getElementById("growthChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const labels = schedule.map((row) => row.month);
  const data = schedule.map((row) => row.balance);

  // Si no hay datos (por error o reset), limpiar gráfica
  if (schedule.length === 0) {
    if (growthChart) {
      growthChart.data.labels = [];
      growthChart.data.datasets[0].data = [];
      growthChart.update();
    }
    return;
  }

  if (!growthChart) {
    // Crear gráfico por primera vez
    growthChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Saldo acumulado",
            data,
            borderWidth: 2,
            tension: 0.15,
            borderColor: "rgba(56, 189, 248, 1)",        // cyan
            backgroundColor: "rgba(56, 189, 248, 0.15)", // relleno suave
            pointRadius: 0,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#e5e7eb",
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y || 0;
                return `Saldo: ${value.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  maximumFractionDigits: 2,
                })}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#9ca3af",
            },
            grid: {
              color: "rgba(31, 41, 55, 1)",
            },
          },
          y: {
            ticks: {
              color: "#9ca3af",
            },
            grid: {
              color: "rgba(31, 41, 55, 1)",
            },
          },
        },
      },
    });
  } else {
    // Actualizar gráfico existente
    growthChart.data.labels = labels;
    growthChart.data.datasets[0].data = data;
    growthChart.update();
  }
}
```

---

### 4️⃣ `app.js` (lógica financiera + UI + reset)

```js
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
```

---

## B. README v1 (Fase 1 – frontend estático)

Crea un `README.md` en la raíz del repo con algo así:

```md
# SimpleSavings – Simulador de Ahorro con Interés Compuesto

**Fase 1 – Frontend estático (S3 + CloudFront)**

SimpleSavings es una app web sencilla que permite simular cómo crecería un ahorro con:

- Aporte mensual
- Tasa de interés anual
- Plazo en años

La app calcula el crecimiento mes a mes y muestra:

- Total aportado
- Valor futuro
- Intereses generados
- Gráfica de crecimiento
- Tabla de detalle mensual

## Lógica financiera

Se asume un aporte mensual constante con capitalización mensual:

- `P` = aporte mensual  
- `r` = tasa anual (decimal)  
- `i` = tasa mensual = `r / 12`  
- `n` = número de meses = años × 12  

Valor futuro aproximado:

$$
FV = P \cdot \frac{(1 + i)^n - 1}{i}
$$

En el código se calcula mes a mes para poder generar la tabla y la gráfica.

## Arquitectura – Fase 1

Fase 1: solo frontend estático, desplegado en **AWS S3 + CloudFront**:

```text
[User Browser]
      |
      v
[CloudFront Distribution]  --->  [S3 Static Website Bucket]
                                     - Versioning ON
```

* **S3** : hosting de archivos estáticos (HTML, CSS, JS)
* **CloudFront** : CDN para servir el sitio con baja latencia y HTTPS

## Cómo correrlo en local

1. Clonar el repo
2. Ir a la carpeta `frontend/`
3. Abrir `index.html` en el navegador

## Despliegue en AWS (resumen)

1. Crear bucket S3 con versioning habilitado
2. Activar "Static website hosting" y subir los archivos de `frontend/`
3. Crear distribución CloudFront apuntando al bucket S3
4. Usar la URL de CloudFront como enlace público del proyecto

```

Con eso ya documentas la Fase 1 de forma clara.

---

## C. Despliegue en AWS S3 + CloudFront (paso a paso)

Te lo dejo **como receta**, pensando que vas empezando.

### ✅ Pre-requisitos

- Tener una cuenta de AWS.
- Tener configurado un usuario IAM con permisos para S3 y CloudFront (y tus credenciales configuradas en AWS CLI en tu laptop).

---

### 1️⃣ Crear el bucket S3

1. Entra a la consola de AWS.  
2. Ve a **S3**.  
3. Click en **Create bucket**.
4. Nombre (ejemplo): `simple-savings-frontend-fer-12345`  
   - Region: por ejemplo `us-east-1` (N. Virginia).
5. Desmarca cualquier opción que bloquee *por completo* el acceso público si vas a usar website endpoint directo (si vas a ir por CloudFront con OAC lo puedes dejar más cerrado, pero para empezar manténlo simple).
6. Crea el bucket.

#### Habilitar versioning

1. Dentro del bucket → pestaña **Properties**.  
2. Busca **Bucket Versioning** → haz click en **Edit**.  
3. Activa **Enable**.

---

### 2️⃣ Activar "Static Website Hosting"

1. En el bucket, pestaña **Properties**.  
2. Baja hasta **Static website hosting**.  
3. Click en **Edit**.  
4. Marca **Enable**.  
5. **Index document**: `index.html`  
6. **Error document**: puedes poner `index.html` también (para SPA simple) o `error.html` si llegas a crear uno.  
7. Guarda.

Te va a aparecer una URL tipo:

```text
http://simple-savings-frontend-fer-12345.s3-website-us-east-1.amazonaws.com
```

(Esa es la URL directa del sitio en S3 – sin HTTPS.)

---

### 3️⃣ Subir los archivos del frontend

Desde tu PC, en la carpeta raíz del proyecto tienes `/frontend`.

Dentro de `frontend` deben estar estos archivos y carpetas:

```text
frontend/
├─ index.html
├─ css/
│  └─ styles.css
└─ js/
   ├─ charts.js
   └─ app.js
```

#### Opción A – Subir por consola web

1. En el bucket → pestaña  **Objects** .
2. Click  **Upload** .
3. Sube la carpeta `frontend` o su contenido (si subes la carpeta, cuida la ruta).
4. Verifica que `index.html` quede en la raíz del bucket (no adentro de otra carpeta como `frontend/index.html`).

#### Opción B – Subir con AWS CLI

Desde la terminal (PowerShell):

```bash
cd ruta/donde/esta/simple-savings
aws s3 sync ./frontend s3://simple-savings-frontend-fer-12345 --delete
```

* `--delete` elimina archivos en S3 que ya no existan en tu carpeta local → útil para mantener orden.

---

### 4️⃣ Probar el sitio directo en S3 (sin CloudFront)

Abre en el navegador la URL que te dio S3 en  **Static website hosting** .

Deberías poder:

* Ver la UI dark.
* Meter un aporte mensual, tasa y años.
* Ver resultados, gráfica y tabla.
* Usar el botón de  **Nueva consulta** .

Si eso funciona → v1 está bien.

---

### 5️⃣ Crear distribución CloudFront

Ahora lo hacemos “bien” con CloudFront, para tener:

* HTTPS
* CDN
* URL más estable para tu portafolio

1. Ve a **CloudFront** en la consola AWS.
2. Click en  **Create distribution** .

En  **Origin** :

* **Origin domain** :
* Puedes seleccionar tu bucket S3.
* **Origin path** : déjalo vacío.
* Si te deja elegir:
  * Puedes usar el *bucket* como origin (no el website endpoint).
  * Para algo sencillo de portafolio, cualquiera te sirve, lo importante es que apunte al contenido.

En  **Default cache behavior** :

* **Viewer protocol policy** : `Redirect HTTP to HTTPS`.

En  **Settings** :

* **Default root object** → `index.html`.

Crea la distribución.

Cuando el **Status** esté en `Deployed` y **State** en `Enabled`, tendrás un dominio tipo:

```text
https://dxxxxxxxxxxxx.cloudfront.net
```

Esa es tu URL pública “bonita” (con HTTPS).

---

### 6️⃣ Probar el sitio vía CloudFront

Abre la URL de CloudFront:

* Haz varias simulaciones: cambia aporte, tasa, años.
* Verifica:
  * Que la gráfica cambie.
  * Que la tabla se actualice.
  * Que el botón de “Nueva consulta” limpie todo.

Si algo falla, casi siempre es porque:

* Algún archivo no se subió donde debe (`css/styles.css`, `js/app.js`, etc.).
* O porque `index.html` no está en la raíz del bucket.

---

### 7️⃣ Actualizar el README con la URL

En tu `README.md`, agrega una sección:

```md
## Demo

La app está desplegada en AWS:

- **CloudFront URL:** https://dxxxxxxxxxxxx.cloudfront.net
```

(Cuando tengas dominio propio, actualizas eso.)

---

Con esto, el **Día 2** está cumplido:

* ✅ UI oscura, limpia, tipo dashboard.
* ✅ Gráfica de crecimiento con Chart.js.
* ✅ Proyecto publicado en S3 + CloudFront (Fase 1 – frontend estático).
* ✅ README listo para portafolio.

Si quieres, en el siguiente día nos metemos ya con **Lambda + API Gateway** (Fase 2) y empezamos a mover la lógica de cálculo al backend serverless. Ahí es donde ya empiezas a oler a “AWS Architect profesional” 😎.
