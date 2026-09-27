'use client';
import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

interface OSContextType {
  wallpaper: string;
  changeWallpaper: (url: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const WALLPAPER_KEY = 'macOS-wallpaper';
const DEFAULT_WALLPAPER = '/wallpapers/3.jpg';

const wallpaperListeners = new Set<() => void>();

function subscribeWallpaper(listener: () => void) {
  wallpaperListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === WALLPAPER_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    wallpaperListeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getWallpaperSnapshot(): string {
  return localStorage.getItem(WALLPAPER_KEY) ?? DEFAULT_WALLPAPER;
}

function getWallpaperServerSnapshot(): string {
  return DEFAULT_WALLPAPER;
}

export function OSProvider({ children }: { children: React.ReactNode }) {
  const wallpaper = useSyncExternalStore(
    subscribeWallpaper,
    getWallpaperSnapshot,
    getWallpaperServerSnapshot,
  );

  const changeWallpaper = (url: string) => {
    localStorage.setItem(WALLPAPER_KEY, url);
    wallpaperListeners.forEach(listener => listener());
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--wallpaper', `url(${wallpaper})`);
  }, [wallpaper]);

  return (
    <OSContext.Provider value={{ wallpaper, changeWallpaper }}>
      {children}
    </OSContext.Provider>
  );
}

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within an OSProvider');
  return context;
};
