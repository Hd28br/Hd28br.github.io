hljs.highlightAll();

function RepeaterList(string_) {
    let Result = [];
    let Repeat = [string_[0],0];

    for (let index = 0; index < string_.length; index++) {
        const element = string_[index];
        
        if (Repeat[0] == element) {
            Repeat[1]++;
        } else {
            Result.push(Repeat);
            Repeat = [element,1];
        }
    }

    Result.push(Repeat);

    return Result;
}

function Compress(code) {
    let Result = code;

    Result = Result.replace(/^\[[^\[\]]*\]/g, "");
    Result = Result.replace(/[^\[\]\.,\+\-<>]/g, "");
    Result = Result.replace(/\[\+]/g, "[-]");
    
    Result = Result.replace(/\[\-]\[\-]/g, "[-]");
    
    while (Result.substring(0,3) === "[-]") {
        Result = Result.substring(3);

        Result = Result.replace(/<>|></g,"");
        Result = Result.replace(/\+\-|\-\+/g,"");
    }
    
    Result = Result.replace(/<>|></g,"");
    Result = Result.replace(/\+\-|\-\+/g,"");
    
    return Result;
}

function bf2js(code,TWbit = false) {
    let MCode = code.replace(/\[\-\]/g,"E");
    //MCode = code.replace(/\[\>\+\+<\-\]/g,"T");
    
    SMCode = MCode;
    MCode = [];

    let Mult = [];

    for (let index = 2; index < 300; index++) {
        for (let index2 = 1; index2 < 20; index2++) {
            Mult.push([
                "[" + ">".repeat(index2) + ("+".repeat(index)) + "<".repeat(index2) + "-]", index, index2
            ]);
    
            Mult.push([
                "[-" + ">".repeat(index2) + ("+".repeat(index)) + "<".repeat(index2) + "]", index, index2
            ]);
        }
    }

    for (let index = 0; index < SMCode.length; index++) {
        const element = SMCode[index];
        
        if (element == "[") {
            let Found = false;

            Mult.forEach(element2 => {
                if (element2[0] == SMCode.substring(index,index + element2[0].length)) {
                    Found = true;
                    
                    MCode.push(["M",element2[1],element2[2]]);
                    index += element2[0].length;
                }
            });

            if (Found == false) {
                MCode.push("[");
            }
        } else {
            MCode.push(element);
        }
    }

    MCode = RepeaterList(MCode);

    let Result = "var Arr = new Uint"

    if (TWbit) {
        Result += "32";
    } else {
        Result += "8";
    }
    
    Result += "Array(8000);\nvar Pos = 0;\nvar Print = \"\";\nvar Input_ = prompt(\"Input\");\n\n\nfunction Input() {\n    Arr[Pos] = Input_.charCodeAt(0);\n    Input_ = Input_.substring(1);\n}\n\nsetInterval(function () {\n    document.body.innerText = Print;\n},100);\n\n// -----------------------------------------------\n\n";
    
    let In = 0;

    for (let index = 0; index < MCode.length; index++) {
        const element = MCode[index];
        In = Math.abs(In);
        
        if (element[0] == ">") {
            if (element[1] == 1) {
                Result += "    ".repeat(In) + "Pos++;\n";
            } else {
                Result += "    ".repeat(In) + "Pos += " + element[1] + ";\n";
            }
        }

        if (element[0] == "<") {
            if (element[1] == 1) {
                Result += "    ".repeat(In) + "Pos--;\n";
            } else {
                Result += "    ".repeat(In) + "Pos -= " + element[1] + ";\n";
            }
        }

        if (element[0] == "+") {
            if (element[1] == 1) {
                Result += "    ".repeat(In) + "Arr[Pos]++;\n"
            } else {
                Result += "    ".repeat(In) + "Arr[Pos] += " + element[1] + ";\n";
            }
        }

        if (element[0] == "-") {
            if (element[1] == 1) {
                Result += "    ".repeat(In) + "Arr[Pos]--;\n"
            } else {
                Result += "    ".repeat(In) + "Arr[Pos] -= " + element[1] + ";\n";
            }
        }

        if (element[0] == "E") {
            Result += "    ".repeat(In) + "Arr[Pos] = 0;\n";
        }

        if (element[0] == "[") {
            for (let index = 0; index < element[1]; index++) {
                Result += "    ".repeat(In) + "while (Arr[Pos] != 0) {\n";
                In++;   
            }
        }

        if (element[0] == "]") {
            for (let index = 0; index < element[1]; index++) {
                In--;

                if (In < 0) {
                    In = 0;
                }

                Result += "    ".repeat(In) + "}\n";
            }
        }

        if (element[0] == ".") {
            if (element[1] == 1) {
                // Fake space [ ]
                Result += "    ".repeat(In) + "Print += String.fromCharCode(Arr[Pos]);\n";
            } else {
                Result += "    ".repeat(In) + "Print += String.fromCharCode(Arr[Pos]).repeat(" + element[1] + ");\n";
            }
        }

        if (element[0][0] == "M") {
            for (let index = 0; index < element[1]; index++) {
                console.log(element[0]);
                Result += "    ".repeat(In) + "Arr[Pos + " + element[0][2] + "] += Arr[Pos] * " + element[0][1] + "; Arr[Pos] = 0;\n";
            }
        }

        if (element[0] == ",") {
            for (let index = 0; index < element[1]; index++) {
                Result += "    ".repeat(In) + "Input();\n";
            }
        }
    }

    return Result;
}

// --------------------------------------------------------

var GCode = "// Brainfuck to javascript";

function Button() {
    let Start = Date.now();

    if (document.getElementById("checkbox-cb").checked) {
        document.getElementById("input").value = Compress(document.getElementById("input").value);
    }

    let cod = document.getElementById("input").value;

    GCode = bf2js(cod,document.getElementById("checkbox-tw").checked);

    if (document.getElementById("checkbox-cj").checked) {
        fetch("https://javascript-minifier.com/raw", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": "input=" + encodeURI(GCode)
        }).then(function (data) {
            document.getElementsByClassName("language-javascript")[0].innerHTML = GCode;
            document.getElementById("info").innerText = "Time spent: " + (((Date.now() - Start) / 1000).toFixed(2)) + "s";
            hljs.highlightAll();
        });
    } else {
        document.getElementsByClassName("language-javascript")[0].innerHTML = GCode;
        document.getElementById("info").innerText = "Time spent: " + (((Date.now() - Start) / 1000).toFixed(2)) + "s";
        hljs.highlightAll();
    }
}

console.log(GCode);

function Copy() {
    let temp = document.createElement("textarea");
    let text = GCode;
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    
    iqwerty.toast.toast("📋 Copied",{
        "style": {
            "main": {
                "background": "green",
                "color": "white"
            }
        }
    });
}