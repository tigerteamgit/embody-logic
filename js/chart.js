<script>
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
    borderWidth: 1
  }]
};

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
    borderWidth: 1
  }]
};

/* ---- Creative Chart ---- */
new Chart(document.getElementById("somaticChart"), {
  type: "bar",
  data: somaticData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

/* ---- Somatic Chart ---- */
new Chart(document.getElementById("creativeChart"), {
  type: "bar",
  data: creativeData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});
</script>
