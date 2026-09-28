'use client';
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface VSCodeSidebarItemProps {
  icon: LucideIcon;
  active?: boolean;
}

export const VSCodeSidebarItem = React.memo(function VSCodeSidebarItem({ icon: Icon, active = false }: VSCodeSidebarItemProps) {
  return (
    <div className={`p-3 cursor-pointer ${active ? 'border-l-2 border-[#007acc] opacity-100' : 'opacity-40 hover:opacity-80'}`}>
      <Icon size={24} className="text-[#cccccc]" />
    </div>
  );
});
