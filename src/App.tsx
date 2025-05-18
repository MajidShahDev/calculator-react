import { useState, useRef } from 'react';
import './App.css';

function isDigit(char: string) {
  return /\d/.test(char);
}

function isOperator(char: string) {
  return ['+', '-', '*', '/', '%'].includes(char);
}

function performCalculation(
  operand1: number,
  operand2: number,
  operator: string
) {
  switch (operator) {
    case '+':
      return operand1 + operand2;
    case '-':
      return operand1 - operand2;
    case '*':
      return operand1 * operand2;
    case '/':
      return operand1 / operand2;
    case '%':
      return operand1 * (operand2 / 100);
    case '√':
      return Math.sqrt(operand1);
    default:
      return 0;
  }
}

function evaluateExpression(expression: string): number {
  // Replace 'x' with '*'
  expression = expression.replace(/x/g, '*');

  // Prevent evaluation if expression ends with √ or contains standalone √
  if (/√$/.test(expression) || /√[^\d.]/.test(expression)) {
    throw new Error('Incomplete square root expression');
  }

  // Insert '*' between number and √ (e.g., 9√9 => 9*√9)
  expression = expression.replace(/(\d)\s*√/g, '$1*√');

  // Replace √number with its square root
  expression = expression.replace(/√(\d+(\.\d+)?)/g, (_, number) => {
    return Math.sqrt(parseFloat(number)).toFixed(2);
  });

  // Remove trailing operators
  while (
    expression.length > 0 &&
    ['+', '*', '/', '%'].includes(expression[expression.length - 1])
  ) {
    expression = expression.slice(0, -1);
  }

  const tokens: string[] = [];
  let current = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (isDigit(char) || char === '.') {
      current += char;
    } else if (isOperator(char)) {
      if (char === '-' && (i === 0 || isOperator(expression[i - 1]))) {
        current += char;
      } else {
        if (current) tokens.push(current);
        current = '';
        while (
          tokens.length > 0 &&
          isOperator(tokens[tokens.length - 1]) &&
          tokens[tokens.length - 1] !== '-'
        ) {
          tokens.pop();
        }
        tokens.push(char);
      }
    }
  }

  if (current) tokens.push(current);

  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const nextOperand = parseFloat(tokens[i + 1]);

    result = performCalculation(result, nextOperand, operator);
  }

  return result;
}

function App() {
  const [inputDisplay, setInputDisplay] = useState('0');
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (value: string) => {
    setInputDisplay((prev) => {
      const operators = ['+', '*', '/', 'x'];
      const allOperators = ['+', '-', '*', '/', 'x'];

      // Prevent multiple decimals in the current number
      if (value === '.') {
        const parts = prev.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return prev;
      }

      const lastChar = prev[prev.length - 1];
      const secondLastChar = prev[prev.length - 2];

      // Allow the first "-" after an operator but prevent subsequent ones
      if (value === '-' && allOperators.includes(lastChar)) {
        // Allow "- " after an operator, but only once
        const operatorCount = prev.split(/[\+\-\*\/]/).length - 1;
        if (operatorCount === 1) return prev + value;
      }

      // Replace double operators with new one (except valid "-")
      if (
        allOperators.includes(lastChar) &&
        lastChar === '-' &&
        allOperators.includes(secondLastChar) &&
        allOperators.includes(value)
      ) {
        return prev.slice(0, -2) + value;
      }

      // Replace last operator (except valid "-")
      if (
        allOperators.includes(lastChar) &&
        allOperators.includes(value) &&
        !(value === '-' && operators.includes(lastChar))
      ) {
        return prev.slice(0, -1) + value;
      }

      // Replace leading 0 (except for decimals)
      if (prev === '0' && value !== '.') {
        return value;
      }

      return prev + value;
    });

    setTimeout(() => {
      try {
        const resultValue = evaluateExpression(inputDisplay + value);
        setResult(resultValue.toString());
      } catch (err) {
        setResult('');
      }
    }, 0);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollLeft = inputRef.current.scrollWidth;
      }
    }, 0);
  };

  const handleClear = () => {
    setInputDisplay('0');
    setResult('');
  };

  const handleDelete = () => {
    setInputDisplay((prev) => prev.slice(0, -1));
  };

  const handleEqual = () => {
    try {
      const resultValue = evaluateExpression(inputDisplay);
      setResult('');
      setInputDisplay(resultValue.toString());
    } catch (err) {
      setResult('Error');
    }
  };

  return (
    <div id="wrapper">
      <div id="container">
        <div>
          <input id="display" ref={inputRef} value={inputDisplay} readOnly />
          <input id="calc" value={result} readOnly />
        </div>

        <div id="all-buttons">
          <button id="clear" className="green" onClick={handleClear}>
            C
          </button>
          <button
            id="parenthesis"
            className="blue"
            onClick={() => handleClick('√')}
          >
            &radic;
          </button>
          <button
            id="percentage"
            className="blue percentage"
            onClick={() => handleClick('%')}
          >
            %
          </button>
          <button
            id="divide"
            className="blue divide"
            onClick={() => handleClick('/')}
          >
            ÷
          </button>

          <button id="seven" onClick={() => handleClick('7')}>
            7
          </button>
          <button id="eight" onClick={() => handleClick('8')}>
            8
          </button>
          <button id="nine" onClick={() => handleClick('9')}>
            9
          </button>
          <button
            id="multiply"
            className="blue multiply"
            onClick={() => handleClick('x')}
          >
            x
          </button>

          <button id="four" onClick={() => handleClick('4')}>
            4
          </button>
          <button id="five" onClick={() => handleClick('5')}>
            5
          </button>
          <button id="six" onClick={() => handleClick('6')}>
            6
          </button>
          <button
            id="subtract"
            className="blue subtract"
            onClick={() => handleClick('-')}
          >
            -
          </button>

          <button id="one" onClick={() => handleClick('1')}>
            1
          </button>
          <button id="two" onClick={() => handleClick('2')}>
            2
          </button>
          <button id="three" onClick={() => handleClick('3')}>
            3
          </button>
          <button id="add" className="blue" onClick={() => handleClick('+')}>
            +
          </button>

          <button id="zero" onClick={() => handleClick('0')}>
            0
          </button>
          <button id="decimal" onClick={() => handleClick('.')}>
            .
          </button>
          <button id="delete-last" onClick={handleDelete}>
            ←
          </button>
          <button id="equals" className="dark-blue" onClick={handleEqual}>
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
