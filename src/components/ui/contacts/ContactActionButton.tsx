'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
}

export default function ActionButton({ icon: Icon, label }: ActionButtonProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
      <div className="w-11 h-11 rounded-full bg-gray-50 dark:bg-[#2a2a2a] flex items-center justify-center text-[#007AFF] shadow-sm group-hover:scale-105 group-hover:bg-[#007AFF] group-hover:text-white transition-all duration-300 border border-black/5 dark:border-white/5">
        <Icon size={20} />
      </div>
      <span className="text-[11px] font-medium text-[#007AFF] dark:text-blue-400 group-hover:text-[#007AFF] transition-colors">{label}</span>
    </div>
  );
}
