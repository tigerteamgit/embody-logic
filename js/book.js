/* ---- Load pages for preview vs full ---- */
const params = new URLSearchParams(window.location.search);

const ACCESS_TOKEN = "123TTR";           // <-- CHANGE THIS
const isUnlocked = params.get("access") === ACCESS_TOKEN;

const mode = params.get("mode") || "full";  // preview or full
const shouldShowFull = isUnlocked && mode === "full";

/* ---- Choose files ---- */
const previewFiles = ["files/a1.html", "files/a2.html", "files/a3.html"];
const fullFiles = [
  "files/a1.html",
  "files/a2.html",
  "files/a3.html",
  "files/a4.html",
  "files/a5.html",
  // add all pages here
];

const pageFiles = shouldShowFull ? fullFiles : previewFiles;

async function loadPages() {
  const book = document.getElementById("book");
  const html = await Promise.all(pageFiles.map((p) => fetch(p).then((r) => r.text())));
  book.innerHTML = html.join("\n");

  /* ---- Initialize flipbook ---- */
  const pageFlip = new St.PageFlip(book, {
    width: 360,
    height: 640,
    size: "stretch",
    showCover: true,
  });

  pageFlip.loadFromHTML(document.querySelectorAll(".page"));
}

loadPages();
