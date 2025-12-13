import React from 'react';
import { ArrowLeft, ArrowRight, Share, Plus, Copy, Lock, BookOpen } from 'lucide-react';

export default function SafariApp() {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] w-full">
      {/* Toolbar */}
      <div className="h-12 bg-[#2a2a2a] flex items-center px-4 gap-5 border-b border-black/20 shrink-0">
        <div className="flex gap-4 text-gray-500">
           <ArrowLeft size={18} />
           <ArrowRight size={18} />
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex justify-center">
           <div className="bg-[#1e1e1e] hover:bg-[#333] transition-colors w-full max-w-xl h-8 rounded-lg flex items-center justify-center text-xs text-white/90 gap-2 cursor-text border border-white/10 shadow-inner group">
              <Lock size={10} className="text-gray-400 group-hover:text-green-500 transition-colors" />
              <span className="opacity-90 font-medium">github.com/zayed-ghanchi</span>
           </div>
        </div>
        
        <div className="flex gap-5 text-gray-500">
           <Share size={16} />
           <Plus size={18} />
           <Copy size={16} />
        </div>
      </div>
      
      {/* Empty State / Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-[#1e1e1e]">
         <div className="w-24 h-24 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-6">
            <BookOpen size={48} className="text-gray-500" />
         </div>
         <h1 className="text-2xl font-bold text-white mb-2">Safari Start Page</h1>
         <p className="text-gray-400 text-sm max-w-md">
            Use the dock to navigate to projects, or click below to visit external links.
         </p>
         <div className="mt-8 flex gap-4">
             <button className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-500">GitHub Profile</button>
             <button className="px-4 py-2 bg-[#333] rounded-md text-white text-sm font-medium hover:bg-[#444]">Resume</button>
         </div>
      </div>
    </div>
  );
}
