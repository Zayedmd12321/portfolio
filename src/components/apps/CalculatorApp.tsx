import React, { useState, useEffect, useCallback } from 'react';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(String(inputValue));
    } else if (operator) {
      const currentValue = parseFloat(prevValue);
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(String(newValue));
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '/': return a / b;
      case '*': return a * b;
      case '-': return a - b;
      case '+': return a + b;
      case '=': return b;
      default: return b;
    }
  };

  const getFontSize = (text: string) => {
    if (text.length > 9) return 'text-3xl';
    if (text.length > 6) return 'text-5xl';
    return 'text-6xl';
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    
    if (/[0-9]/.test(key)) inputDigit(key);
    if (key === '.') inputDot();
    if (key === 'Enter' || key === '=') performOperation('=');
    if (key === 'Backspace') setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    if (key === 'Escape') clear();
    if (key === '+') performOperation('+');
    if (key === '-') performOperation('-');
    if (key === '*') performOperation('*');
    if (key === '/') performOperation('/');
  }, [display, waitingForOperand, operator, prevValue]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const Button = ({ label, onClick, span = false, dark = false, orange = false }: any) => (
    <button 
      onClick={onClick}
      className={`
        ${span ? 'col-span-2' : ''} 
        ${dark ? 'bg-[#505050] hover:bg-[#686868]' : orange ? 'bg-[#ff9500] hover:bg-[#ffb143]' : 'bg-[#333333] hover:bg-[#4a4a4a]'}
        text-white font-light rounded-full active:brightness-75 transition-all
        ${getFontSize('0')} flex items-center justify-center select-none
        ${span ? 'px-6 justify-start' : ''}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full bg-black p-3 flex flex-col gap-2">
      <div className={`bg-black text-white text-right px-4 py-6 ${getFontSize(display)} font-extralight overflow-hidden`}>
        {display}
      </div>
      
      <div className="grid grid-cols-4 gap-2 flex-1">
        <Button label="C" onClick={clear} dark />
        <Button label="±" onClick={toggleSign} dark />
        <Button label="%" onClick={inputPercent} dark />
        <Button label="÷" onClick={() => performOperation('/')} orange />
        
        <Button label="7" onClick={() => inputDigit('7')} />
        <Button label="8" onClick={() => inputDigit('8')} />
        <Button label="9" onClick={() => inputDigit('9')} />
        <Button label="×" onClick={() => performOperation('*')} orange />
        
        <Button label="4" onClick={() => inputDigit('4')} />
        <Button label="5" onClick={() => inputDigit('5')} />
        <Button label="6" onClick={() => inputDigit('6')} />
        <Button label="−" onClick={() => performOperation('-')} orange />
        
        <Button label="1" onClick={() => inputDigit('1')} />
        <Button label="2" onClick={() => inputDigit('2')} />
        <Button label="3" onClick={() => inputDigit('3')} />
        <Button label="+" onClick={() => performOperation('+')} orange />
        
        <Button label="0" onClick={() => inputDigit('0')} span />
        <Button label="." onClick={inputDot} />
        <Button label="=" onClick={() => performOperation('=')} orange />
      </div>
    </div>
  );
}
