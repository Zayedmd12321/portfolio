'use client';
import React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { DockIcon } from '@/components/ui/DockIcon';
import { dockApps } from '@/data/apps.data';

interface DockLayoutProps {
  onOpenApp: (id: string) => void;
  openApps: Record<string, boolean>;
}

export default function DockLayout({ onOpenApp, openApps }: DockLayoutProps) {
  const mouseX = useMotionValue(Infinity);

  // ✅ MOVED INSIDE: So we can access 'onOpenApp' and 'openApps'
  const dockExtras = [
    { 
      id: 'resume', 
      name: 'Resume', 
      icon: '/icons/resume.png', 
      action: () => onOpenApp('resume') 
    },
    { 
      id: 'trash', 
      name: 'Bin', 
      icon: '/icons/Trash Full.png', 
      action: () => console.log('Open Trash') 
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-9999 pointer-events-auto">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
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
            onClick={() => onOpenApp(app.id)}
          />
        ))}

        {/* --- Separator --- */}
        <div className="h-15 w-px bg-black/20 mx-1 mb-2 border-r border-black/10" />

        {/* --- Right Side: Extras (Resume, Trash) --- */}
        {dockExtras.map((item) => (
          <DockIcon
            key={item.id}
            id={item.id}
            mouseX={mouseX}
            src={item.icon}
            name={item.name}
            isOpen={openApps[item.id] || false} 
            onClick={item.action}
          />
        ))}
      </motion.div>
    </div>
  );
}