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

  /* ---- Options ---- */
  function buildOptions(){
    return {
      responsive: true,
      maintainAspectRatio: false,
      // ✅ subtle polish: short animation feels nicer, still stable with locked canvas
      animation: { duration: 260, easing: "easeOutQuart" },
      layout: { padding: 0 },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          displayColors: false,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed.y}`
          }
        }
      },
      interaction: { mode: "nearest", intersect: false },
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

  /* ---- Color helpers (darker = higher value) ---- */
  function normalizeValues(values){
    const nums = values.map(v => Number(v) || 0);
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const span = max - min;
    if(span <= 0) return nums.map(() => 0.5);
    return nums.map(v => (v - min) / span);
  }

  function blackByValue(values){
    const t = normalizeValues(values);
    const lightLow = 62;  // low score -> lighter gray
    const lightHigh = 10; // high score -> near-black
    return t.map(x => `hsl(0, 0%, ${Math.round(lightLow + (lightHigh - lightLow) * x)}%)`);
  }

  function blueByValue(values){
    const t = normalizeValues(values);
    const hue = 210;
    const sat = 78;
    const lightLow = 72;  // low score -> lighter blue
    const lightHigh = 26; // high score -> deeper blue
    return t.map(x => `hsl(${hue}, ${sat}%, ${Math.round(lightLow + (lightHigh - lightLow) * x)}%)`);
  }

  /* ---- Next-level polish: highlight max bar + subtle edge + "shadow" illusion ---- */
  function applyPolish(chart, makeColorsFn){
    const ds = chart.data.datasets[0];
    const vals = ds.data.map(v => Number(v) || 0);

    // Per-bar colors (family ramp)
    const base = makeColorsFn(vals);

    // Find max bar index (first max if ties)
    let maxIdx = 0;
    for(let i = 1; i < vals.length; i++){
      if(vals[i] > vals[maxIdx]) maxIdx = i;
    }

    // Slightly boost max bar contrast
    const isBlackFamily = base[0].startsWith("hsl(0, 0%");
    const boost = isBlackFamily ? "hsl(0, 0%, 6%)" : "hsl(210, 82%, 22%)";

    // Border: a touch darker than fill + stronger border on max bar
    const border = base.map((c, i) => (i === maxIdx ? boost : c));
    ds.backgroundColor = base;
    ds.borderColor = border;
    ds.borderWidth = vals.map((_, i) => (i === maxIdx ? 2 : 1));

    // Rounded corners + tighter look
    ds.borderRadius = 0;
    ds.borderSkipped = false;

    // Faux shadow via hover color + thicker bar for max
    // (Chart.js bar thickness is per-dataset, so we do max emphasis via border + hover)
    ds.hoverBackgroundColor = base.map((c, i) => (i === maxIdx ? boost : c));
    ds.hoverBorderWidth = vals.map((_, i) => (i === maxIdx ? 3 : 2));

    // Subtle bar width polish
    ds.barPercentage = 0.78;
    ds.categoryPercentage = 0.86;
  }

  function renderCharts(){
    console.log("[CEL] renderCharts v2026-02-24 polish");
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
    const somaticData = {
      labels: ['Somatic Index', 'Embodied Expansion', 'Range', 'Recovery', 'Integration Gap'],
      datasets: [{
        label: 'Somatic Scores',
        data: somaticValues
      }]
    };

    /* ---- CREATIVE DATA (second) ---- */
    const creativeValues = [10, 5, 5, 0, 0, 0, 0];
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
        data: creativeValues
      }]
    };

    const options = buildOptions();

    somaticChart = new Chart(somaticCanvas, { type: "bar", data: somaticData, options });
    creativeChart = new Chart(creativeCanvas, { type: "bar", data: creativeData, options });

    // ✅ Apply color ramps + max-bar emphasis AFTER init (prevents "all blue" defaults)
    applyPolish(somaticChart, blackByValue);
    applyPolish(creativeChart, blueByValue);
    somaticChart.update();
    creativeChart.update();

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
