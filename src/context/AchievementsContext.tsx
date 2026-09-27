'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from 'react';
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

const STORAGE_KEY = 'macOS-achievements';

const unlockedListeners = new Set<() => void>();
let cachedIds: string[] = [];
let cachedRaw: string | null = null;

function readIdsFromStorage(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedIds;
  cachedRaw = raw;
  try {
    cachedIds = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    cachedIds = [];
  }
  return cachedIds;
}

function subscribeUnlocked(listener: () => void) {
  unlockedListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    unlockedListeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const EMPTY_IDS: string[] = [];
function getUnlockedServerSnapshot(): string[] {
  return EMPTY_IDS;
}

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const unlockedIds = useSyncExternalStore(
    subscribeUnlocked,
    readIdsFromStorage,
    getUnlockedServerSnapshot,
  );
  const { showNotification } = useNotification();
  const openAppRef = useRef<(() => void) | null>(null);
  const prevLevelRef = useRef(1);

  const totalXP = unlockedIds.reduce((acc, id) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    return acc + (achievement?.xp || 0);
  }, 0);

  const level = Math.floor(totalXP / 200) + 1;

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
    const current = readIdsFromStorage();
    if (current.includes(id)) return;

    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return;

    const newUnlocked = [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUnlocked));
    // Invalidate cache and notify subscribers so useSyncExternalStore re-reads.
    cachedRaw = null;
    unlockedListeners.forEach(listener => listener());

    showNotification(
      `Unlocked: ${achievement.title}`,
      `+${achievement.xp} XP earned!`,
      'success',
      () => openAppRef.current?.()
    );
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
