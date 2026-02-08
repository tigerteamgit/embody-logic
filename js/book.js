/* ---- Load pages for preview vs full ---- */ 
const params = new URLSearchParams(window.location.search); 
const mode = params.get("mode") || "full"; // preview or full 

const pageFiles = mode === "preview" ? 
  ["files/a1.html", "files/a2.html"] : // add all pages here ]; async function loadPages() 
   { const book = document.getElementById("book"); 

const html = await Promise.all(pageFiles.map((p) => 
  //fetch(p).then((r) => r.text()))); book.innerHTML = html.join("\n"); 
  { console.log("Fetching:", p);
    const res = await fetch(p, { cache: "no-store" });
    console.log("Result:", p, res.status);
    if (!res.ok) throw new Error(`${p} -> HTTP ${res.status}`);
    return res.text();
  })
);

/* ---- Initialize flipbook ---- */ 
const pageFlip = new St.PageFlip(book, { width: 360, height: 640, size: "stretch", showCover: true, }); 
pageFlip.loadFromHTML(document.querySelectorAll(".page")); } 

loadPages();


