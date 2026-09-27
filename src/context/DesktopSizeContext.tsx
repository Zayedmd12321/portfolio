'use client';
import React, { createContext, useContext } from 'react';
import { type DesktopSize, MENUBAR_HEIGHT } from '@/hooks/useDesktopSize';

const DesktopSizeContext = createContext<DesktopSize | null>(null);

interface Props {
  value: DesktopSize;
  children: React.ReactNode;
}

export function DesktopSizeProvider({ value, children }: Props) {
  return (
    <DesktopSizeContext.Provider value={value}>
      {children}
    </DesktopSizeContext.Provider>
  );
}

/**
 * Returns the shared desktop size from the provider. Falls back to a static
 * viewport read (no listener) when used outside a provider — good enough for
 * initial render before hydration.
 */
export function useSharedDesktopSize(): DesktopSize {
  const ctx = useContext(DesktopSizeContext);
  if (ctx) return ctx;
  if (typeof window === 'undefined') {
    return { vw: 1440, vh: 900, availableWidth: 1440, availableHeight: 864 };
  }
  return {
    vw: window.innerWidth,
    vh: window.innerHeight,
    availableWidth: window.innerWidth,
    availableHeight: Math.max(240, window.innerHeight - MENUBAR_HEIGHT),
  };
}
