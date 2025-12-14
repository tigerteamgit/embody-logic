if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('service-worker.js');
}


const params = new URLSearchParams(window.location.search);
if (params.get('access') !== 'YOURTOKEN') {
document.body.innerHTML = '<h2>Access required</h2>';
}
