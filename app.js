let calc_buttons = [
    { name: "percent", symbol: "%", formula: "/100", type: "number" },
    { name: "clear", symbol: "C", formula: false, type: "key" },
    { name: "delete", symbol: "⌫", formula: false, type: "key" },
    { name: "division", symbol: "÷", formula: "/", type: "operator" },
    { name: "7", symbol: 7, formula: 7, type: "number" },
    { name: "8", symbol: 8, formula: 8, type: "number" },
    { name: "9", symbol: 9, formula: 9, type: "number" },
    { name: "times", symbol: "×", formula: "*", type: "operator" },
    { name: "4", symbol: 4, formula: 4, type: "number" },
    { name: "5", symbol: 5, formula: 5, type: "number" },
    { name: "6", symbol: 6, formula: 6, type: "number" },
    { name: "minus", symbol: "−", formula: "-", type: "operator" },
    { name: "1", symbol: 1, formula: 1, type: "number" },
    { name: "2", symbol: 2, formula: 2, type: "number" },
    { name: "3", symbol: 3, formula: 3, type: "number" },
    { name: "plus", symbol: "+", formula: "+", type: "operator" },
    { name: "plusMinus", symbol: "±", formula: false, type: "key" },
    { name: "0", symbol: 0, formula: 0, type: "number" },
    { name: "comma", symbol: ".", formula: ".", type: "number" },
    { name: "equal", symbol: "=", formula: false, type: "calculate" },
];
const input = document.querySelector(".input"),
    output_result = document.querySelector(".result .value"),
    output_operation = document.querySelector(".operation .value");
let data = { operation: [], result: [], history: [] };

// create calculator buttons
function createButtons() {
    const btns_per_row = 4;
    let added_btns = 0;
    calc_buttons.forEach((button) => {
        if (added_btns % btns_per_row == 0) {
            input.innerHTML += '<div class="row"></div>';
        }
        const row = document.querySelector(".row:last-child");
        row.innerHTML +=
            "<button id=" +
            button.name +
            " class=" +
            button.type +
            "> " +
            button.symbol +
            "";
        added_btns++;
    });
}
createButtons();
// Add click buttons event
input.addEventListener("click", (event) => {
    const targetBtn = event.target;
    // console.log(targetBtn);
    calc_buttons.map((button) => {
        if (button.name === targetBtn.id) {
            calculator(button);
        }
    });
});
// Add keydown event and calculate
document.addEventListener("keydown", keydown);

function keydown(e) {
    let historyStr = data.history.join("");
    if (!isNaN(e.key)) {
        if (historyStr[historyStr.length - 1] === "=") {
            data.operation = [];
            data.result = [];
            updateResult(0);
        }
        data.operation.push(e.key);
        data.result.push(e.key);
        data.history.push(e.key);
        updateOperator(data.operation.join(""));
    }
    switch (e.key) {
        case "c":
        case "Escape":
            data.operation = [];
            data.result = [];
            updateResult(0);
            updateOperator(data.operation.join(""));
            break;
        case "Backspace":
            data.operation.pop();
            data.result.pop();
            updateOperator(data.operation.join(""));
            break;
        case "Enter":
        case "=":
            pressEqual();
            break;
        case ".":
        case "+":
        case "-":
        case "%":
            data.operation.push(e.key);
            data.result.push(e.key);
            data.history.push(e.key);
            updateOperator(data.operation.join(""));
            break;
        case "*":
            data.operation.push("x");
            data.result.push(e.key);
            data.history.push(e.key);
            updateOperator(data.operation.join(""));
            break;
        case "/":
            data.operation.push("÷");
            data.result.push(e.key);
            data.history.push(e.key);
            updateOperator(data.operation.join(""));
            break;
    }
}
// calculator function when click

