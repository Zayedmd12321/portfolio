'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OSContextType {
  wallpaper: string;
  changeWallpaper: (url: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [wallpaper, setWallpaper] = useState('/wallpapers/3.jpg');

  // Load saved wallpaper from LocalStorage on mount
  useEffect(() => {
    const savedWallpaper = localStorage.getItem('macOS-wallpaper');
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }
  }, []);

  // Handle Wallpaper Changes (Update CSS + Save to Storage)
  useEffect(() => {
    document.documentElement.style.setProperty('--wallpaper', `url(${wallpaper})`);
    localStorage.setItem('macOS-wallpaper', wallpaper);
  }, [wallpaper]);

  return (
    <OSContext.Provider value={{ wallpaper, changeWallpaper: setWallpaper }}>
      {children}
    </OSContext.Provider>
  );
}

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within an OSProvider');
  return context;
};