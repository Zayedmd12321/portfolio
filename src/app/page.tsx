'use client';
import React, { useState, useEffect } from 'react';
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
import Notification from '@/components/ui/Notification';
import MusicApp from '@/components/apps/MusicApp';

export default function Desktop() {
  const [windows, setWindows] = useState({
    finder: { isOpen: false, isMinimized: false, z: 1 },
    terminal: { isOpen: false, isMinimized: false, z: 2 },
    vscode: { isOpen: false, isMinimized: false, z: 3 },
    safari: { isOpen: false, isMinimized: false, z: 4 },
    calculator: { isOpen: false, isMinimized: false, z: 5 },
    siri: { isOpen: true, isMinimized: false, z: 6 },    // Open by default
    photos: { isOpen: false, isMinimized: false, z: 7 },
    contacts: { isOpen: false, isMinimized: false, z: 8 },
    notes: { isOpen: true, isMinimized: false, z: 9 },    // Open by default
    bin: { isOpen: false, isMinimized: false, z: 10 },
    resume: { isOpen: false, isMinimized: false, z: 11 },
    music: { isOpen: false, isMinimized: false, z: 12 },
  });

  // State to track if the component has mounted on the client
  const [isMounted, setIsMounted] = useState(false);

  // Initial fallback state (used for server-side rendering to avoid errors)
  const [layout, setLayout] = useState({
    notes: { width: 800, height: 600, x: 50, y: 50 },
    siri: { width: 400, height: 600, x: 860, y: 50 }
  });

  // --- LAYOUT CALCULATION LOGIC ---
  const calculateLayout = () => {
    if (typeof window === 'undefined') return layout;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const NOTES_WIDTH_PCT = 0.60;
    const NOTES_HEIGHT_PCT = 0.80;
    const SIRI_WIDTH_PCT = 0.30;
    const GAP_PX = 10;

    const notesW = Math.max(600, screenW * NOTES_WIDTH_PCT);
    const notesH = Math.max(400, (screenH - 36) * NOTES_HEIGHT_PCT);
    const siriW = Math.max(300, screenW * SIRI_WIDTH_PCT);
    const siriH = notesH;

    const totalGroupWidth = notesW + siriW + GAP_PX;
    const startX = Math.max(10, (screenW - totalGroupWidth) / 2);
    const startY = Math.max(40, screenH - (3 * notesH) / 2 - 36);

    return {
      notes: { width: notesW, height: notesH, x: startX, y: startY },
      siri: { width: siriW, height: siriH, x: startX + notesW + GAP_PX, y: startY }
    };
  };

  useEffect(() => {
    // 1. Calculate the real layout now that we are on the client
    const newLayout = calculateLayout();
    setLayout(newLayout);

    // 2. Mark as mounted to allow windows to render
    setIsMounted(true);

    // 3. Add resize listener
    const handleResize = () => setLayout(calculateLayout());
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bringToFront = (id: string) => {
    const highestZ = Math.max(...Object.values(windows).map(w => w.z));
    setWindows(prev => ({
      ...prev,
      [id as keyof typeof windows]: { ...prev[id as keyof typeof windows], z: highestZ + 1 }
    }));
  };

  const toggleApp = (id: string) => {
    const app = windows[id as keyof typeof windows];
    if (app.isOpen && !app.isMinimized) {
      setWindows(prev => ({ ...prev, [id]: { ...app, isMinimized: true } }));
    } else {
      setWindows(prev => ({ ...prev, [id]: { ...app, isOpen: true, isMinimized: false } }));
      bringToFront(id);
    }
  };

  const openApp = (id: string) => {
    const app = windows[id as keyof typeof windows];
    if (app.isOpen) {
      setWindows(prev => ({ ...prev, [id]: { ...app, isMinimized: false } }));
      bringToFront(id);
    } else {
      setWindows(prev => ({ ...prev, [id]: { ...app, isOpen: true, isMinimized: false } }));
      bringToFront(id);
    }
  };

  const closeApp = (id: string) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id as keyof typeof windows], isOpen: false } }));
  };

  // --- RENDER GUARD ---
  // If not mounted yet, render only the background/menubar. 
  // This prevents the "jump" from random fallback coordinates to real coordinates.
  if (!isMounted) {
    return (
      <main className="w-screen h-screen overflow-hidden relative selection:bg-blue-500/30">
        <div className="absolute top-0 left-0 w-full z-50">
          <MenuBarLayout />
        </div>
      </main>
    );
  }

  return (
    <main className="w-screen h-screen overflow-hidden relative selection:bg-blue-500/30">

      <div className="absolute top-0 left-0 w-full z-50">
        <MenuBarLayout />
      </div>

      <Notification />

      <div className="absolute top-[36px] left-0 w-full h-[calc(100vh-30px)]">

        {/* NOTES - Uses Calculated Layout */}
        <WindowLayout
          id="notes"
          title="Notes"
          dockId="dock-icon-notes"
          isOpen={windows.notes.isOpen} isMinimized={windows.notes.isMinimized}
          onClose={() => closeApp('notes')} onMinimize={() => toggleApp('notes')} onFocus={() => bringToFront('notes')}
          zIndex={windows.notes.z}
          width={layout.notes.width}    
          height={layout.notes.height}
          x={layout.notes.x}
          y={layout.notes.y}
          sidebar={true}
        >
          <NotesApp />
        </WindowLayout>

        {/* SIRI - Uses Calculated Layout */}
        <WindowLayout
          id="siri"
          title="Siri"
          dockId="dock-icon-siri"
          isOpen={windows.siri.isOpen} isMinimized={windows.siri.isMinimized}
          onClose={() => closeApp('siri')} onMinimize={() => toggleApp('siri')} onFocus={() => bringToFront('siri')}
          zIndex={windows.siri.z}
          width={layout.siri.width}
          height={layout.siri.height}
          x={layout.siri.x}
          y={layout.siri.y}
        >
          <SiriApp onOpenApp={openApp} />
        </WindowLayout>

        {/* RESUME - Standard Size */}
        <WindowLayout
          id="resume"
          title="Resume - Md Zayed Ghanchi"
          dockId="dock-icon-resume"
          isOpen={windows.resume.isOpen} isMinimized={windows.resume.isMinimized}
          onClose={() => closeApp('resume')} onMinimize={() => toggleApp('resume')} onFocus={() => bringToFront('resume')}
          zIndex={windows.resume.z}
        >
          <ResumeApp />
        </WindowLayout>

        {/* OTHER APPS */}
        <WindowLayout
          id="vscode"
          title="VS Code"
          dockId="dock-icon-vscode"
          isOpen={windows.vscode.isOpen} isMinimized={windows.vscode.isMinimized}
          onClose={() => closeApp('vscode')} onMinimize={() => toggleApp('vscode')} onFocus={() => bringToFront('vscode')}
          zIndex={windows.vscode.z} width={900} height={600} sidebar={true}
        >
          <VSCodeApp />
        </WindowLayout>

        <WindowLayout
          id="finder"
          title="Finder"
          dockId="dock-icon-finder"
          isOpen={windows.finder.isOpen} isMinimized={windows.finder.isMinimized}
          onClose={() => closeApp('finder')} onMinimize={() => toggleApp('finder')} onFocus={() => bringToFront('finder')}
          zIndex={windows.finder.z} width={800} height={500} sidebar={true}
        >
          <FinderApp />
        </WindowLayout>

        <WindowLayout
          id="terminal"
          title="zayed — -zsh"
          dockId="dock-icon-terminal"
          isOpen={windows.terminal.isOpen} isMinimized={windows.terminal.isMinimized}
          onClose={() => closeApp('terminal')} onMinimize={() => toggleApp('terminal')} onFocus={() => bringToFront('terminal')}
          zIndex={windows.terminal.z} width={600} height={400}
        >
          <TerminalApp />
        </WindowLayout>

        <WindowLayout
          id="safari"
          title="Safari"
          dockId="dock-icon-safari"
          isOpen={windows.safari.isOpen} isMinimized={windows.safari.isMinimized}
          onClose={() => closeApp('safari')} onMinimize={() => toggleApp('safari')} onFocus={() => bringToFront('safari')}
          zIndex={windows.safari.z} width={850} height={550} sidebar={true}
        >
          <SafariApp />
        </WindowLayout>

        <WindowLayout
          id="calculator"
          title="Calculator"
          dockId="dock-icon-calculator"
          isOpen={windows.calculator.isOpen} isMinimized={windows.calculator.isMinimized}
          onClose={() => closeApp('calculator')} onMinimize={() => toggleApp('calculator')} onFocus={() => bringToFront('calculator')}
          zIndex={windows.calculator.z} width={300} height={550}
        >
          <CalculatorApp />
        </WindowLayout>

        <WindowLayout
          id="music"
          title="Music"
          dockId="dock-icon-music"
          isOpen={windows.music.isOpen} isMinimized={windows.music.isMinimized}
          onClose={() => closeApp('music')} onMinimize={() => toggleApp('music')} onFocus={() => bringToFront('music')}
          zIndex={windows.music.z} width={600} height={400}
        >
          <MusicApp />
        </WindowLayout>

      </div>

      <DockLayout onOpenApp={toggleApp} openApps={Object.fromEntries(Object.entries(windows).map(([k, v]) => [k, v.isOpen && !v.isMinimized]))} />
    </main>
  );
}