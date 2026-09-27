'use client';
import { useEffect, useState, useLayoutEffect, type RefObject } from 'react';

// Fallbacks used only until we get the first real measurement.
export const MENUBAR_HEIGHT = 36;
export const DOCK_RESERVED = 110;

export interface DesktopSize {
  /** Full viewport width in CSS pixels. */
  vw: number;
  /** Full viewport height in CSS pixels. */
  vh: number;
  /** Width of the desktop-area container (viewport width, minus scrollbars). */
  availableWidth: number;
  /** Height of the desktop-area container (viewport minus menu bar). */
  availableHeight: number;
}

const initial: DesktopSize = {
  vw: 1440,
  vh: 900,
  availableWidth: 1440,
  availableHeight: 900 - MENUBAR_HEIGHT,
};

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Measures the desktop-area container (the div that hosts every window) so
 * all sizing math tracks what react-rnd actually sees, and stays correct
 * across browser zoom, changes in root font-size, and browser resizes.
 *
 * Falls back to `window.innerWidth/Height` (minus menu bar) if no container
 * ref is supplied — useful for the first hook call before the DOM mounts.
 */
export function useDesktopSize(
  containerRef?: RefObject<HTMLElement | null>,
): DesktopSize {
  const [size, setSize] = useState<DesktopSize>(initial);

  useIsoLayoutEffect(() => {
    const read = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = containerRef?.current;
      const rect = el?.getBoundingClientRect();
      setSize({
        vw,
        vh,
        availableWidth: Math.max(320, rect?.width ?? vw),
        availableHeight: Math.max(240, rect?.height ?? vh - MENUBAR_HEIGHT),
      });
    };
    read();
    window.addEventListener('resize', read);

    let ro: ResizeObserver | undefined;
    if (containerRef?.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(read);
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', read);
      ro?.disconnect();
    };
  }, [containerRef]);

  return size;
}

export interface WindowSizePrefs {
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
}

/**
 * Resolves a possibly-percentage/px width or height into an actual pixel value
 * that fits inside the available desktop area while respecting a floor.
 */
export function resolveDimension(
  value: number | string | undefined,
  available: number,
  fallback: number,
  min: number,
): number {
  const target =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.endsWith('%')
        ? (available * parseFloat(value)) / 100
        : typeof value === 'string' && value.endsWith('px')
          ? parseFloat(value)
          : fallback;

  const cap = Math.max(min, available);
  return Math.min(Math.max(min, target), cap);
}

/**
 * Compute an initial window rectangle (position + size) that fits inside the
 * available desktop area. Windows open anchored near the top-left of the
 * desktop, then clamp so they never sit off-screen when the viewport is
 * narrower than the window itself.
 */
export function computeInitialRect(
  desktop: DesktopSize,
  prefs: WindowSizePrefs,
): { x: number; y: number; width: number; height: number } {
  const min = { w: prefs.minWidth ?? 300, h: prefs.minHeight ?? 240 };
  const width = resolveDimension(prefs.width, desktop.availableWidth, 800, min.w);
  const height = resolveDimension(
    prefs.height,
    desktop.availableHeight,
    600,
    min.h,
  );

  const OFFSET_X = 24;
  const OFFSET_Y = 16;
  const x = Math.min(OFFSET_X, Math.max(0, desktop.availableWidth - width));
  const y = Math.min(OFFSET_Y, Math.max(0, desktop.availableHeight - height));

  return { x, y, width, height };
}

/**
 * Clamp a stored position + size back inside the available desktop area after
 * the viewport shrinks or a display setting changes.
 */
export function clampRect(
  desktop: DesktopSize,
  rect: { x: number; y: number; width: number; height: number },
  mins: { minWidth: number; minHeight: number },
): { x: number; y: number; width: number; height: number } {
  const width = Math.min(Math.max(mins.minWidth, rect.width), desktop.availableWidth);
  const height = Math.min(Math.max(mins.minHeight, rect.height), desktop.availableHeight);
  const x = Math.min(Math.max(0, rect.x), Math.max(0, desktop.availableWidth - width));
  const y = Math.min(Math.max(0, rect.y), Math.max(0, desktop.availableHeight - height));
  return { x, y, width, height };
}
