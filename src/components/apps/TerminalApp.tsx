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

const LOADING_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const BOOT_SEQUENCE = [
  { delay: 100, content: " [INFO] Initializing Portfolio System..." },
  { delay: 400, content: " [OK] KERNEL........ [ LOADED ]" },
  { delay: 300, content: " [OK] COMPONENTS.... [ COMPILED ]" },
  { delay: 350, content: " [OK] ASSETS........ [ OPTIMIZED ]" },
  { delay: 400, content: " [OK] NETWORK....... [ CONNECTED ]" },
  { delay: 300, content: " [OK] DATABASE...... [ SYNCED ]" },
  { delay: 0, content: " ", isLoading: true },
  { delay: 2000, content: "", isLoading: true }, // Loading animation duration
  { delay: 100, content: " " },
  { delay: 200, content: " [SYSTEM] Portfolio Booted Successfully!" },
  { delay: 500, content: " [SYSTEM] Opening Portfolio..." },
  { delay: 800, content: "" },
];

const INITIAL_HISTORY = [
  ...ASCII_ART.map(line => ({ type: 'art', content: line })),
];

interface TerminalAppProps {
  bootMode?: boolean;
  onBootComplete?: () => void;
}

export default function TerminalApp({ bootMode = false, onBootComplete }: TerminalAppProps) {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [input, setInput] = useState('');
  const [isBootAnimating, setIsBootAnimating] = useState(bootMode);
  const [loadingFrame, setLoadingFrame] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bootTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  // Boot sequence animation
  useEffect(() => {
    if (bootMode && isBootAnimating) {
      let currentDelay = 500; // Initial delay
      
      BOOT_SEQUENCE.forEach((step, index) => {
        currentDelay += step.delay;
        
        const timeout = setTimeout(() => {
          if (step.isLoading) {
            // Add loading line
            setHistory(prev => [...prev, { type: 'loading', content: '' }]);
          } else if (step.content) {
            // Replace loading with content or add new line
            setHistory(prev => {
              const lastItem = prev[prev.length - 1];
              if (lastItem && lastItem.type === 'loading') {
                return [...prev.slice(0, -1), { type: 'log', content: step.content }];
              }
              return [...prev, { type: 'log', content: step.content }];
            });
          }
          
          // Complete boot sequence
          if (index === BOOT_SEQUENCE.length - 1) {
            setTimeout(() => {
              setIsBootAnimating(false);
              onBootComplete?.();
            }, 100);
          }
        }, currentDelay);
        
        bootTimeoutRef.current.push(timeout);
      });
      
      return () => {
        bootTimeoutRef.current.forEach(clearTimeout);
      };
    }
  }, [bootMode, isBootAnimating, onBootComplete]);

  // Loading animation frames
  useEffect(() => {
    if (isBootAnimating) {
      const interval = setInterval(() => {
        setLoadingFrame(prev => (prev + 1) % LOADING_FRAMES.length);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isBootAnimating]);

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
      className="h-full bg-[#101010]/95 backdrop-blur-md p-4 font-mono text-xs sm:text-sm text-gray-200 overflow-auto cursor-text selection:bg-gray-700 macos-scrollbar" 
      onClick={() => !isBootAnimating && document.getElementById('term-input')?.focus()}
    >
      <div className="flex flex-col">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-snug min-h-[1.2em]">
            
            {/* 1. RENDER ASCII ART WITH TEXT GRADIENT */}
            {line.type === 'art' && (
               <span 
                 className="font-bold tracking-widest bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                 style={{ 
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(34, 211, 238, 0.2)'
                 }}
               >
                 {line.content}
               </span>
            )}

            {/* 2. RENDER LOADING ANIMATION */}
            {line.type === 'loading' && (
              <span className="text-cyan-400 font-bold">
                {LOADING_FRAMES[loadingFrame]} Loading system resources...
              </span>
            )}

            {/* 3. RENDER LOGS */}
            {line.type === 'log' && renderLogLine(line.content)}

            {/* 4. RENDER COMMAND INPUTS */}
            {line.type === 'cmd' && (
               <span>
                  <span className="text-green-400 font-semibold">{line.content.split(' ')[0]}</span>
                  <span className="text-blue-400 font-semibold"> {line.content.split(' ')[1]} </span>
                  <span className="text-white">{line.content.split(' ').slice(2).join(' ')}</span>
               </span>
            )}

            {/* 5. RENDER OUTPUT/ERRORS */}
            {line.type === 'output' && <span className="text-gray-300">{line.content}</span>}
            {line.type === 'error' && <span className="text-red-400">{line.content}</span>}
          </div>
        ))}
      </div>

      {/* INPUT LINE - Only show when not in boot mode */}
      {!isBootAnimating && (
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
      )}
      <div ref={bottomRef} />
    </div>
  );
}
