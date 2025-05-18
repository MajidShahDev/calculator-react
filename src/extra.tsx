


import { useState } from 'react';
import './App.css';

function App() {
  const [inputDisplay, setInputDisplay] = useState('0');
  const [result, setResult] = useState('0');

const handleClick = (value: string) => {
  setInputDisplay(prev => {
    const operators = ['+', '*', '/', 'X'];
    const allOperators = ['+', '-', '*', '/', 'X'];

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

    // If last two characters are operators and now another operator is pressed, replace both
    if (
      allOperators.includes(lastChar) &&
      lastChar === '-' &&
      allOperators.includes(secondLastChar) &&
      allOperators.includes(value)
    ) {
      return prev.slice(0, -2) + value;
    }

    // Replace last operator if current value is operator (excluding valid "-" case)
    if (
      allOperators.includes(lastChar) &&
      allOperators.includes(value) &&
      !(value === '-' && operators.includes(lastChar))
    ) {
      return prev.slice(0, -1) + value;
    }

    // Remove leading 0 unless it's followed by '.'
    if (prev === '0' && value !== '.') {
      return value;
    }
    
    return prev + value;
  });
};

  const handleClear = () => {
    setInputDisplay('0');
    setResult('0');
  };

  const handleDelete = () => {
    setInputDisplay(prev => prev.slice(0, -1));
  };

  const handleEqual = () => {
    try {
      // Replace 'X' with '*'
      const formatted = inputDisplay.replace(/X/g, '*');
      const evaluated = eval(formatted); // Caution: eval for basic calculators only
      setInputDisplay(evaluated.toString());
      setResult(evaluated.toString());
    } catch (err) {
      setResult('Error');
    }
  };

  return (
    <div id='wrapper'>
      <div id='container'>
        <div>
          <input id='display' value={inputDisplay} readOnly />
          {/* <input id='calc' value={result} readOnly /> */}
        </div>

        <div id='all-buttons'>
          <button id='clear' className='green' onClick={handleClear}>C</button>
          <button id='parenthesis-open' className='blue' onClick={() => handleClick('(')}>(</button>
          <button id='parenthesis-close' className='blue' onClick={() => handleClick(')')}>)</button>
          <button id='divide' className='blue divide' onClick={() => handleClick('/')}>/</button>

          <button id='seven' onClick={() => handleClick('7')}>7</button>
          <button id='eight' onClick={() => handleClick('8')}>8</button>
          <button id='nine' onClick={() => handleClick('9')}>9</button>
          <button id='multiply' className='blue multiply' onClick={() => handleClick('X')}>X</button>

          <button id='four' onClick={() => handleClick('4')}>4</button>
          <button id='five' onClick={() => handleClick('5')}>5</button>
          <button id='six' onClick={() => handleClick('6')}>6</button>
          <button id='subtract' className='blue subtract' onClick={() => handleClick('-')}>-</button>

          <button id='one' onClick={() => handleClick('1')}>1</button>
          <button id='two' onClick={() => handleClick('2')}>2</button>
          <button id='three' onClick={() => handleClick('3')}>3</button>
          <button id='add' className='blue' onClick={() => handleClick('+')}>+</button>

          <button id='zero' onClick={() => handleClick('0')}>0</button>
          <button id='decimal' onClick={() => handleClick('.')}>.</button>
          <button id='delete-last' onClick={handleDelete}>←</button>
          <button id='equals' className='dark-blue' onClick={handleEqual}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;
