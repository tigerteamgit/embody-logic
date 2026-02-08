/* ---- PWA / Service Worker ---- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* ---- Access Gate (Preview allowed) ---- */
const ACCESS_TOKEN = "123TTR"; // change this
const params = new URLSearchParams(window.location.search);
const isUnlocked = params.get("access") === ACCESS_TOKEN;

/* ---- Toggle Full Access UI ---- */
const fullAccessCard = document.getElementById("fullAccessCard");
if (fullAccessCard && isUnlocked) {
  fullAccessCard.style.display = "block";
}


