const book = document.getElementById('book');


fetch('pages/page1.html').then(r => r.text()).then(p1 => {
fetch('pages/page2.html').then(r => r.text()).then(p2 => {
fetch('pages/page3.html').then(r => r.text()).then(p3 => {


book.innerHTML = p1 + p2 + p3;


const pageFlip = new St.PageFlip(book, {
width: 360,
height: 640,
size: 'stretch',
showCover: true
});


pageFlip.loadFromHTML(document.querySelectorAll('.page'));


});});});
