'use client';
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

const BASE_WIDTH = 65;
const MAX_WIDTH = 110;
const DISTANCE_THRESHOLD = 160;

interface DockIconProps {
  id: string;
  mouseX: MotionValue;
  src: string;
  name: string;
  isOpen?: boolean;
  onClick: () => void;
}

export function DockIcon({
  id,
  mouseX,
  src,
  name,
  isOpen,
  onClick,
}: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    const iconCenter = bounds.x + bounds.width / 2;
    return val - iconCenter;
  });

  const widthSync = useTransform(
    distance,
    [-DISTANCE_THRESHOLD, 0, DISTANCE_THRESHOLD],
    [BASE_WIDTH, MAX_WIDTH, BASE_WIDTH]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div className="group relative flex flex-col items-center">
      {/* Tooltip */}
      <span className="absolute -top-14 hidden px-3 py-1 bg-gray-900/90 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-200 border border-white/10 font-medium">
        {name}
      </span>

      {/* The Animated Icon */}
      <motion.button
        ref={ref}
        id={`dock-icon-${id}`}
        style={{ width }}
        onClick={onClick}
        whileTap={{ scale: 0.9, translateY: 5 }}
        className="aspect-square rounded-2xl flex items-center justify-center relative transition-colors cursor-pointer"
      >
        <img
          src={src}
          alt={name}
          className="w-full h-full object-contain drop-shadow-lg"
          draggable={false}
        />
      </motion.button>

      {/* Active Dot Indicator */}
      <div
        className={`mt-1 h-1 w-1 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.5)] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
