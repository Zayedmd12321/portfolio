'use client';
import React from 'react';
import { Folder, Image as ImageIcon, FileCode } from 'lucide-react';

interface FileIconProps {
  label: string;
  type: 'folder' | 'image' | 'code';
}

export function FileIcon({ label, type }: FileIconProps) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer p-2 rounded hover:bg-[#2a2a2a]">
      {type === 'folder' && <Folder size={48} className="text-blue-400 fill-blue-400/20" />}
      {type === 'image' && <ImageIcon size={48} className="text-purple-400" />}
      {type === 'code' && <FileCode size={48} className="text-yellow-400" />}
      <span className="text-white/90 text-xs px-2 py-0.5 rounded group-hover:bg-[#0061D3] truncate max-w-full">{label}</span>
    </div>
  );
}
