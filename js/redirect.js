const params = new URLSearchParams(location.search);
console.log(params.get("url"));

window.location.href = atob(params.get("url"));