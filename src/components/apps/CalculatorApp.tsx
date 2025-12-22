'use client';
import React, { useState, useEffect, useCallback } from 'react';

// --- Button Component (Moved Outside) ---
// By moving it here, React treats it as a stable component, fixing the click issue.
interface ButtonProps {
  label: string;
  onClick: () => void;
  span?: boolean;
  type?: 'number' | 'function' | 'operator';
  isActive?: boolean;
}

const Button = ({ label, onClick, span = false, type = 'number', isActive = false }: ButtonProps) => {
  // MacOS Calculator Colors
  let bgClass = 'bg-[#333333] hover:bg-[#4d4d4d]'; // Default Number (Dark Grey)
  let textClass = 'text-white';
  
  if (type === 'function') {
    bgClass = 'bg-[#A5A5A5] hover:bg-[#d4d4d2]'; // Light Grey (Top Row)
    textClass = 'text-black';
  } else if (type === 'operator') {
      if (isActive) {
          bgClass = 'bg-[#F1A33C] text-[#F1A33C] bg-white transition-colors duration-300'; // Active State (White bg, Orange text)
          textClass = 'text-[#F1A33C]';
      } else {
          bgClass = 'bg-[#FF9F0A] hover:bg-[#ffb543]'; // Orange
          textClass = 'text-white';
      }
  }

  return (
    <button 
      onClick={(e) => {
        // Stop propagation to prevent window focus logic from interfering if necessary
        e.stopPropagation();
        onClick();
      }}
      className={`
        ${span ? 'col-span-2 rounded-[40px] pl-7 items-center justify-start' : 'rounded-full flex items-center justify-center'} 
        ${bgClass}
        h-14 sm:h-16 w-full
        active:brightness-110 transition-all duration-100 ease-in-out
        text-[1.7rem] font-medium leading-none select-none cursor-pointer
        ${textClass}
      `}
    >
      <span>{label}</span>
    </button>
  );
};

// --- Main App Component ---
export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [activeOperator, setActiveOperator] = useState<string | null>(null);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
      setActiveOperator(null);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      setActiveOperator(null);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setActiveOperator(null);
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
    setActiveOperator(nextOperator);
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

  const getDisplayFontSize = (text: string) => {
    if (text.length > 9) return 'text-[2.5rem]';
    if (text.length > 7) return 'text-[3.5rem]';
    return 'text-[4.5rem]';
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    
    // Only prevent default for calculator keys to avoid blocking browser shortcuts unnecessarily
    if (/[0-9]/.test(key) || ['+', '-', '*', '/', '=', 'Enter', 'Escape', 'Backspace', '.'].includes(key)) {
       // event.preventDefault(); // Optional: Uncomment if page scrolling is an issue
    }

    if (/[0-9]/.test(key)) inputDigit(key);
    if (key === '.') inputDot();
    if (key === 'Enter' || key === '=') { performOperation('='); setActiveOperator(null); }
    if (key === 'Backspace') setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    if (key === 'Escape' || key === 'c' || key === 'C') clear();
    if (key === '+') performOperation('+');
    if (key === '-') performOperation('-');
    if (key === '*') performOperation('*');
    if (key === '/') performOperation('/');
  }, [display, waitingForOperand, operator, prevValue]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full h-full bg-black text-white p-4 flex flex-col justify-end select-none font-sans cursor-default">
      
      {/* Display Area */}
      <div className={`w-full text-right px-2 pb-2 mb-1 font-light tracking-tight leading-none truncate transition-all duration-100 ${getDisplayFontSize(display)}`}>
        {display}
      </div>
      
      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-3 w-full">
        <Button label={display === '0' ? 'AC' : 'C'} onClick={clear} type="function" />
        <Button label="±" onClick={toggleSign} type="function" />
        <Button label="%" onClick={inputPercent} type="function" />
        <Button label="÷" onClick={() => performOperation('/')} type="operator" isActive={activeOperator === '/'} />
        
        <Button label="7" onClick={() => inputDigit('7')} />
        <Button label="8" onClick={() => inputDigit('8')} />
        <Button label="9" onClick={() => inputDigit('9')} />
        <Button label="×" onClick={() => performOperation('*')} type="operator" isActive={activeOperator === '*'} />
        
        <Button label="4" onClick={() => inputDigit('4')} />
        <Button label="5" onClick={() => inputDigit('5')} />
        <Button label="6" onClick={() => inputDigit('6')} />
        <Button label="−" onClick={() => performOperation('-')} type="operator" isActive={activeOperator === '-'} />
        
        <Button label="1" onClick={() => inputDigit('1')} />
        <Button label="2" onClick={() => inputDigit('2')} />
        <Button label="3" onClick={() => inputDigit('3')} />
        <Button label="+" onClick={() => performOperation('+')} type="operator" isActive={activeOperator === '+'} />
        
        <Button label="0" onClick={() => inputDigit('0')} span />
        <Button label="." onClick={inputDot} />
        <Button label="=" onClick={() => { performOperation('='); setActiveOperator(null); }} type="operator" />
      </div>
    </div>
  );
}