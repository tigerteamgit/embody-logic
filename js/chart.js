<script>
/* ---- Charts (Somatic first, then Creative) ---- */
(() => {
  const CHART_H = 150;
  let somaticChart = null;
  let creativeChart = null;

  function lockCanvasHeight(canvas, px){
    if(!canvas) return;

    // CSS size (layout)
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = px + "px";
    canvas.style.maxHeight = px + "px";

    // Canvas drawing buffer (prevents hover/tooltip resize jitter)
    // IMPORTANT: also set width buffer from current layout width
    const w = Math.max(1, Math.round(canvas.getBoundingClientRect().width || canvas.parentElement?.getBoundingClientRect().width || 600));
    canvas.width = w;
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
        legend: { display: false },   // ✅ remove legends
        tooltip: { enabled: true }
      },
      interaction: {
        mode: "nearest",
        intersect: false
      },
      // Extra belt + suspenders against hover/layout jitter
      events: ["mousemove","mouseout","click","touchstart","touchmove"],
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

    destroyCharts();

    // Force heights BEFORE creating charts
    lockCanvasHeight(somaticCanvas, CHART_H);
    lockCanvasHeight(creativeCanvas, CHART_H);

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
        backgroundColor: "rgba(20, 20, 20, 0.85)",   // black fill
        borderColor: "rgba(0, 0, 0, 1)",             // solid black
        borderWidth: 1.5,
        hoverBackgroundColor: "rgba(40, 40, 40, 0.95)"
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
        backgroundColor: "rgba(124, 58, 237, 0.85)", // purple fill
        borderColor: "rgba(91, 33, 182, 1)",         // darker purple
        borderWidth: 1.5,
        hoverBackgroundColor: "rgba(139, 92, 246, 0.95)"
      }]
    };

    const options = buildOptions();

    /* ---- Render order: SOMATIC → CREATIVE ---- */
    somaticChart = new Chart(somaticCanvas, { type: "bar", data: somaticData, options });
    creativeChart = new Chart(creativeCanvas, { type: "bar", data: creativeData, options });

    // Re-lock after Chart.js computes sizes (prevents it from re-stretching on hover)
    requestAnimationFrame(() => {
      lockCanvasHeight(somaticCanvas, CHART_H);
      lockCanvasHeight(creativeCanvas, CHART_H);
      somaticChart.resize();
      creativeChart.resize();
    });

    // Keep locked on window resize too
    window.addEventListener("resize", () => {
      lockCanvasHeight(somaticCanvas, CHART_H);
      lockCanvasHeight(creativeCanvas, CHART_H);
      if(somaticChart) somaticChart.resize();
      if(creativeChart) creativeChart.resize();
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", renderCharts);
})();
</script>
