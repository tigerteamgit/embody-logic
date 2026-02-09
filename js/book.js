/* ---- Load pages for preview vs full ---- */
const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "full"; // preview or full

console.log("St:", window.St);
console.log("St.PageFlip:", window.St?.PageFlip);

const pageFiles =
  mode === "preview"
    ? ["files/a1.html", "files/a2.html"] // preview pages only
    : [
        "files/a1.html",
        "files/a2.html",
        // add all full pages here, e.g.
        // "files/a3.html",
        // "files/a4.html",
      ];

async function loadPages() {
  try {
    const bookEl = document.getElementById("book");

    const html = await Promise.all(
      pageFiles.map(async (p) => {
        console.log("Fetching:", p);
        const res = await fetch(p, { cache: "no-store" });
        console.log("Result:", p, res.status);
        if (!res.ok) throw new Error(`${p} -> HTTP ${res.status}`);
        return res.text();
      })
    );

    bookEl.innerHTML = html.join("\n");

    /* ---- Initialize flipbook ---- */
    const pageFlip = new St.PageFlip(bookEl, {
      width: 400,
      height: 600,
      size: "fixed",
      showCover: true,
      usePortrait: false
    });

    const pages = document.querySelectorAll(".page");
    console.log("Pages found:", pages.length);

    pageFlip.loadFromHTML(pages);
  } catch (err) {
    console.error("Book load failed:", err);
    const bookEl = document.getElementById("book");
    if (bookEl) {
      bookEl.innerHTML =
        `<div class="page"><h2>Error loading book</h2><pre>${String(err)}</pre></div>`;
    }
  }
}

loadPages();
