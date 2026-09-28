'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { useNotificationApi } from '@/context/NotificationContext';
import { ACHIEVEMENTS } from '@/data/achievements.data';

interface AchievementsState {
  unlockedIds: string[];
  totalXP: number;
  level: number;
}

interface AchievementsApi {
  unlockAchievement: (id: string) => void;
  setOpenAchievementsApp: (callback: () => void) => void;
}

// Split contexts: state changes (unlocks, level-ups) only re-render the
// AchievementsApp; every consumer that just calls unlockAchievement reads
// the stable API context and does not re-render on state changes.
const AchievementsStateContext = createContext<AchievementsState | undefined>(undefined);
const AchievementsApiContext = createContext<AchievementsApi | undefined>(undefined);

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
  const { showNotification } = useNotificationApi();
  const openAppRef = useRef<(() => void) | null>(null);
  const prevLevelRef = useRef(1);

  const totalXP = useMemo(
    () => unlockedIds.reduce((acc, id) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      return acc + (achievement?.xp || 0);
    }, 0),
    [unlockedIds],
  );

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

  const state = useMemo<AchievementsState>(
    () => ({ unlockedIds, totalXP, level }),
    [unlockedIds, totalXP, level],
  );
  const api = useMemo<AchievementsApi>(
    () => ({ unlockAchievement, setOpenAchievementsApp }),
    [unlockAchievement, setOpenAchievementsApp],
  );

  return (
    <AchievementsApiContext.Provider value={api}>
      <AchievementsStateContext.Provider value={state}>
        {children}
      </AchievementsStateContext.Provider>
    </AchievementsApiContext.Provider>
  );
}

export function useAchievementsState() {
  const ctx = useContext(AchievementsStateContext);
  if (!ctx) throw new Error('useAchievementsState must be used within AchievementsProvider');
  return ctx;
}

export function useAchievementsApi() {
  const ctx = useContext(AchievementsApiContext);
  if (!ctx) throw new Error('useAchievementsApi must be used within AchievementsProvider');
  return ctx;
}

// Backwards-compatible combined hook — re-renders on any state change.
export const useAchievements = () => ({ ...useAchievementsState(), ...useAchievementsApi() });
