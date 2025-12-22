'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/data/menu.data';

interface MenuDropdownProps {
  isOpen: boolean;
  items: MenuItem[];
}

export function MenuDropdown({ isOpen, items }: MenuDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.1 }}
          className="absolute top-8 left-0 min-w-55 bg-[#1e1e1eb3] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-lg py-1.5 flex flex-col z-10000"
        >
          {items.map((item, idx) => (
            item.separator ? (
              <div key={idx} className="h-px bg-white/10 my-1 mx-2" />
            ) : (
              <button 
                key={idx} 
                className="group w-full text-left px-4 py-1 text-[13px] text-white hover:bg-blue-500 hover:text-white transition-colors flex justify-between items-center rounded-md mx-1 max-w-[96%] cursor-pointer"
              >
                <span>{item.label}</span>
                {item.shortcut && <span className="text-xs text-white/50 group-hover:text-white/90">{item.shortcut}</span>}
              </button>
            )
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
