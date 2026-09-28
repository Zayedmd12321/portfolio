'use client';
import React, { useMemo } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { DockIcon } from '@/components/ui/DockIcon';
import { dockApps } from '@/data/apps.data';

interface DockLayoutProps {
  onOpenApp: (id: string) => void;
  openApps: Record<string, boolean>;
}

function DockLayoutInner({ onOpenApp, openApps }: DockLayoutProps) {
  const mouseX = useMotionValue(Infinity);

  // Stable per-icon click handlers so DockIcon prop identity doesn't churn
  // on every parent render (the mouseX motion value already drives width
  // without React state changes).
  const clickHandlers = useMemo(() => {
    const map: Record<string, () => void> = {};
    for (const app of dockApps) map[app.id] = () => onOpenApp(app.id);
    map.resume = () => onOpenApp('resume');
    map.trash = () => console.log('Open Trash');
    return map;
  }, [onOpenApp]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-9999 pointer-events-auto">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        // `contain: layout style` isolates the dock's layout / style
        // computation from the rest of the page (so icon width changes don't
        // ripple out) while still allowing icons to paint OUTSIDE the dock —
        // the magnified icons that lift above the bar must not be clipped.
        // will-change promotes to its own compositor layer.
        style={{ contain: 'layout style', willChange: 'transform' }}
        className="flex h-22.5 items-end gap-3 rounded-2xl bg-white/10 border border-white/20 px-3 pb-2 backdrop-blur-2xl shadow-2xl"
      >
        {/* --- Left Side: Main Apps --- */}
        {dockApps.map((app) => (
          <DockIcon
            key={app.id}
            id={app.id}
            mouseX={mouseX}
            src={app.icon}
            name={app.name}
            isOpen={openApps[app.id]}
            onClick={clickHandlers[app.id]}
          />
        ))}

        {/* --- Separator --- */}
        <div className="h-15 w-px bg-black/20 mx-1 mb-2 border-r border-black/10" />

        {/* --- Right Side: Extras (Resume, Trash) --- */}
        <DockIcon
          id="resume"
          mouseX={mouseX}
          src="/icons/resume.png"
          name="Resume"
          isOpen={openApps.resume || false}
          onClick={clickHandlers.resume}
        />
        <DockIcon
          id="trash"
          mouseX={mouseX}
          src="/icons/Trash Full.png"
          name="Bin"
          isOpen={openApps.trash || false}
          onClick={clickHandlers.trash}
        />
      </motion.div>
    </div>
  );
}

export default React.memo(DockLayoutInner);