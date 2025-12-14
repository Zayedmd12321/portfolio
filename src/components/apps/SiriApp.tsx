'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Code, Terminal, Smile, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface SiriAppProps {
  onOpenApp?: (appId: string) => void;
}

// --- Suggestions Data ---
const SUGGESTIONS = [
  { icon: User, label: "Who is Zayed?", prompt: "Who is Zayed Ghanchi and what does he do?" },
  { icon: Code, label: "Show Portfolio", prompt: "Show me Zayed's portfolio projects." },
  { icon: Terminal, label: "Zayed's Skills", prompt: "What are Zayed's technical skills?" },
  { icon: Smile, label: "Tell me a joke", prompt: "Tell me a joke about coding." },
];

export default function SiriApp({ onOpenApp }: SiriAppProps = {}) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, isLoading]);

  // Handle Sending Messages
  const handleSend = async (textOverride?: string) => {
    const messageToSend = textOverride || input.trim();
    if (!messageToSend) return;

    setInput('');
    setIsLoading(true);

    // Optimistic UI Update
    const newHistory: ChatMessage[] = [
      ...history,
      { role: 'user', parts: [{ text: messageToSend }] }
    ];
    setHistory(newHistory);

    try {
      const response = await fetch('/api/siri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          history: history 
        }),
      });

      const data = await response.json();

      if (data.reply) {
        // App Opening Logic (JSON parsing)
        const appMatch = data.reply.match(/\{"action":\s*"open_app",\s*"app":\s*"([^"]+)"\}/);
        
        if (appMatch && onOpenApp) {
          const appId = appMatch[1];
          onOpenApp(appId);
          
          const cleanReply = data.reply.replace(/\{"action":.*?\}/, '').trim();
          setHistory(prev => [
            ...prev,
            { role: 'model', parts: [{ text: cleanReply || `Opening ${appId} for you...` }] }
          ]);
        } else {
          setHistory(prev => [
            ...prev,
            { role: 'model', parts: [{ text: data.reply }] }
          ]);
        }
      }
    } catch (error) {
      console.error("Connection error", error);
      setHistory(prev => [
        ...prev,
        { role: 'model', parts: [{ text: "I'm having trouble connecting to the network right now." }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e]/80 backdrop-blur-3xl text-white font-sans overflow-hidden relative selection:bg-blue-500/30">
      
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* --- Header: Siri Orb & Title --- */}
      <div className="h-32 shrink-0 flex flex-col items-center justify-center relative z-10 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
        
        {/* The "Apple Intelligence" Liquid Orb Animation */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 blur-xl opacity-60"
          />
          <motion.div 
             animate={{ scale: isLoading ? [1, 1.2, 1] : 1 }}
             transition={{ duration: 2, repeat: Infinity }}
             className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center"
          >
             <Sparkles className={`w-6 h-6 text-white ${isLoading ? 'animate-pulse' : ''}`} />
          </motion.div>
        </div>

        <h2 className="mt-3 text-sm font-medium text-white/90 tracking-wide flex items-center gap-2">
          Siri <span className="text-white/30">•</span> Portfolio Manager
        </h2>
      </div>

      {/* --- Chat Area --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 macos-scrollbar relative z-10">
        
        {/* Welcome / Empty State Suggestions */}
        {history.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full pb-10"
          >
            <p className="text-white/40 mb-8 text-sm font-light">Choose a topic to get started</p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion.prompt)}
                  className="group flex flex-col items-start gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 text-left"
                >
                  <suggestion.icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-xs text-white/80 font-medium">{suggestion.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message History */}
        <AnimatePresence>
          {history.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-lg backdrop-blur-md ${
                msg.role === 'user' 
                  ? 'bg-blue-600/80 text-white rounded-br-sm border border-blue-500/30' 
                  : 'bg-[#2a2a2a]/60 text-gray-100 rounded-bl-sm border border-white/10'
              }`}>
                {msg.parts[0].text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
             <div className="bg-[#2a2a2a]/60 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-200" />
             </div>
          </motion.div>
        )}
      </div>

      {/* --- Input Area --- */}
      <div className="p-4 bg-gradient-to-t from-black/40 to-transparent z-20">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask anything..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-5 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all shadow-inner backdrop-blur-xl"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 disabled:opacity-0 disabled:scale-75 transition-all duration-300 transform"
          >
            {isLoading ? <span className="w-4 h-4 block rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <ArrowRight size={16} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2 font-light tracking-wider">
          AI-POWERED PORTFOLIO ASSISTANT
        </p>
      </div>
    </div>
  );
}