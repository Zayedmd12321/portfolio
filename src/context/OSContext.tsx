'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface OSContextType {
  theme: Theme;
  toggleTheme: () => void;
  wallpaper: string;
  changeWallpaper: (url: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  // 1. Initialize with defaults (matches Server Side Rendering)
  const [theme, setTheme] = useState<Theme>('dark');
  const [wallpaper, setWallpaper] = useState('/wallpapers/1.jpg');

  // 2. Load saved settings from LocalStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('macOS-theme') as Theme;
    const savedWallpaper = localStorage.getItem('macOS-wallpaper');

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }
  }, []);

  // 3. Handle Wallpaper Changes (Update CSS + Save to Storage)
  useEffect(() => {
    document.documentElement.style.setProperty('--wallpaper', `url(${wallpaper})`);
    localStorage.setItem('macOS-wallpaper', wallpaper);
  }, [wallpaper]);

  // 4. Handle Theme Changes (Update DOM + Save to Storage)
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('macOS-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <OSContext.Provider value={{ theme, toggleTheme, wallpaper, changeWallpaper: setWallpaper }}>
      <div className={theme}>
        {children}
      </div>
    </OSContext.Provider>
  );
}

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within an OSProvider');
  return context;
};