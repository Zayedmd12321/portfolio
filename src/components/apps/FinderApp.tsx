'use client';
import React from 'react';
import { SidebarItem } from '@/components/ui/SidebarItem';
import { FileIcon } from '@/components/ui/FileIcon';
import { finderSidebarFavorites, finderSidebarCloud, finderFiles } from '@/data/finder.data';

export default function FinderApp() {
  return (
    <div className="flex h-full w-full">
      {/* Sidebar (Glass) */}
      <div className="w-48 macos-glass p-3 flex flex-col gap-1 text-[13px] text-gray-300 font-medium pt-4 border-r border-white/10">
        <span className="text-[11px] text-gray-500 font-semibold mb-1 px-2 uppercase tracking-wider">Favorites</span>
        {finderSidebarFavorites.map((item, idx) => (
          <SidebarItem key={idx} icon={item.icon} label={item.label} />
        ))}
        
        <span className="text-[11px] text-gray-500 font-semibold mb-1 px-2 mt-4 uppercase tracking-wider">iCloud</span>
        {finderSidebarCloud.map((item, idx) => (
          <SidebarItem key={idx} icon={item.icon} label={item.label} />
        ))}
      </div>

      {/* Content (Solid) */}
      <div className="flex-1 bg-[#1e1e1e] p-6 grid grid-cols-4 gap-4 content-start">
        {finderFiles.map((file, idx) => (
          <FileIcon key={idx} label={file.label} type={file.type} />
        ))}
      </div>
    </div>
  );
}
