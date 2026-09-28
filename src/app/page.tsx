'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import MenuBarLayout from '@/components/layouts/MenuBarLayout';
import DockLayout from '@/components/layouts/DockLayout';
import WindowLayout from '@/components/layouts/WindowLayout';
import TerminalApp from '@/components/apps/TerminalApp';
import CalculatorApp from '@/components/apps/CalculatorApp';
import VSCodeApp from '@/components/apps/VSCodeApp';
import SafariApp from '@/components/apps/SafariApp';
import NotesApp from '@/components/apps/NotesApp';
import FinderApp from '@/components/apps/FinderApp';
import SiriApp from '@/components/apps/SiriApp';
import ResumeApp from '@/components/apps/ResumeApp';
import MailApp from '@/components/apps/MailApp';
import Notification from '@/components/ui/Notification';
import MusicApp from '@/components/apps/MusicApp';
import BootScreen from '@/components/ui/BootScreen';
import AchievementsApp from '@/components/apps/AchievementsApp';
import ContactsApp from '@/components/apps/ContactsApp';
import PhotosApp from '@/components/apps/PhotosApp';
import { DesktopIcon } from '@/components/ui/DesktopIcon';
import { NotificationProvider, useNotificationApi } from '@/context/NotificationContext';
import { AchievementsProvider, useAchievementsApi } from '@/context/AchievementsContext';
import { DesktopSizeProvider } from '@/context/DesktopSizeContext';
import { useDesktopSize } from '@/hooks/useDesktopSize';

const WINDOW_IDS = [
  'finder', 'terminal', 'vscode', 'safari', 'calculator', 'siri',
  'photos', 'contacts', 'notes', 'bin', 'resume', 'music', 'mail', 'achievements',
] as const;
type WindowId = typeof WINDOW_IDS[number];

