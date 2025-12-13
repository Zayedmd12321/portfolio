'use client';
import React, { useState, useEffect, useRef } from 'react';
import { terminalCommands, terminalUsername, terminalHost, terminalPrompt } from '@/data/terminal.data';

export default function TerminalApp() {
  const [history, setHistory] = useState<string[]>(['Last login: ' + new Date().toDateString() + ' on ttys000']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newHistory = [...history, `${terminalUsername}@${terminalHost} ${terminalPrompt} ${input}`];
      
      const trimmedInput = input.trim();
      
      if (trimmedInput === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }
      
      if (terminalCommands[trimmedInput]) {
        newHistory.push(terminalCommands[trimmedInput]);
      } else if (trimmedInput !== '') {
        newHistory.push(`zsh: command not found: ${trimmedInput}`);
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="h-full bg-[#1e1e1e] p-2 font-mono text-xs sm:text-sm text-white overflow-auto cursor-text" onClick={() => document.getElementById('term-input')?.focus()}>
      {history.map((line, i) => (
        <div key={i} className="mb-1">{line}</div>
      ))}
      <div className="flex gap-2">
        <span className="text-green-400">{terminalUsername}@{terminalHost}</span>
        <span className="text-blue-400">{terminalPrompt}</span>
        <input 
          id="term-input"
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none flex-1 text-white"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
