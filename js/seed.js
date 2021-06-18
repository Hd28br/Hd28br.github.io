function Gen(seed,len_) {
    let S = seed;
    let Characters = "abcdefghijklmnopqrstuvwxyz "
    Characters = Characters.split("");
    let Result = ""

    for (let index = 0; index < len_; index++) {
        const element = index;
        let rng = new Math.seedrandom(S);

        Result += Characters[Math.floor(rng() * Characters.length)];

        S = S * 2;
    }

    return Result;
};

function A() {
    document.getElementById("result").value = Gen(document.getElementById("seed").value,document.getElementById("length").value);
}