const prompt = require('prompt-sync')();
const { evaluate } = require('mathjs');

let calc = {
    evalItems: ['0', '', '0'],
    evalIdx: 0,
    numbers: "0123456789.",
    operators: "+-*/",
    keepGoing: true,
    // Steps
    // 0 -> Getting first number
    //      input of a valid operator advance to 1
    // 1 -> Getting 2nd number
    //      input of '=' advances to 2
    // 2 -> Calculate results
    build: function (char) {
        if (char === '') { return }
        if (char === 'e') { this.keepGoing = false }
        let current = this.evalItems[this.evalIdx];
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
            this.evalItems[this.evalIdx] = current;
            return current;
        } else if (this.operators.includes(char)) {
            if (this.evalIdx === 0) {
                this.evalItems[1] = char;
                this.evalIdx = 2;
                return this.evalItems[0];
            }
        } else if (char === '=') {
            if (this.evalIdx === 2) {
                const expression = this.evalItems.join(' ');
                const result = evaluate(expression);
                console.log(result);
                this.evalItems = ['0', '', '0'];
                this.evalIdx = 0;
                return result;
            }
        }
    }
}

while (calc.keepGoing) {
    const char = prompt("Enter Value: ");
    console.log(`display: ${calc.build(char)}`);
    console.log(calc.evalItems);
}