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
