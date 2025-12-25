'use client';
import React, { useState } from 'react';
import { Trophy, Lock, Layers, Zap, Grid, Eye } from 'lucide-react';
import { useAchievements } from '@/context/AchievementsContext';
import { ACHIEVEMENTS, AchievementCategory } from '@/data/achievements.data';

type FilterType = 'all' | AchievementCategory;

export default function AchievementsApp() {
  const { unlockedIds, totalXP, level } = useAchievements();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const xpForNextLevel = level * 200;
  const progress = ((totalXP % 200) / 200) * 100;

  const filteredAchievements = ACHIEVEMENTS.filter(a => 
    activeFilter === 'all' ? true : a.category === activeFilter
  );

  return (
    <div className="flex h-full w-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-black dark:text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-48 bg-gray-50/80 dark:bg-[#252525]/80 backdrop-blur-xl border-r border-black/5 dark:border-white/5 pt-6 pb-4 flex flex-col gap-1">
        <div className="px-4 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Trophy size={16} />
            </div>
            <span className="font-bold text-sm">Awards</span>
        </div>
        <SidebarItem icon={Grid} label="All Awards" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
        <SidebarItem icon={Layers} label="System" active={activeFilter === 'system'} onClick={() => setActiveFilter('system')} />
        <SidebarItem icon={Zap} label="Applications" active={activeFilter === 'apps'} onClick={() => setActiveFilter('apps')} />
        <SidebarItem icon={Eye} label="Hidden" active={activeFilter === 'hidden'} onClick={() => setActiveFilter('hidden')} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
          {/* Level Header */}
          <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Trophy size={150} /></div>
            <div className="relative z-10 flex items-center gap-6">
               <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
                  <span className="text-4xl font-bold">{level}</span>
               </div>
               <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Level {level}</h2>
                  <div className="flex justify-between text-xs font-medium text-white/80 mb-2">
                     <span>{totalXP} XP Total</span>
                     <span>Next: {xpForNextLevel} XP</span>
                  </div>
                  <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/10">
                     <div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                  </div>
               </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAchievements.map((achievement) => {
                const isUnlocked = unlockedIds.includes(achievement.id);
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className={`relative p-4 rounded-xl border transition-all duration-300 ${isUnlocked ? 'bg-white dark:bg-[#2a2a2a] border-black/5 dark:border-white/5 shadow-sm' : 'bg-gray-100 dark:bg-[#1a1a1a] border-transparent opacity-60 grayscale'}`}>
                     <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isUnlocked ? `bg-gradient-to-br ${achievement.color} text-white` : 'bg-gray-300 dark:bg-[#333] text-gray-500'}`}>
                           {isUnlocked ? <Icon size={24} /> : <Lock size={24} />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-sm truncate text-black dark:text-white">{achievement.title}</h3>
                           <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-1 line-clamp-2">{achievement.description}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isUnlocked ? 'bg-yellow-400/20 text-yellow-600 dark:text-yellow-400' : 'bg-gray-200 dark:bg-black/20 text-gray-400'}`}>{achievement.xp} XP</span>
                        </div>
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors ${active ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Icon size={16} className={active ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
            <span className="text-xs font-medium">{label}</span>
        </button>
    )
}