'use client';
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { ACHIEVEMENTS } from '@/data/achievements.data';

interface AchievementsContextType {
  unlockedIds: string[];
  totalXP: number;
  level: number;
  unlockAchievement: (id: string) => void;
  setOpenAchievementsApp: (callback: () => void) => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const { showNotification } = useNotification();
  const openAppRef = useRef<(() => void) | null>(null);
  const prevLevelRef = useRef(1);

  // Load from storage
  useEffect(() => {
    const saved = localStorage.getItem('macOS-achievements');
    if (saved) setUnlockedIds(JSON.parse(saved));
  }, []);

  const totalXP = unlockedIds.reduce((acc, id) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    return acc + (achievement?.xp || 0);
  }, 0);

  const level = Math.floor(totalXP / 200) + 1;

  // Level Up Logic
  useEffect(() => {
    if (level > prevLevelRef.current) {
      showNotification(
        'Level Up!',
        `Congratulations! You've reached Level ${level}.`,
        'success',
        () => openAppRef.current?.()
      );
      prevLevelRef.current = level;
    }
  }, [level, showNotification]);

  const unlockAchievement = useCallback((id: string) => {
    setUnlockedIds(prev => {
      if (prev.includes(id)) return prev;

      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        const newUnlocked = [...prev, id];
        localStorage.setItem('macOS-achievements', JSON.stringify(newUnlocked));

        showNotification(
          `Unlocked: ${achievement.title}`,
          `+${achievement.xp} XP earned!`,
          'success',
          () => openAppRef.current?.()
        );
        return newUnlocked;
      }
      return prev;
    });
  }, [showNotification]);

  const setOpenAchievementsApp = useCallback((callback: () => void) => {
    openAppRef.current = callback;
  }, []);

  return (
    <AchievementsContext.Provider value={{ unlockedIds, totalXP, level, unlockAchievement, setOpenAchievementsApp }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) throw new Error('useAchievements must be used within AchievementsProvider');
  return context;
};