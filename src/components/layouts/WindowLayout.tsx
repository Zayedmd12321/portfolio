'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, ChevronsLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  computeInitialRect,
  clampRect,
  MENUBAR_HEIGHT,
} from '@/hooks/useDesktopSize';
import { useSharedDesktopSize } from '@/context/DesktopSizeContext';

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
  minWidth?: number;
  minHeight?: number;
}

function WindowLayoutInner({
  title, isOpen, isMinimized, onClose, onMinimize, onFocus, zIndex, children,
  width = 800, height = 600, sidebar = false, dockId, minWidth = 320, minHeight = 240
}: WindowLayoutProps) {
  const [isHoveringLights, setIsHoveringLights] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const desktop = useSharedDesktopSize();

  // Effective floors: never demand more than the available desktop can supply.
  const effMinWidth = Math.min(minWidth, Math.max(280, desktop.availableWidth - 16));
  const effMinHeight = Math.min(minHeight, Math.max(200, desktop.availableHeight - 16));

  // Lazy-initialise rect from the current desktop area rather than fixed pixels.
  const [rect, setRect] = useState(() =>
    computeInitialRect(desktop, {
      width,
      height,
      minWidth: effMinWidth,
      minHeight: effMinHeight,
    }),
  );

  // Track whether the user has manually moved/resized this window. Until then,
  // we keep the window centered as the viewport changes so first-time openers
  // never see a window pinned in the wrong corner.
  const userMovedRef = useRef(false);

  // Recompute or clamp the rect whenever the available desktop changes.
  // Skip entirely for closed & non-minimized windows: they won't be shown
  // until reopened, and computeInitialRect will run again on the next open
  // via the same effect anyway. Prevents 14 window re-renders on every
  // viewport resize.
  useEffect(() => {
    if (!isOpen && !isMinimized) return;
    setRect((prev) => {
      if (!userMovedRef.current) {
        return computeInitialRect(desktop, {
          width,
          height,
          minWidth: effMinWidth,
          minHeight: effMinHeight,
        });
      }
      return clampRect(desktop, prev, {
        minWidth: effMinWidth,
        minHeight: effMinHeight,
      });
    });
  }, [desktop, width, height, effMinWidth, effMinHeight, isOpen, isMinimized]);

  // Reset maximized state when window is minimized or closed.
  // React docs pattern for "adjusting state when a prop changes":
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevIsMinimized, setPrevIsMinimized] = useState(isMinimized);
  if (prevIsOpen !== isOpen || prevIsMinimized !== isMinimized) {
    setPrevIsOpen(isOpen);
    setPrevIsMinimized(isMinimized);
    if (isMinimized || !isOpen) {
      setIsMaximized(false);
    }
  }

  // Compute dock delta as derived state — no effect needed.
  const dockDelta = useMemo(() => {
    if (typeof document === 'undefined' || (!isOpen && !isMinimized)) {
      return { x: 0, y: 0 };
    }

    const dockElement = dockId ? document.getElementById(dockId) : null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight - 50;

    if (dockElement) {
      const r = dockElement.getBoundingClientRect();
      targetX = r.left + r.width / 2;
      targetY = r.top + r.height / 2;
    }

    const windowCenterX = rect.x + rect.width / 2;
    const windowBottomY = rect.y + rect.height;
    return { x: targetX - windowCenterX, y: targetY - windowBottomY };
  }, [rect, isOpen, isMinimized, dockId]);

  // Memoized so framer-motion sees a stable variants object between renders
  // when dockDelta hasn't changed — otherwise it treats each render as new
  // animation config.
  const variants = useMemo(() => ({
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
  }), [dockDelta]);
  const currentZIndex = isMaximized ? 100000 : zIndex;

  // Maximized windows fill the *desktop* area (viewport minus the MenuBar);
  // the parent container is already offset by MENUBAR_HEIGHT, so 100% inside
  // it lines up with the visible desktop.
  const maximizedSize = {
    width: `${desktop.vw}px`,
    height: `${Math.max(240, desktop.vh - MENUBAR_HEIGHT)}px`,
  };

  return (
    <AnimatePresence>
      {(isOpen || isMinimized) && (
        <Rnd
          size={isMaximized ? maximizedSize : { width: rect.width, height: rect.height }}
          position={isMaximized ? { x: 0, y: 0 } : { x: rect.x, y: rect.y }}
          minWidth={effMinWidth}
          minHeight={effMinHeight}
          maxWidth={desktop.availableWidth}
          maxHeight={desktop.availableHeight}
          bounds={isMaximized ? undefined : 'parent'}
          dragHandleClassName="window-header"
          onMouseDown={onFocus}
          style={{
            zIndex: currentZIndex,
            position: 'absolute',
            // While minimized or exiting, the Rnd wrapper is visually hidden
            // (its inner motion.div scales to 0), but the wrapper itself still
            // occupies its old rect and would swallow clicks meant for windows
            // behind it. Disabling pointer events keeps stale windows from
            // trapping the cursor.
            pointerEvents: isOpen && !isMinimized ? 'auto' : 'none',
          }}
          enableResizing={!isMaximized}
          disableDragging={isMaximized}
          onDragStop={(_e, d) => {
            userMovedRef.current = true;
            setRect((prev) => ({ ...prev, x: d.x, y: d.y }));
          }}
          onResizeStop={(_e, _direction, ref, _delta, position) => {
            userMovedRef.current = true;
            setRect({
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              x: position.x,
              y: position.y,
            });
          }}
        >
          <div className="w-full h-full cursor-auto" style={{ position: 'relative', zIndex: isMaximized ? 100000 : 'auto' }}>
            <motion.div
              variants={variants}
              initial="initial"
              animate={!isMinimized ? "animate" : "minimized"}
              exit="exit"
              // `contain: layout style` isolates the window's layout and
              // style computation from the rest of the page, so reflows
              // inside one window don't ripple out. We omit `paint` because
              // it would clip the window's drop shadow. `will-change:
              // transform` hints the browser to keep this element on its
              // own compositor layer for framer-motion animations. (We
              // deliberately don't set `transform` here — framer-motion
              // already drives it via the variants above.)
              style={{
                transformOrigin: "bottom center",
                contain: 'layout style',
                willChange: 'transform',
              }}
              className={`w-full h-full overflow-hidden flex flex-col shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] bg-[#1e1e1e] ${isMaximized ? 'rounded-none border-none' : 'rounded-xl border border-white/10'}`}
            >
              {/* Header */}
              <div
                className={`window-header shrink-0 flex items-center px-4 cursor-move select-none relative transition-colors duration-300 ${sidebar ? 'h-13 bg-transparent' : 'h-10 bg-[#2b2b2b] border-b border-black/40'}`}
                onMouseEnter={() => setIsHoveringLights(true)}
                onMouseLeave={() => setIsHoveringLights(false)}
                onDoubleClick={() => setIsMaximized(!isMaximized)}
              >
                <div className="flex gap-2 z-20 items-center">
                  <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-[#FF5F57] flex items-center justify-center border border-black/10 active:brightness-75 shadow-sm cursor-pointer">
                    <X size={7} className={`text-black/60 ${isHoveringLights ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-3 h-3 rounded-full bg-[#FEBC2E] flex items-center justify-center border border-black/10 active:brightness-75 shadow-sm cursor-pointer">
                    <Minus size={7} className={`text-black/60 ${isHoveringLights ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} className="w-3 h-3 rounded-full bg-[#28C840] flex items-center justify-center border border-black/10 active:brightness-75 shadow-sm cursor-pointer">
                    <ChevronsLeftRight size={6} className={`text-black/60 rotate-45 ${isHoveringLights ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/40 text-[0.8125rem] font-medium tracking-wide shadow-sm">{sidebar ? '' : title}</span>
                </div>
              </div>

              {/* Content — establishes a container-query context so apps can
                  respond to their own window width instead of the viewport. */}
              <div
                className={`flex-1 overflow-hidden relative @container ${sidebar ? 'flex bg-black/20 backdrop-blur-xl' : 'bg-[#1e1e1e]'}`}
                style={{ containerType: 'inline-size' }}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </Rnd>
      )}
    </AnimatePresence>
  );
}

// Memoized so opening/focusing one window doesn't force every other open
// window (and its heavy Rnd + framer-motion tree) to re-render. Relies on
// the parent passing stable callback identities.
const WindowLayout = React.memo(WindowLayoutInner);
export default WindowLayout;
