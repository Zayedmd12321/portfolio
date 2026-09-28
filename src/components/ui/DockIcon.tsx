'use client';
import React, { useEffect, useRef } from 'react';
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

function DockIconInner({
  id,
  mouseX,
  src,
  name,
  isOpen,
  onClick,
}: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // Cache the icon's centerX in a MotionValue and refresh it only when the
  // element resizes (or on window resize). Previously the distance transform
  // called getBoundingClientRect() on every mousemove for every icon, which
  // forced synchronous layout N times per frame — the main cause of dock lag.
  const centerX = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      centerX.set(r.x + r.width / 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [centerX]);

  const distance = useTransform(() => mouseX.get() - centerX.get());

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
        {/* Local dock icon whose width is driven by a framer-motion spring.
            The width is only known at animation time, so we keep it as a
            plain <img> rather than fighting next/image's width prop. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
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

// Memoized so an unrelated re-render of DockLayout (e.g. openApps prop
// referentially changes) doesn't force every icon to re-mount its
// framer-motion setup.
export const DockIcon = React.memo(DockIconInner);
