'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, User, Code, Terminal, Smile, ArrowUp, Zap } from 'lucide-react';
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
  { icon: User, label: "Who is Zayed?", prompt: "Who is Zayed Ghanchi and what does he do?", color: "text-cyan-400" },
  { icon: Code, label: "Projects", prompt: "Show me Zayed's portfolio projects.", color: "text-purple-400" },
  { icon: Terminal, label: "Tech Stack", prompt: "What are Zayed's technical skills?", color: "text-emerald-400" },
  { icon: Smile, label: "Fun Fact", prompt: "Tell me a joke about coding.", color: "text-yellow-400" },
];

// --- Sub-Component: The Apple Intelligence Mesh Orb ---
const SiriOrb = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Liquid Background Layers */}
      <motion.div 
        animate={{ 
          scale: isActive ? [1, 1.2, 1] : [1, 1.05, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500 via-blue-600 to-purple-600 blur-2xl opacity-50 mix-blend-screen"
      />
      <motion.div 
        animate={{ 
          scale: isActive ? [1.1, 1.3, 1.1] : [0.9, 1.1, 0.9],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-linear-to-r from-pink-500 via-orange-400 to-yellow-500 blur-2xl opacity-40 mix-blend-screen"
      />
      
      {/* Core Icon */}
      <div className="relative z-10 w-16 h-16 rounded-full bg-black/20 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-50" />
        <Sparkles className={`w-8 h-8 text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] ${isActive ? 'animate-pulse' : ''}`} />
      </div>
    </div>
  );
};

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

  const handleSend = async (textOverride?: string) => {
    const messageToSend = textOverride || input.trim();
    if (!messageToSend) return;

    setInput('');
    setIsLoading(true);

    const newHistory: ChatMessage[] = [
      ...history,
      { role: 'user', parts: [{ text: messageToSend }] }
    ];
    setHistory(newHistory);

    try {
      const response = await fetch('/api/siri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend, history: history }),
      });

      const data = await response.json();

      if (data.reply) {
        const appMatch = data.reply.match(/\{"action":\s*"open_app",\s*"app":\s*"([^"]+)"\}/);
        
        if (appMatch && onOpenApp) {
          const appId = appMatch[1];
          onOpenApp(appId);
          const cleanReply = data.reply.replace(/\{"action":.*?\}/, '').trim();
          setHistory(prev => [...prev, { role: 'model', parts: [{ text: cleanReply || `Opening ${appId}...` }] }]);
        } else {
          setHistory(prev => [...prev, { role: 'model', parts: [{ text: data.reply }] }]);
        }
      }
    } catch (error) {
        // Fallback for demo if API fails
        setTimeout(() => {
             setHistory(prev => [...prev, { role: 'model', parts: [{ text: "I'm in demo mode (API disconnected). But I'd normally answer that!" }] }]);
        }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#121212]/90 backdrop-blur-3xl font-sans overflow-hidden relative shadow-2xl border border-white/10 rounded-xl">
      
      {/* --- Apple Intelligence Ambient Glow --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]" 
         />
         <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" 
         />
      </div>

      {/* --- Header: Siri Orb --- */}
      <div className="shrink-0 flex flex-col items-center justify-center pt-8 pb-4 relative z-10">
        <SiriOrb isActive={isLoading} />
        <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm font-medium text-white/80 tracking-wide flex items-center gap-2"
        >
          Siri <span className="w-1 h-1 rounded-full bg-white/30" /> AI Portfolio
        </motion.h2>
      </div>

      {/* --- Chat Area --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-6 relative z-10 macos-scrollbar">
        
        {/* Welcome Suggestions */}
        {history.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full pb-10"
          >
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion.prompt)}
                  className="group relative flex flex-col items-start gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden"
                >
                  <div className={`p-2 rounded-full bg-white/5 ${suggestion.color} group-hover:scale-110 transition-transform`}>
                    <suggestion.icon size={18} />
                  </div>
                  <span className="text-xs text-white/90 font-medium tracking-wide">{suggestion.label}</span>
                  
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message History */}
        <AnimatePresence mode='popLayout'>
          {history.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] px-5 py-3.5 text-[14px] leading-relaxed shadow-sm backdrop-blur-xl ${
                msg.role === 'user' 
                  ? 'bg-[#007AFF] text-white rounded-2xl rounded-br-sm' 
                  : 'bg-[#333]/70 text-gray-100 rounded-2xl rounded-bl-sm border border-white/10'
              }`}>
                {msg.parts[0].text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-start">
             <div className="bg-[#333]/70 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1.4s_infinite_0ms]" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-[bounce_1.4s_infinite_200ms]" />
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-[bounce_1.4s_infinite_400ms]" />
             </div>
          </motion.div>
        )}
      </div>

      {/* --- Floating Input Area --- */}
      <div className="p-5 relative z-20">
        <div className="relative flex items-center group">
            {/* Input Glow Effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-focus-within:opacity-30 blur-md transition-opacity duration-500" />
            
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Ask Siri..."
                className="relative w-full bg-[#1c1c1c]/80 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:bg-[#252525] focus:border-white/20 transition-all shadow-inner backdrop-blur-xl"
            />
            
            <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-0 disabled:scale-75 transition-all duration-200"
            >
                {isLoading ? (
                    <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                ) : (
                    <ArrowUp className="w-4 h-4" />
                )}
            </button>
        </div>
      </div>
      
    </div>
  );
}