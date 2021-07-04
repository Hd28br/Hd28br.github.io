var texts = [
    "Bing chillin",
    "Bingus",
    "F"
];

document.getElementsByClassName("splash-text")[0].innerText = texts[Math.floor(Math.random() * texts.length)];
