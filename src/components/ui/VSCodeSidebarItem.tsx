'use client';
import React from 'react';

interface VSCodeSidebarItemProps {
  icon: any;
  active?: boolean;
}

export function VSCodeSidebarItem({ icon: Icon, active = false }: VSCodeSidebarItemProps) {
  return (
    <div className={`p-3 cursor-pointer ${active ? 'border-l-2 border-[#007acc] opacity-100' : 'opacity-40 hover:opacity-80'}`}>
      <Icon size={24} className="text-[#cccccc]" />
    </div>
  );
}
