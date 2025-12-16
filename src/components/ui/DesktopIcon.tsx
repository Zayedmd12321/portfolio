'use client';
import React from 'react';

interface DesktopIconProps {
  label: string;
  isPdf?: boolean;
  onDoubleClick: () => void;
}

export function DesktopIcon({ label, isPdf, onDoubleClick }: DesktopIconProps) {
  return (
    <div className="group flex flex-col items-center gap-1.5 w-21 cursor-pointer" onDoubleClick={onDoubleClick}>
      <div className="w-15 h-15 rounded-lg flex items-center justify-center transition-colors group-hover:bg-white/10 border border-transparent group-hover:border-white/10 group-active:bg-blue-600/30">
        <img
          src={isPdf ? "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" : "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png"}
          className="w-13 h-13 object-contain drop-shadow-lg"
          alt="icon"
        />
      </div>
      <span className="text-white text-[12px] font-medium px-2 py-0.5 rounded-sm icon-text leading-tight text-center group-hover:bg-[#0061D3] line-clamp-2">
        {label}
      </span>
    </div>
  );
}