function calculator(button) {
    let historyStr = data.history.join(""),
        operationStr = data.operation.join("");
    resultStr = data.result.join("");
    if (button.type == "operator") {
        data.operation.push(button.symbol);
        data.result.push(button.formula);
        data.history.push(button.formula);
    } else if (button.type == "number") {
        // reset operation
        if (historyStr[historyStr.length - 1] === "=") {
            data.operation = [];
            data.result = [];
            updateResult(0);
        }
        data.operation.push(button.symbol);
        data.result.push(button.formula);
        data.history.push(button.formula);
    } else if (button.type == "key") {
        if (button.name == "clear") {
            data.operation = [];
            data.result = [];
            updateResult(0);
        } else if (button.name == "delete") {
            data.operation.pop();
            data.result.pop();
        } else if (button.name == "plusMinus") {
            if (!operationStr.match(/^[-]/)) {
                data.operation.unshift("-");
                data.result.unshift("-");
            } else if (operationStr[0] === "-") {
                data.operation.shift();
                data.result.shift();
            }
        }
    } else if (button.type == "calculate") {
        let historyStr = data.history.join(""),
            operationStr = data.operation.join(""),
            resultStr = data.result.join("");
        if (historyStr[historyStr.length - 1] !== "=") {
            data.history.push("=");
        }

        // create an Array store all the number from input
        let numbersArray = data.history
            .join("")
            .split(/[^0-9.]+/g)
            .filter((i) => i !== "");
        // convert type value of numbersArray to number type
        numbersArray = numbersArray.map((i) => Number(i));
        // create an Array store operator from input
        let operatorsArray = data.history
            .join("")
            .split(/[0-9.=]+/g)
            .filter((op) => op !== "");

        // add symbol = into operation line
        if (!data.operation.join("").match(/$[=]/) && operationStr != "") {
            data.operation.push("=");
            updateOperator(data.operation.join(""));
        }
        // display calculate result
        let myResult = eval(resultStr);
        myResult = formatResult(myResult);
        updateResult(myResult);
        data.operation = [];
        data.result = [];
        data.result.push(
            myResult,
            operatorsArray[operatorsArray.length - 1],
            numbersArray[numbersArray.length - 1]
        );
        data.operation.push(
            myResult,
            convertOperator(operatorsArray[operatorsArray.length - 1]),
            numbersArray[numbersArray.length - 1]
        );
        return;
    }
    updateOperator(data.operation.join(""));
    console.log(historyStr);
    console.log(operationStr);
}

function updateResult(result) {
    output_result.innerHTML = result;
}

function updateOperator(operation) {
    output_operation.innerHTML = operation;
    // console.log(data.history);
}
//format result
function formatResult(result) {
    const max_num_length = 12,
        output_result_toPrecision = 6;
    if (counterNum(result) > max_num_length) {
        if (isFloat(result)) {
            const intNum = parseInt(result);
            const intNumLength = counterNum(intNum);
            if (intNumLength > max_num_length) {
                return result.toPrecision(output_result_toPrecision);
            } else {
                return result.toFixed(max_num_length - intNumLength);
            }
        } else {
            return result.toPrecision(output_result_toPrecision);
        }
    }
    return result;
}
// count the total number length of result
function counterNum(number) {
    return number.toString().length;
}
// check a number is a float or not
function isFloat(n) {
    return n % 1 !== 0;
}
// convert operator to output operation display
function convertOperator(i) {
    switch (i) {
        case "%":
            return "%";
        case "+":
            return "+";
        case "-":
            return "-";
        case "*":
            return "x";
        case "/":
            return "÷";
    }
}
// when press equal button function
function pressEqual() {
    let historyStr = data.history.join(""),
        operationStr = data.operation.join(""),
        resultStr = data.result.join("");
    if (historyStr[historyStr.length - 1] !== "=") {
        data.history.push("=");
    }

    // create an Array store all the number from input
    let numbersArray = data.history
        .join("")
        .split(/[^0-9.]+/g)
        .filter((i) => i !== "");
    // convert type value of numbersArray to number type
    numbersArray = numbersArray.map((i) => Number(i));
    // create an Array store operator from input
    let operatorsArray = data.history
        .join("")
        .split(/[0-9.=]+/g)
        .filter((op) => op !== "");

    // add symbol = into operation line
    if (!data.operation.join("").match(/$[=]/) && operationStr != "") {
        data.operation.push("=");
        updateOperator(data.operation.join(""));
    }
    // display calculate result
    let myResult = eval(resultStr);
    myResult = formatResult(myResult);
    updateResult(myResult);
    data.operation = [];
    data.result = [];
    data.result.push(
        myResult,
        operatorsArray[operatorsArray.length - 1],
        numbersArray[numbersArray.length - 1]
    );
    data.operation.push(
        myResult,
        convertOperator(operatorsArray[operatorsArray.length - 1]),
        numbersArray[numbersArray.length - 1]
    );
    return;
}