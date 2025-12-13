const pageFlip = new St.PageFlip(
  document.getElementById("book"),
  { width: 360, height: 640 }
);

pageFlip.loadFromHTML(document.querySelectorAll(".page"));
