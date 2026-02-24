<script>
/* ---- Fixed chart height ---- */
const CHART_H = 150;

function lockCanvasHeight(canvas, px){
  if(!canvas) return;
  canvas.style.height = px + "px";
  canvas.style.maxHeight = px + "px";
  canvas.height = px;
}

/* =========================================================
   SOMATIC FIRST (ALWAYS)
========================================================= */

/* ---- Somatic Data ---- */
const somaticData = {
  labels: [
    "Somatic Index",
    "Embodied Expansion",
    "Range",
    "Recovery",
    "Integration Gap"
  ],
  datasets: [{
    label: "Somatic Scores",
    data: [19, 15, 0, 5, 9],
    borderWidth: 1,
    backgroundColor: "rgba(34,197,94,0.35)",   // green
    borderColor: "rgba(34,197,94,0.9)"
  }]
};

/* ---- Creative Data ---- */
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
    backgroundColor: "rgba(59,130,246,0.35)",  // blue
    borderColor: "rgba(59,130,246,0.9)"
  }]
};

/* ---- Shared Chart Options ---- */
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,  // critical
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

/* =========================================================
   RENDER ORDER: SOMATIC → CREATIVE
========================================================= */

/* ---- Somatic Chart ---- */
const somaticCanvas = document.getElementById("somaticChart");
lockCanvasHeight(somaticCanvas, CHART_H);

new Chart(somaticCanvas, {
  type: "bar",
  data: somaticData,
  options: baseOptions
});

/* ---- Creative Chart ---- */
const creativeCanvas = document.getElementById("creativeChart");
lockCanvasHeight(creativeCanvas, CHART_H);

new Chart(creativeCanvas, {
  type: "bar",
  data: creativeData,
  options: baseOptions
});
</script>
