'use client';
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
}

export const SidebarItem = React.memo(function SidebarItem({ icon: Icon, label }: SidebarItemProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 cursor-default transition-colors">
      <Icon size={15} className="text-blue-400" />
      <span>{label}</span>
    </div>
  );
});
