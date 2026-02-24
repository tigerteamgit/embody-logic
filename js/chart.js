<script>
/* ---- Charts (Somatic first, then Creative) ---- */
(() => {
  const CHART_H = 150;
  let somaticChart = null;
  let creativeChart = null;

  function lockCanvasHeight(canvas, px){
    if(!canvas) return;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = px + "px";
    canvas.style.maxHeight = px + "px";
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
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: 0 },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      interaction: { mode: "nearest", intersect: false },
      events: ["mousemove","mouseout","click","touchstart","touchmove"],
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { maxTicksLimit: 5 } },
        x: { ticks: { autoSkip: false, maxRotation: 25, minRotation: 25 } }
      }
    };
  }

  /* ---- Color helpers (darker = higher value) ---- */
  function normalizeValues(values){
    const nums = values.map(v => Number(v) || 0);
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const span = max - min;
    // If all values equal, use mid intensity
    if(span <= 0) return nums.map(() => 0.5);
    return nums.map(v => (v - min) / span);
  }

  function blackByValue(values){
    // low value -> lighter gray; high value -> darker near-black
    const t = normalizeValues(values);
    const lightLow = 60; // lightest for low scores
    const lightHigh = 12; // darkest for high scores
    return t.map(x => {
      const L = Math.round(lightLow + (lightHigh - lightLow) * x);
      return `hsl(0, 0%, ${L}%)`;
    });
  }

  function blueByValue(values){
    // low value -> lighter blue; high value -> deeper/darker blue
    const t = normalizeValues(values);
    const hue = 210;
    const sat = 75;
    const lightLow = 70; // lightest for low scores
    const lightHigh = 28; // darkest for high scores
    return t.map(x => {
      const L = Math.round(lightLow + (lightHigh - lightLow) * x);
      return `hsl(${hue}, ${sat}%, ${L}%)`;
    });
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

    lockCanvasHeight(somaticCanvas, CHART_H);
    lockCanvasHeight(creativeCanvas, CHART_H);

    /* ---- SOMATIC DATA (first) ---- */
    const somaticValues = [18, 14, 0, 5, 9];
    const somaticColors = blackByValue(somaticValues);

    const somaticData = {
      labels: ['Somatic Index', 'Embodied Expansion', 'Range', 'Recovery', 'Integration Gap'],
      datasets: [{
        label: 'Somatic Scores',
        data: somaticValues,
        backgroundColor: somaticColors,
        borderColor: somaticColors,
        borderWidth: 1
      }]
    };

    /* ---- CREATIVE DATA (second) ---- */
    const creativeValues = [10, 5, 5, 0, 0, 0, 0];
    const creativeColors = blueByValue(creativeValues);

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
        data: creativeValues,
        backgroundColor: creativeColors,
        borderColor: creativeColors,
        borderWidth: 1.5
      }]
    };

    const options = buildOptions();

    somaticChart = new Chart(somaticCanvas, { type: "bar", data: somaticData, options });
    creativeChart = new Chart(creativeCanvas, { type: "bar", data: creativeData, options });

    requestAnimationFrame(() => {
      lockCanvasHeight(somaticCanvas, CHART_H);
      lockCanvasHeight(creativeCanvas, CHART_H);
      somaticChart.resize();
      creativeChart.resize();
    });

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
