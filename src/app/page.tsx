'use client';
import React, { useState } from 'react';
import MenuBarLayout from '@/components/layouts/MenuBarLayout';
import DockLayout from '@/components/layouts/DockLayout';
import WindowLayout from '@/components/layouts/WindowLayout';
import TerminalApp from '@/components/apps/TerminalApp';
import CalculatorApp from '@/components/apps/CalculatorApp';
import VSCodeApp from '@/components/apps/VSCodeApp';
import SafariApp from '@/components/apps/SafariApp';
import NotesApp from '@/components/apps/NotesApp';
import FinderApp from '@/components/apps/FinderApp';
import { resume } from 'react-dom/server';

export default function Desktop() {
  const [windows, setWindows] = useState({
    finder: { isOpen: false, isMinimized: false, z: 1 },
    terminal: { isOpen: false, isMinimized: false, z: 2 },
    vscode: { isOpen: false, isMinimized: false, z: 3 },
    safari: { isOpen: false, isMinimized: false, z: 4 },
    calculator: { isOpen: false, isMinimized: false, z: 5 },
    siri: { isOpen: false, isMinimized: false, z: 6 },
    photos: { isOpen: false, isMinimized: false, z: 7 },
    contacts: { isOpen: false, isMinimized: false, z: 8 },
    notes: { isOpen: true, isMinimized: false, z: 9 },
    bin: { isOpen: false, isMinimized: false, z: 10 },
    resume: { isOpen: false, isMinimized: false, z: 11 },
  });

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

  const closeApp = (id: string) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id as keyof typeof windows], isOpen: false } }));
  };

  return (
    <main className="w-screen h-screen overflow-hidden relative">

      {/* 1. MenuBar sits at the top (Z-index high to stay above windows if they maximize) */}
      <div className="absolute top-0 left-0 w-full z-50">
        <MenuBarLayout />
      </div>

      {/* 2. DESKTOP BOUNDARY CONTAINER 
        This div creates the "bounds" for the windows. 
        It starts 30px (approx menu height) from the top.
        The windows cannot be dragged higher than the top of this div.
      */}
      <div className="absolute top-[36px] left-0 w-full h-[calc(100vh-30px)]">

        {/* VS CODE */}
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

        {/* FINDER */}
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

        {/* TERMINAL */}
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

        {/* SAFARI */}
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

        {/* CALCULATOR */}
        <WindowLayout
          id="calculator"
          title="Calculator"
          isOpen={windows.calculator.isOpen} isMinimized={windows.calculator.isMinimized}
          onClose={() => closeApp('calculator')} onMinimize={() => toggleApp('calculator')} onFocus={() => bringToFront('calculator')}
          zIndex={windows.calculator.z} width={280} height={380}
        >
          <CalculatorApp />
        </WindowLayout>

        {/* NOTES */}
        <WindowLayout
          id="notes"
          title="Notes"
          dockId="dock-icon-notes"
          isOpen={windows.notes.isOpen} isMinimized={windows.notes.isMinimized}
          onClose={() => closeApp('notes')} onMinimize={() => toggleApp('notes')} onFocus={() => bringToFront('notes')}
          zIndex={windows.notes.z} width={'60%'} height={'80%'} x={5} y={5} sidebar={true}
        >
          <NotesApp />
        </WindowLayout>
      </div>

      {/* 3. Dock sits outside the boundary so it stays on top visually, but windows can go behind it */}
      <DockLayout onOpenApp={toggleApp} openApps={Object.fromEntries(Object.entries(windows).map(([k, v]) => [k, v.isOpen && !v.isMinimized]))} />
    </main>
  );
}