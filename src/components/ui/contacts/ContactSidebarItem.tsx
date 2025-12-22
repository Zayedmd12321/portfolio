'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  label: string;
  icon?: LucideIcon;
  count: number;
  active: boolean;
  onClick: () => void;
}

export default function SidebarItem({ label, icon: Icon, count, active, onClick }: SidebarItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1.5 mx-2 rounded-md flex justify-between items-center transition-colors w-auto ${
        active 
          ? 'bg-[#007AFF] text-white shadow-sm' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
    }`}>
       <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className={active ? 'text-white/80' : 'text-gray-400'} />}
          <span className="text-[13px] font-medium">{label}</span>
       </div>
       <span className={`text-[11px] ${active ? 'text-white/80' : 'text-gray-400'}`}>{count}</span>
    </button>
  );
}