function DesktopContent() {
  const { showNotification } = useNotificationApi();
  const { setOpenAchievementsApp, unlockAchievement } = useAchievementsApi();
  const windowContainerRef = useRef<HTMLDivElement>(null);

  // --- Boot & Mount State ---
  const [isMounted, setIsMounted] = useState(false);
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [terminalBootMode, setTerminalBootMode] = useState(true);
  
  const [windows, setWindows] = useState({
    finder: { isOpen: false, isMinimized: false, z: 1 },
    terminal: { isOpen: false, isMinimized: false, z: 2 },
    vscode: { isOpen: false, isMinimized: false, z: 3 },
    safari: { isOpen: false, isMinimized: false, z: 4 },
    calculator: { isOpen: false, isMinimized: false, z: 5 },
    siri: { isOpen: false, isMinimized: false, z: 6 },
    photos: { isOpen: false, isMinimized: false, z: 7 },
    contacts: { isOpen: false, isMinimized: false, z: 8 },
    notes: { isOpen: false, isMinimized: false, z: 9 },
    bin: { isOpen: false, isMinimized: false, z: 10 },
    resume: { isOpen: false, isMinimized: false, z: 11 },
    music: { isOpen: false, isMinimized: false, z: 12 },
    mail: { isOpen: false, isMinimized: false, z: 13 },
    achievements: { isOpen: false, isMinimized: false, z: 14 },
  });

  const desktop = useDesktopSize(windowContainerRef);

  // Latest windows state, exposed via ref so callbacks can stay stable across
  // renders without capturing stale values. Without this, every open/close/focus
  // would recreate every window callback and re-render every open app.
  const windowsRef = useRef(windows);
  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  useEffect(() => {
    const initTimer = setTimeout(() => setIsMounted(true), 1500);
    return () => clearTimeout(initTimer);
  }, []);

  // Per-window size preferences tuned to the current desktop.
  //
  // Caps below intentionally match (or come in slightly under) the original
  // fixed dimensions the site was designed against, so that on a typical
  // desktop viewport windows keep their familiar footprint. Percentages
  // scale them DOWN on smaller viewports; caps prevent them from bloating
  // on very large viewports. Floors keep them usable.
  const winSize = useMemo(() => {
    const aw = desktop.availableWidth;
    const ah = desktop.availableHeight;
    const wPct = (pct: number, min: number, max: number) =>
      Math.round(Math.min(max, Math.max(min, aw * pct)));
    const hPct = (pct: number, min: number, max: number) =>
      Math.round(Math.min(max, Math.max(min, ah * pct)));

    return {
      notes:        { width: wPct(0.55, 560, 1000), height: hPct(0.70, 440, 700) },
      siri:         { width: wPct(0.28, 360, 500),  height: hPct(0.60, 440, 600) },
      mail:         { width: wPct(0.50, 560, 900),  height: hPct(0.58, 440, 600) },
      resume:       { width: wPct(0.44, 560, 800),  height: hPct(0.58, 440, 600) },
      vscode:       { width: wPct(0.50, 560, 900),  height: hPct(0.58, 440, 600) },
      finder:       { width: wPct(0.44, 520, 800),  height: hPct(0.48, 400, 500) },
      terminal:     { width: wPct(0.34, 440, 600),  height: hPct(0.58, 440, 600) },
      safari:       { width: wPct(0.48, 560, 850),  height: hPct(0.54, 420, 550) },
      calculator:   { width: wPct(0.18, 260, 300),  height: hPct(0.54, 440, 550) },
      music:        { width: wPct(0.50, 560, 900),  height: hPct(0.50, 420, 500) },
      photos:       { width: wPct(0.60, 620, 1100), height: hPct(0.72, 460, 760) },
      contacts:     { width: wPct(0.52, 580, 960),  height: hPct(0.68, 460, 720) },
      achievements: { width: wPct(0.34, 440, 600),  height: hPct(0.68, 480, 700) },
    };
  }, [desktop]);

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => {
      const highestZ = Math.max(...Object.values(prev).map(w => w.z));
      return {
        ...prev,
        [id as keyof typeof prev]: { ...prev[id as keyof typeof prev], z: highestZ + 1 }
      };
    });
  }, []);

  // Register the callback used by AchievementsContext to open the Achievements window.
  useEffect(() => {
    setOpenAchievementsApp(() => {
      setWindows(prev => {
        const highestZ = Math.max(...Object.values(prev).map(w => w.z));
        return {
          ...prev,
          achievements: { isOpen: true, isMinimized: false, z: highestZ + 1 }
        };
      });
    });
  }, [setOpenAchievementsApp]);

  // Boot screen finished → advance to the terminal phase.
  // Called from BootScreen's onComplete so we don't need a boot-tracking effect.
  const handleBootScreenComplete = () => {
    setShowBootScreen(false);
    setWindows(prev => ({ ...prev, terminal: { ...prev.terminal, isOpen: true, isMinimized: false } }));
    bringToFront('terminal');
  };

  const handleTerminalBootComplete = () => {
    setTerminalBootMode(false);
    unlockAchievement('boot_up');

    setTimeout(() => {
      setWindows(prev => ({ ...prev, notes: { ...prev.notes, isOpen: true, isMinimized: false } }));
      bringToFront('notes');
      setTimeout(() => {
        showNotification('System Online', "Portfolio loaded successfully. Explore apps from the Dock or ask Siri.", 'system');
      }, 500);
    }, 800);
  };

  const handleAppOpen = useCallback((id: string) => {
    if (id === 'terminal') unlockAchievement('terminal_wizard');
    if (id === 'music') unlockAchievement('music_lover');
    if (id === 'mail' || id === 'resume') unlockAchievement('recruiter');

    const w = windowsRef.current;
    const currentOpenCount = Object.values(w).filter(x => x.isOpen).length;
    if (!w[id as keyof typeof w].isOpen && currentOpenCount >= 4) {
      unlockAchievement('explorer');
    }
  }, [unlockAchievement]);

  const toggleApp = useCallback((id: string) => {
    const app = windowsRef.current[id as keyof typeof windowsRef.current];
    if (app.isOpen && !app.isMinimized) {
      setWindows(prev => ({ ...prev, [id]: { ...prev[id as keyof typeof prev], isMinimized: true } }));
    } else {
      setWindows(prev => {
        const highestZ = Math.max(...Object.values(prev).map(w => w.z));
        return { ...prev, [id]: { ...prev[id as keyof typeof prev], isOpen: true, isMinimized: false, z: highestZ + 1 } };
      });
      handleAppOpen(id);
    }
  }, [handleAppOpen]);

  const openApp = useCallback((id: string) => {
    const app = windowsRef.current[id as keyof typeof windowsRef.current];
    const wasOpen = app.isOpen;
    setWindows(prev => {
      const highestZ = Math.max(...Object.values(prev).map(w => w.z));
      return { ...prev, [id]: { ...prev[id as keyof typeof prev], isOpen: true, isMinimized: false, z: highestZ + 1 } };
    });
    if (!wasOpen) handleAppOpen(id);
  }, [handleAppOpen]);

  const closeApp = useCallback((id: string) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id as keyof typeof prev], isOpen: false } }));
  }, []);

  // Per-window callbacks memoized once, so every WindowLayout gets stable
  // onClose / onMinimize / onFocus prop identities across renders.
  const handlers = useMemo(() => {
    const map = {} as Record<WindowId, { onClose: () => void; onMinimize: () => void; onFocus: () => void }>;
    for (const id of WINDOW_IDS) {
      map[id] = {
        onClose: () => closeApp(id),
        onMinimize: () => toggleApp(id),
        onFocus: () => bringToFront(id),
      };
    }
    return map;
  }, [closeApp, toggleApp, bringToFront]);

  const dockOpenApps = useMemo(
    () => Object.fromEntries(Object.entries(windows).map(([k, v]) => [k, v.isOpen && !v.isMinimized])),
    [windows],
  );

  return (
    <main className="w-screen h-screen relative selection:bg-blue-500/30">
      {showBootScreen && <BootScreen isLoading={!isMounted} onComplete={handleBootScreenComplete} />}

      <motion.div 
        className="w-full h-full relative"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: showBootScreen ? 0 : 1, scale: showBootScreen ? 1.1 : 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
          <div className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center" style={{ backgroundImage: 'var(--wallpaper)' }}>
             <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="absolute top-0 left-0 w-full z-50"><MenuBarLayout /></div>
          <Notification />

          <div className="absolute top-12 right-4 z-10 flex flex-col items-end gap-4">
             <DesktopIcon label="Achievements" onDoubleClick={() => openApp('achievements')} />
          </div>

          <div ref={windowContainerRef} className="absolute top-9 left-0 w-full h-[calc(100%-2.25rem)]">
          <DesktopSizeProvider value={desktop}>
            <WindowLayout id="notes" title="Notes" dockId="dock-icon-notes" isOpen={windows.notes.isOpen} isMinimized={windows.notes.isMinimized} onClose={handlers.notes.onClose} onMinimize={handlers.notes.onMinimize} onFocus={handlers.notes.onFocus} zIndex={windows.notes.z} width={winSize.notes.width} height={winSize.notes.height} minWidth={320} minHeight={420} sidebar={true}><NotesApp onOpenApp={openApp} /></WindowLayout>
            <WindowLayout id="siri" title="Siri" dockId="dock-icon-siri" isOpen={windows.siri.isOpen} isMinimized={windows.siri.isMinimized} onClose={handlers.siri.onClose} onMinimize={handlers.siri.onMinimize} onFocus={handlers.siri.onFocus} zIndex={windows.siri.z} width={winSize.siri.width} height={winSize.siri.height} minWidth={340} minHeight={420}><SiriApp onOpenApp={openApp} /></WindowLayout>
            <WindowLayout id="mail" title="Mail" dockId="dock-icon-mail" isOpen={windows.mail.isOpen} isMinimized={windows.mail.isMinimized} onClose={handlers.mail.onClose} onMinimize={handlers.mail.onMinimize} onFocus={handlers.mail.onFocus} zIndex={windows.mail.z} width={winSize.mail.width} height={winSize.mail.height} minWidth={520} minHeight={400} sidebar={true}><MailApp /></WindowLayout>
            <WindowLayout id="resume" title="Resume" dockId="dock-icon-resume" isOpen={windows.resume.isOpen} isMinimized={windows.resume.isMinimized} onClose={handlers.resume.onClose} onMinimize={handlers.resume.onMinimize} onFocus={handlers.resume.onFocus} zIndex={windows.resume.z} width={winSize.resume.width} height={winSize.resume.height} minWidth={480} minHeight={420}><ResumeApp /></WindowLayout>
            <WindowLayout id="vscode" title="VS Code" dockId="dock-icon-vscode" isOpen={windows.vscode.isOpen} isMinimized={windows.vscode.isMinimized} onClose={handlers.vscode.onClose} onMinimize={handlers.vscode.onMinimize} onFocus={handlers.vscode.onFocus} zIndex={windows.vscode.z} width={winSize.vscode.width} height={winSize.vscode.height} minWidth={480} minHeight={400} sidebar={true}><VSCodeApp /></WindowLayout>
            <WindowLayout id="finder" title="Finder" dockId="dock-icon-finder" isOpen={windows.finder.isOpen} isMinimized={windows.finder.isMinimized} onClose={handlers.finder.onClose} onMinimize={handlers.finder.onMinimize} onFocus={handlers.finder.onFocus} zIndex={windows.finder.z} width={winSize.finder.width} height={winSize.finder.height} minWidth={480} minHeight={360} sidebar={true}><FinderApp /></WindowLayout>
            <WindowLayout id="terminal" title="Terminal" dockId="dock-icon-terminal" isOpen={windows.terminal.isOpen} isMinimized={windows.terminal.isMinimized} onClose={handlers.terminal.onClose} onMinimize={handlers.terminal.onMinimize} onFocus={handlers.terminal.onFocus} zIndex={windows.terminal.z} width={winSize.terminal.width} height={winSize.terminal.height} minWidth={380} minHeight={360}><TerminalApp bootMode={terminalBootMode} onBootComplete={handleTerminalBootComplete} /></WindowLayout>
            <WindowLayout id="safari" title="Safari" dockId="dock-icon-safari" isOpen={windows.safari.isOpen} isMinimized={windows.safari.isMinimized} onClose={handlers.safari.onClose} onMinimize={handlers.safari.onMinimize} onFocus={handlers.safari.onFocus} zIndex={windows.safari.z} width={winSize.safari.width} height={winSize.safari.height} minWidth={520} minHeight={420} sidebar={true}><SafariApp /></WindowLayout>
            <WindowLayout id="calculator" title="Calculator" dockId="dock-icon-calculator" isOpen={windows.calculator.isOpen} isMinimized={windows.calculator.isMinimized} onClose={handlers.calculator.onClose} onMinimize={handlers.calculator.onMinimize} onFocus={handlers.calculator.onFocus} zIndex={windows.calculator.z} width={winSize.calculator.width} height={winSize.calculator.height} minWidth={260} minHeight={420}><CalculatorApp /></WindowLayout>
            <WindowLayout id="music" title="Music" dockId="dock-icon-music" isOpen={windows.music.isOpen} isMinimized={windows.music.isMinimized} onClose={handlers.music.onClose} onMinimize={handlers.music.onMinimize} onFocus={handlers.music.onFocus} zIndex={windows.music.z} width={winSize.music.width} height={winSize.music.height} minWidth={520} minHeight={420}><MusicApp /></WindowLayout>
            <WindowLayout id="photos" title="Photos" dockId="dock-icon-photos" isOpen={windows.photos.isOpen} isMinimized={windows.photos.isMinimized} onClose={handlers.photos.onClose} onMinimize={handlers.photos.onMinimize} onFocus={handlers.photos.onFocus} zIndex={windows.photos.z} width={winSize.photos.width} height={winSize.photos.height} minWidth={520} minHeight={440}><PhotosApp /></WindowLayout>
            <WindowLayout id="contacts" title="Contacts" dockId="dock-icon-contacts" isOpen={windows.contacts.isOpen} isMinimized={windows.contacts.isMinimized} onClose={handlers.contacts.onClose} onMinimize={handlers.contacts.onMinimize} onFocus={handlers.contacts.onFocus} zIndex={windows.contacts.z} width={winSize.contacts.width} height={winSize.contacts.height} minWidth={560} minHeight={440}><ContactsApp /></WindowLayout>
            <WindowLayout id="achievements" title="Achievements" dockId="dock-icon-achievements" isOpen={windows.achievements.isOpen} isMinimized={windows.achievements.isMinimized} onClose={handlers.achievements.onClose} onMinimize={handlers.achievements.onMinimize} onFocus={handlers.achievements.onFocus} zIndex={windows.achievements.z} width={winSize.achievements.width} height={winSize.achievements.height} minWidth={420} minHeight={480}><AchievementsApp /></WindowLayout>
          </DesktopSizeProvider>
          </div>

          <DockLayout onOpenApp={toggleApp} openApps={dockOpenApps} />
      </motion.div>
    </main>
  );
}

export default function Desktop() {
  return (
    <NotificationProvider>
      <AchievementsProvider>
        <DesktopContent />
      </AchievementsProvider>
    </NotificationProvider>
  );
}