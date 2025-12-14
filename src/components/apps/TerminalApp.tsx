'use client';
import React, { useState, useEffect, useRef } from 'react';
import { terminalCommands, terminalUsername, terminalHost, terminalPrompt } from '@/data/terminal.data';

// --- THEME CONFIGURATION ---
const ASCII_ART = [
  "███████╗ █████╗ ██╗   ██╗███████╗██████╗ ",
  "╚══███╔╝██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗",
  "  ███╔╝ ███████║ ╚████╔╝ █████╗  ██║  ██║",
  " ███╔╝  ██╔══██║  ╚██╔╝  ██╔══╝  ██║  ██║",
  "███████╗██║  ██║   ██║   ███████╗██████╔╝",
  "╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝ "
];

const BOOT_LOGS = [
  "",
  " [SYSTEM] INITIALIZING KERNEL...",
  " [OK] CPU_THREADS......... [ ACTIVE ]",
  " [OK] MEMORY_INTEGRITY.... [ 100% ]",
  " [WARN] GPU_ACCEL......... [ OPTIMIZED ]",
  " [INFO] LOADING_MODULES... [ NEXT.JS, REACT, TAILWIND ]",
  " [INFO] CONNECTING........ [ LINK ESTABLISHED ]",
  "",
  " Welcome to ZAYED_OS v3.0 (tty1)",
  " Type 'help' to see available commands.",
  ""
];

// Combine them for the initial state
const INITIAL_HISTORY = [
  ...ASCII_ART.map(line => ({ type: 'art', content: line })),
  ...BOOT_LOGS.map(line => ({ type: 'log', content: line })),
  { type: 'log', content: 'Last login: ' + new Date().toDateString() + ' on ttys000' }
];

export default function TerminalApp() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newLine = { type: 'cmd', content: `${terminalUsername}@${terminalHost} ${terminalPrompt} ${input}` };
      let newHistory = [...history, newLine];
      
      const trimmedInput = input.trim();
      
      if (trimmedInput === 'clear') {
        setHistory(INITIAL_HISTORY);
        setInput('');
        return;
      }
      
      if (terminalCommands[trimmedInput]) {
        newHistory.push({ type: 'output', content: terminalCommands[trimmedInput] });
      } else if (trimmedInput !== '') {
        newHistory.push({ type: 'error', content: `zsh: command not found: ${trimmedInput}` });
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Helper to colorize log lines based on content
  const renderLogLine = (text: string) => {
    if (text.includes('[OK]')) {
      return (
        <span>
          <span className="text-green-400 font-bold">[ OK ]</span>
          {text.replace('[OK]', '')}
        </span>
      );
    }
    if (text.includes('[WARN]')) {
      return (
        <span>
          <span className="text-yellow-400 font-bold">[ WARN ]</span>
          {text.replace('[WARN]', '')}
        </span>
      );
    }
    if (text.includes('[INFO]')) {
      return (
        <span>
          <span className="text-blue-400 font-bold">[ INFO ]</span>
          {text.replace('[INFO]', '')}
        </span>
      );
    }
    if (text.includes('[SYSTEM]')) {
        return <span className="text-purple-400 font-bold">{text}</span>;
    }
    return <span>{text}</span>;
  };

  return (
    <div 
      // Reverted to clean dark background
      className="h-full bg-[#101010]/95 backdrop-blur-md p-4 font-mono text-xs sm:text-sm text-gray-200 overflow-auto cursor-text selection:bg-gray-700" 
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      <div className="flex flex-col">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-snug min-h-[1.2em]">
            
            {/* 1. RENDER ASCII ART WITH TEXT GRADIENT */}
            {line.type === 'art' && (
               <span 
                 className="font-bold tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                 style={{ 
                    // Fallback for browsers that don't support bg-clip-text
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(34, 211, 238, 0.2)' // Subtle glow
                 }}
               >
                 {line.content}
               </span>
            )}

            {/* 2. RENDER LOGS */}
            {line.type === 'log' && renderLogLine(line.content)}

            {/* 3. RENDER COMMAND INPUTS */}
            {line.type === 'cmd' && (
               <span>
                  <span className="text-green-400 font-semibold">{line.content.split(' ')[0]}</span>
                  <span className="text-blue-400 font-semibold"> {line.content.split(' ')[1]} </span>
                  <span className="text-white">{line.content.split(' ').slice(2).join(' ')}</span>
               </span>
            )}

            {/* 4. RENDER OUTPUT/ERRORS */}
            {line.type === 'output' && <span className="text-gray-300">{line.content}</span>}
            {line.type === 'error' && <span className="text-red-400">{line.content}</span>}
          </div>
        ))}
      </div>

      {/* INPUT LINE */}
      <div className="flex gap-2 mt-2">
        <span className="text-green-400 font-semibold">{terminalUsername}@{terminalHost}</span>
        <span className="text-blue-400 font-semibold">{terminalPrompt}</span>
        <input 
          id="term-input"
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none flex-1 text-white caret-gray-400 font-medium"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}