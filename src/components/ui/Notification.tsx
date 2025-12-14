'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Command } from 'lucide-react';

export default function Notification() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show notification shortly after load
    const timer = setTimeout(() => setVisible(true), 2000);
    
    // Auto-dismiss after 7 seconds
    const hideTimer = setTimeout(() => setVisible(false), 9000);
    
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 20, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-12 right-5 w-[22rem] z-[99999] pointer-events-none select-none"
        >
          {/* Notification Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#2a2a2a]/60 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 flex gap-4">
            
            {/* Ambient Glow Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Icon Container */}
            <div className="relative z-10 shrink-0">
               <motion.div 
                 animate={{ boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 15px rgba(59,130,246,0.3)", "0 0 0px rgba(59,130,246,0)"] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg border border-white/10"
               >
                 <Sparkles className="text-white w-6 h-6 drop-shadow-md" />
               </motion.div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col justify-center z-10 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5 opacity-60">
                <Command size={10} className="text-white" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-white">System</span>
              </div>
              
              <h4 className="text-white text-[15px] font-semibold leading-tight mb-1">
                System Online
              </h4>
              
              <p className="text-white/70 text-[13px] leading-snug font-light">
                Zayed's portfolio is ready. Check the <span className="text-blue-300 font-medium">Dock</span> for apps or ask <span className="text-purple-300 font-medium">Siri</span> for insights.
              </p>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}