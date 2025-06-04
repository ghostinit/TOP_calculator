const expressionText = document.querySelector("#expressionText");
const displayText = document.querySelector("#displayText");
const buttonGrid = document.querySelector("#buttonGrid");

buttonGrid.addEventListener("click", (event) => {
    keyId = event.target.id;
    //console.log(`Key: ${keyId}`);
    calc.build(keyId);
    expressionText.textContent = calc.expression;
    displayText.textContent = calc.display;
})

buttonGrid.addEventListener("mousedown", (event) => {
    event.target.classList.add("pressed");
})

buttonGrid.addEventListener("mouseup", (event) => {
    btns = document.querySelectorAll(".calcButton, .calcButtonLg")
    btns = Array.from(btns);
    for (let btn of btns) {
        btn.classList.remove("pressed");
    }
})
// buttonGrid.addEventListener("keydown", (event) => {
//     keyPressed = event.key;
//     console.log(key);
// })

document.body.onkeydown = function (e) {
    let key = e.key;
    console.log(key);
    if (key === "Escape") {
        key = "c";
    } else if (key === "Enter") {
        key = "=";
    }
    calc.build(key);
    expressionText.textContent = calc.expression;
    displayText.textContent = calc.display;
};





// Calc object
// I tried to put it in a separate file but that proved to be
// more trouble than it was worth

const calc = {
    evalItems: ['0', '', '0'],
    evalIdx: 0,
    numbers: "0123456789.",
    operators: "+-*/",
    expression: '',
    display: '0',
    // Steps
    // 0 -> Getting first number
    //      input of a valid operator advance to 1
    // 1 -> Getting 2nd number
    //      input of '=' advances to 2
    // 2 -> Calculate results
    build: function (char) {
        if (char === '') { return }
        let current = this.evalItems[this.evalIdx];
        if (this.evalIdx === 0 && this.expression.length > 0) {
            this.expression = ' '
        }
        // this.evalIdx should either be 0 or 2
        if (this.numbers.includes(char)) {
            if ((char === '.')) {
                if (!current.includes(char)) {
                    current += char;
                }
            } else {
                if (current === '0') {
                    current = char;
                } else {
                    current += char;
                }
            }
            if (this.evalIdx === 2) {
                this.expression = `${this.evalItems[0]} ${this.evalItems[1]}`;
            }
            this.evalItems[this.evalIdx] = current;
            this.display = current;
        } else if (this.operators.includes(char)) {
            if (this.evalIdx === 0) {
                this.evalItems[1] = char;
                this.evalIdx = 2;
                this.expression = `${this.evalItems[0]} ${char}`;
                this.display = '0';
            }
        } else if (char === '=') {
            if (this.evalIdx === 2) {
                if (this.evalItems[2] === '0') {
                    this.expression = "Silly Human, Can't Divide by 0!"
                } else {
                    const expression = this.evalItems.join(' ');
                    let result = math.evaluate(expression);
                    result = Math.trunc(result * 1000) / 1000
                    console.log(result);
                    this.evalItems = ['0', '', '0'];
                    this.evalIdx = 0;
                    this.expression = `${expression} =`;
                    this.display = result;
                }
            }
        } else if (char == 'c') {
            this.evalIdx = 0;
            this.evalItems = ['0', '', '0'];
            this.display = '0';
            this.expression = ' ';
        }
    }
}

expressionText.textContent = ' ';
displayText.textContent = '0';

