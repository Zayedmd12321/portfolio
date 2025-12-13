'use client';
import React from 'react';

interface VSCodeFileTabProps {
  name: string;
  active?: boolean;
}

export function VSCodeFileTab({ name, active }: VSCodeFileTabProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-r border-[#2b2b2b] ${active ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-gray-400'}`}>
      <span className="text-[#61dafb]">TSX</span>
      {name}
    </div>
  );
}
