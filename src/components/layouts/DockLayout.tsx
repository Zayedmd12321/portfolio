'use client';
import React, { useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { DockIcon } from '@/components/ui/DockIcon';
import { dockApps } from '@/data/apps.data';

interface DockLayoutProps {
  onOpenApp: (id: string) => void;
  openApps: Record<string, boolean>;
}

export default function DockLayout({ onOpenApp, openApps }: DockLayoutProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-[90px] items-end gap-3 rounded-2xl bg-white/10 border border-white/20 px-3 pb-2 backdrop-blur-2xl shadow-2xl"
      >
        {dockApps.map((app) => (
          <DockIcon
            key={app.id}
            id={app.id}
            mouseX={mouseX}
            src={app.icon}
            name={app.name}
            isOpen={openApps[app.id]}
            onClick={() => onOpenApp(app.id)}
          />
        ))}
      </motion.div>
    </div>
  );
}
