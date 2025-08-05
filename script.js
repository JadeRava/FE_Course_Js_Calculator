const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");
const percentButton = document.getElementById("percent");

let firstNum = "";
let secondNum = "";
let currentOperator = null;
let waitingForSecond = false;

function updateDisplay(value) {
  if (value.toString().length > 17) {
    display.textContent = value.toString().slice(0, 17);
  } else {
    display.textContent = value;
  }
}

function calculate(a, b, op) {
  a = Number(a);
  b = Number(b);
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? "ERR" : a / b;
}

function roundResult(num) {
  return Math.round(num * 100000) / 100000;
}

updateDisplay("0");

numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (waitingForSecond) {
      secondNum = button.textContent === "." ? "0." : button.textContent;
      waitingForSecond = false;
    } else {
      if (button.textContent === "." && display.textContent.includes(".")) return;
      if (display.textContent === "0" && button.textContent !== ".") {
        secondNum = button.textContent;
      } else {
        secondNum = display.textContent + button.textContent;
      }
    }
    updateDisplay(secondNum);
  });
});

operatorButtons.forEach(button => {
  button.addEventListener("click", () => {
    const op = button.textContent;
    if (op === "=") {
      if (currentOperator && secondNum !== "") {
        let result = calculate(firstNum, secondNum, currentOperator);
        if (typeof result === "number") result = roundResult(result);
        updateDisplay(result);
        firstNum = result.toString();
        secondNum = "";
        currentOperator = null;
      }
    } else {
      if (currentOperator && secondNum !== "") {
        let result = calculate(firstNum, secondNum, currentOperator);
        if (typeof result === "number") result = roundResult(result);
        updateDisplay(result);
        firstNum = result.toString();
        secondNum = "";
      } else if (secondNum !== "") {
        firstNum = secondNum;
        secondNum = "";
      }
      currentOperator = op;
      waitingForSecond = true;
    }
  });
});

clearButton.addEventListener("click", () => {
  firstNum = "";
  secondNum = "";
  currentOperator = null;
  waitingForSecond = false;
  updateDisplay("0");
});

backspaceButton.addEventListener("click", () => {
  if (!waitingForSecond && secondNum.length > 0) {
    secondNum = secondNum.slice(0, -1);
    if (secondNum === "") secondNum = "0";
    updateDisplay(secondNum);
  }
});

percentButton.addEventListener("click", () => {
  if (secondNum !== "") {
    let num = Number(secondNum) / 100;
    secondNum = num.toString();
    updateDisplay(secondNum);
  }
});

window.addEventListener("keydown", function(e) {
  const key = e.key;

  if ((key >= '0' && key <= '9') || key === '.') {
    const btn = document.querySelector(`button.number[data-key="${key}"]`);
    if (btn) btn.click();
  } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '=') {
    const op = key === '=' ? '=' : key;
    const btn = document.querySelector(`button.operator[data-key="${op}"]`);
    if (btn) btn.click();
  } else if (key === "Enter") {
    const btn = document.querySelector(`button.operator[data-key="="]`);
    if (btn) btn.click();
    e.preventDefault();
  } else if (key === "Backspace") {
    backspaceButton.click();
  } else if (key.toLowerCase() === "c") {
    clearButton.click();
  } else if (key === "%") {
    percentButton.click();
  }
});

