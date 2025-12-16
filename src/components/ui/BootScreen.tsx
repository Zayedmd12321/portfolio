'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export default function BootScreen({ isLoading, onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90;
          const increment = Math.max(0.5, (90 - prev) / 10);
          return prev + increment;
        });
      }, 50); // Kept original speed (50ms) for smoother animation
    } else {
      setProgress(100);
      setTimeout(() => {
        setIsExiting(true);
      }, 500);
    }

    return () => clearInterval(timer);
  }, [isLoading]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-99999 bg-black flex flex-col items-center justify-center cursor-none"
        >
          {/* Apple Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
             {/* UPDATED: Using your local svg file */}
             <img 
               src="/icons/apple.svg" 
               alt="Apple Logo" 
               className="w-24 h-24 object-contain brightness-0 invert" 
             />
          </motion.div>

          {/* Progress Bar Container */}
          <div className="w-56 h-1.5 bg-[#333] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: isLoading ? 0.05 : 0.4 }} 
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}