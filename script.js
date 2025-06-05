const expressionText = document.querySelector("#expressionText");
const displayText = document.querySelector("#displayText");
const buttonGrid = document.querySelector("#buttonGrid");

buttonGrid.addEventListener("click", (event) => {
    const keyId = event.target.id;
    calc.build(keyId);
    expressionText.textContent = calc.expression;
    displayText.textContent = calc.display;
})

document.body.onkeydown = function (e) {
    let key = e.key;
    if (key === "Escape") {
        key = "c";
    } else if (key === "Enter") {
        key = "=";
    } else if (key === "Backspace") {
        key = "b";
    }
    calc.build(key);
    expressionText.textContent = calc.expression;
    displayText.textContent = calc.display;
};

// Calc object
// I tried to put it in a separate file but that proved to be
// more trouble than it was worth for my current skill level

const calc = {
    evalItems: ['0', '', '0'],  // Array for holding user input
    evalIdx: 0,                 // The index of the evalItems we're currently working with
    numbers: "0123456789.b",     // Pattern matching for numberical input
    operators: "+-*/",          // Pattern matching for operator input
    expression: '',             // Text to display in the 'expression' area
    display: '0',               // Text to display in the 'result' area
    // build function
    // Input from the UI is passed into this function to be processed
    // The output to the UI comes from 'expression' and 'display'
    build: function (char) {
        if (char === '') { return }

        // get the current evalItem we are building
        let current = this.evalItems[this.evalIdx];

        // This is needed if the user tries to divide by 0, we want to clear the
        // expression are so that it can be correctly repopulated
        if (this.evalIdx === 0 && this.expression.length > 0) {
            this.expression = ' '
        }

        // this.evalIdx will either be 0 or 2
        // char is a number
        if (this.numbers.includes(char)) {
            // Decimal
            if ((char === '.')) {
                // Only add the decimal if there isn't already one there
                if (!current.includes(char)) {
                    current += char;
                }
            } else {
                // Back space
                if (char === 'b') {
                    if (!(current === '0')) {
                        if (current.length === 1) {
                            current = '0';
                        } else {
                            current = current.substring(0, (current.length - 1));
                        }
                    }
                    // If the item is currently 0, don't add another 0
                } else if (current === '0') {
                    current = char;
                } else {
                    // Append the new char to the current
                    current += char;
                }
            }

            // If we're building the 2nd number of the expression, update the expression area
            if (this.evalIdx === 2) {
                this.expression = `${this.evalItems[0]} ${this.evalItems[1]}`;
            }
            // Update array & display
            this.evalItems[this.evalIdx] = current;
            this.display = current;

            // An operator was pressed
        } else if (this.operators.includes(char)) {
            // Only valid if we are working with the first number
            if (this.evalIdx === 0) {
                this.evalItems[1] = char;
                this.evalIdx = 2;
                this.expression = `${this.evalItems[0]} ${char}`;
                this.display = '0';
            }
        } else if (char === '=') {
            // Only respond if both numbers and the operand have been populated
            if (this.evalIdx === 2) {
                if (this.evalItems[1] === '/' && parseFloat(this.evalItems[2]) === 0) {
                    this.expression = "Silly Human, I Can't Divide by 0!"
                } else {
                    // Build expression
                    const expression = this.evalItems.join(' ');
                    // Use math.evaluate (much safer!)
                    let result = math.evaluate(expression);
                    // Clean deciamls
                    result = parseFloat(result.toFixed(3));

                    // Update UI and reset
                    this.evalItems = ['0', '', '0'];
                    this.evalIdx = 0;
                    this.expression = `${expression} =`;
                    this.display = result;
                }
            }
        } else if (char == 'c') {
            // AC button, reset and stat over
            this.evalIdx = 0;
            this.evalItems = ['0', '', '0'];
            this.display = '0';
            this.expression = ' ';
        }
    }
}

expressionText.textContent = ' ';
displayText.textContent = '0';

