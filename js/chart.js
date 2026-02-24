<script>
/* ---- Charts (Somatic first, then Creative) ---- */
(() => {
  const CHART_H = 150;
  let somaticChart = null;
  let creativeChart = null;

  function lockCanvasHeight(canvas, px){
    if(!canvas) return;
    // CSS size
    canvas.style.height = px + "px";
    canvas.style.maxHeight = px + "px";
    canvas.style.width = "100%";
    // Internal drawing buffer (this matters)
    canvas.height = px;
  }

  function destroyCharts(){
    if(somaticChart){ somaticChart.destroy(); somaticChart = null; }
    if(creativeChart){ creativeChart.destroy(); creativeChart = null; }
  }

  function buildOptions(){
    return {
      responsive: true,
      maintainAspectRatio: false, // ✅ critical to stop stretching
      animation: false,
      layout: { padding: 0 },
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { maxTicksLimit: 5 }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 25,
            minRotation: 25
          }
        }
      }
    };
  }

  function renderCharts(){
    if(typeof Chart === "undefined"){
      console.error("[CEL] Chart.js is not loaded. Make sure the CDN script is BEFORE this script.");
      return;
    }

    const somaticCanvas = document.getElementById("somaticChart");
    const creativeCanvas = document.getElementById("creativeChart");

    if(!somaticCanvas || !creativeCanvas){
      console.error("[CEL] Missing canvas element(s). Expected #somaticChart and #creativeChart.");
      console.log("somaticCanvas:", somaticCanvas, "creativeCanvas:", creativeCanvas);
      return;
    }

    // Force heights BEFORE creating charts
    lockCanvasHeight(somaticCanvas, CHART_H);
    lockCanvasHeight(creativeCanvas, CHART_H);

    destroyCharts();

    /* ---- SOMATIC DATA (first) ---- */
    const somaticData = {
      labels: [
        "Somatic Index",
        "Embodied Expansion",
        "Somatic Range",
        "Somatic Recovery",
        "Integration Gap"
      ],
      datasets: [{
        label: "Somatic Scores",
        data: [19, 15, 0, 5, 9],
        borderWidth: 1,
        backgroundColor: "rgba(34,197,94,0.35)",
        borderColor: "rgba(34,197,94,0.9)"
      }]
    };

    /* ---- CREATIVE DATA (second) ---- */
    const creativeData = {
      labels: [
        "Creative Index",
        "Fluency",
        "Flexibility",
        "Associative Strength",
        "Perspective Shift",
        "Ambiguity Tolerance",
        "Complexity Handling"
      ],
      datasets: [{
        label: "Creative Scores",
        data: [10, 5, 5, 0, 0, 0, 0],
        borderWidth: 1,
        backgroundColor: "rgba(59,130,246,0.35)",
        borderColor: "rgba(59,130,246,0.9)"
      }]
    };

    const options = buildOptions();

    /* ---- Render order: SOMATIC → CREATIVE ---- */
    somaticChart = new Chart(somaticCanvas, { type: "bar", data: somaticData, options });
    creativeChart = new Chart(creativeCanvas, { type: "bar", data: creativeData, options });

    // Re-lock after Chart.js computes sizes (prevents it from re-stretching)
    requestAnimationFrame(() => {
      lockCanvasHeight(somaticCanvas, CHART_H);
      lockCanvasHeight(creativeCanvas, CHART_H);
    });
  }

  // Wait until canvases exist
  document.addEventListener("DOMContentLoaded", renderCharts);
})();
</script>
