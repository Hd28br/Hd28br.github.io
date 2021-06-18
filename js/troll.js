var R = true;
var R2 = "?";
var R3 = 0;

document.addEventListener("click", function() {
    R = false;
    document.write("<video width=\"100%\" height=\"100%\" autoplay><source src=\"https://shattereddisk.github.io/rickroll/rickroll.mp4\" type=\"video/mp4\"></video>");
});

for (let index = 0; index < 1000; index++) {
    if (1 == 1) {
        document.getElementById("19dollar").innerText = R2;
        R2 += "?";
        R3 += 1;

        if (R3 == 15) {
            R2 += "\n";
            R3 = 0;
        }
    }
}