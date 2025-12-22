import React from 'react';
import { FileCode, Search, GitGraph, UserCircle, Settings } from 'lucide-react';
import { VSCodeSidebarItem } from '@/components/ui/VSCodeSidebarItem';
import { VSCodeFileTab } from '@/components/ui/VSCodeFileTab';
import { profileData } from '@/data/portfolio.data';

export default function VSCodeApp() {
  return (
    <div className="flex h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col justify-between py-2">
        <div className="flex flex-col">
          <VSCodeSidebarItem icon={FileCode} active />
          <VSCodeSidebarItem icon={Search} />
          <VSCodeSidebarItem icon={GitGraph} />
        </div>
        <div className="flex flex-col">
          <VSCodeSidebarItem icon={UserCircle} />
          <VSCodeSidebarItem icon={Settings} />
        </div>
      </div>

      {/* Explorer Sidebar */}
      <div className="w-48 bg-[#252526] hidden md:flex flex-col border-r border-black/20">
        <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">Explorer</div>
        <div className="px-2">
          <div className="flex items-center gap-1 py-1 bg-[#37373d] text-white cursor-pointer">
            <span className="rotate-90 text-[10px]">▶</span>
            <span className="font-bold">ZAYED-PORTFOLIO</span>
          </div>
          <div className="pl-4 py-1 text-[#569cd6] cursor-pointer">src</div>
          <div className="pl-6 py-1 flex items-center gap-2 bg-[#094771] text-white cursor-pointer">
             <span className="text-[#61dafb] text-xs">TS</span>
             profile.ts
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e]">
        <div className="flex bg-[#252526]">
          <VSCodeFileTab name="profile.ts" active />
        </div>
        
        <div className="flex-1 p-4 md:p-8 overflow-auto vscode-scroll">
          <div className="flex">
            <div className="text-[#858585] select-none pr-4 text-right border-r border-[#404040] mr-4 hidden sm:block">
              {Array.from({length: 15}).map((_, i) => <div key={i}>{i+1}</div>)}
            </div>
            <div className="w-full">
              <h1 className="text-3xl font-bold mb-8 text-white">{profileData.name} <span className="animate-pulse">🚀</span></h1>
              
              <div className="space-y-1 font-mono">
                <div className="flex gap-2">
                  <span className="text-[#569cd6]">const</span>
                  <span className="text-[#4fc1ff]">developer</span>
                  <span className="text-[#d4d4d4]">=</span>
                  <span className="text-[#d4d4d4]">{`{`}</span>
                </div>
                
                <div className="pl-6">
                   <span className="text-[#9cdcfe]">name:</span> <span className="text-[#ce9178]">'{profileData.name}'</span>,
                </div>
                <div className="pl-6">
                   <span className="text-[#9cdcfe]">education:</span> <span className="text-[#ce9178]">'{profileData.education}'</span>,
                </div>
                <div className="pl-6">
                   <span className="text-[#9cdcfe]">focus:</span> <span className="text-[#ce9178]">'{profileData.focus}'</span>,
                </div>
                <div className="pl-6">
                   <span className="text-[#9cdcfe]">techStack:</span> <span className="text-[#d4d4d4]">[</span>
                </div>
                {profileData.techStack.map((tech, idx) => (
                  <div key={idx} className="pl-12">
                    <span className="text-[#ce9178]">'{tech}'</span>{idx < profileData.techStack.length - 1 ? ',' : ''}
                  </div>
                ))}
                <div className="pl-6">
                   <span className="text-[#d4d4d4]">]</span>,
                </div>
                <div className="text-[#d4d4d4]">{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
