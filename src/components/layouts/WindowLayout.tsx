'use client';
import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, ChevronsLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WindowLayoutProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  x?: number;
  y?: number;
  sidebar?: boolean;
  dockId?: string;
}

export default function WindowLayout({
  id, title, isOpen, isMinimized, onClose, onMinimize, onFocus, zIndex, children,
  width = 800, height = 600, x = 100, y = 50, sidebar = false, dockId
}: WindowLayoutProps) {
  const [isHoveringLights, setIsHoveringLights] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const [dockDelta, setDockDelta] = useState({ x: 0, y: 0 });

  // Reset maximized state when window is minimized or closed
  useEffect(() => {
    if (isMinimized || !isOpen) {
      setIsMaximized(false);
    }
  }, [isMinimized, isOpen]);

  useEffect(() => {
    if (!isOpen && !isMinimized) return;

    const dockElement = dockId ? document.getElementById(dockId) : null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight - 50;

    if (dockElement) {
      const rect = dockElement.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }
    
    const numWidth = typeof size.width === 'string' ? parseInt(size.width) : size.width;
    const numHeight = typeof size.height === 'string' ? parseInt(size.height) : size.height;
    
    const windowCenterX = position.x + (numWidth / 2);
    const windowBottomY = position.y + numHeight;
    const deltaX = targetX - windowCenterX;
    const deltaY = targetY - windowBottomY;

    setDockDelta({ x: deltaX, y: deltaY });
  }, [position, size, isOpen, dockId]);

  const variants = {
    initial: {
      opacity: 0,
      scale: 0,
      x: dockDelta.x,
      y: dockDelta.y,
      rotate: 15,
      clipPath: "polygon(40% 100%, 60% 100%, 60% 100%, 40% 100%)"
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    },
    minimized: {
      opacity: 0,
      scale: 0,
      x: dockDelta.x,
      y: dockDelta.y,
      rotate: -10,
      clipPath: "polygon(40% 0%, 60% 0%, 60% 100%, 40% 100%)",
      transition: {
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number]
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      x: dockDelta.x,
      y: dockDelta.y,
      rotate: -10,
      clipPath: "polygon(40% 0%, 60% 0%, 60% 100%, 40% 100%)",
      transition: {
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number]
      }
    }
  };
  const currentZIndex = isMaximized ? 100000 : zIndex;

  return (
    <AnimatePresence>
      {(isOpen || isMinimized) && (
        <Rnd
          default={{ x: 100, y: 50, width, height }}
          minWidth={350}
          minHeight={250}
          bounds={isMaximized ? undefined : "parent"}
          dragHandleClassName="window-header"
          onMouseDown={onFocus}
          style={{ zIndex: currentZIndex, position: isMaximized ? 'fixed' : 'absolute' }}
          enableResizing={!isMaximized}
          disableDragging={isMaximized}
          onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            setSize({ width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
            setPosition(position);
          }}
          size={isMaximized ? { width: '100vw', height: '100vh' } : undefined}
          position={isMaximized ? { x: 0, y: 0 } : position}
        >
          <div className="w-full h-full" style={{ position: 'relative', zIndex: isMaximized ? 100000 : 'auto' }}>
            <motion.div
              variants={variants}
              initial="initial"
              animate={!isMinimized ? "animate" : "minimized"}
              exit="exit"
              style={{ transformOrigin: "bottom center" }}
              className={`w-full h-full overflow-hidden flex flex-col shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] bg-[#1e1e1e] ${isMaximized ? 'rounded-none border-none' : 'rounded-xl border border-white/10'}`}
            >
              {/* Header */}
              <div
                className={`window-header shrink-0 flex items-center px-4 cursor-default select-none relative transition-colors duration-300 ${sidebar ? 'h-[52px] bg-transparent' : 'h-10 bg-[#2b2b2b] border-b border-black/40'}`}
                onMouseEnter={() => setIsHoveringLights(true)}
                onMouseLeave={() => setIsHoveringLights(false)}
                onDoubleClick={() => setIsMaximized(!isMaximized)}
              >
                <div className="flex gap-2 z-20 items-center">
                  <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-[#FF5F57] flex items-center justify-center border border-black/10 active:brightness-75 shadow-sm">
                    <X size={7} className={`text-black/60 ${isHoveringLights ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-3 h-3 rounded-full bg-[#FEBC2E] flex items-center justify-center border border-black/10 active:brightness-75 shadow-sm">
                    <Minus size={7} className={`text-black/60 ${isHoveringLights ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} className="w-3 h-3 rounded-full bg-[#28C840] flex items-center justify-center border border-black/10 active:brightness-75 shadow-sm">
                    <ChevronsLeftRight size={6} className={`text-black/60 rotate-45 ${isHoveringLights ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/40 text-[13px] font-medium tracking-wide shadow-sm">{sidebar ? '' : title}</span>
                </div>
              </div>

              {/* Content */}
              <div className={`flex-1 overflow-hidden relative ${sidebar ? 'flex bg-black/20 backdrop-blur-xl' : 'bg-[#1e1e1e]'}`}>
                {children}
              </div>
            </motion.div>
          </div>
        </Rnd>
      )}
    </AnimatePresence>
  );
}
