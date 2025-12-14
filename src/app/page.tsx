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
import SiriApp from '@/components/apps/SiriApp';
import ResumeApp from '@/components/apps/ResumeApp';

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

  const openApp = (id: string) => {
    const app = windows[id as keyof typeof windows];
    // If already open, just bring to front and restore if minimized
    if (app.isOpen) {
      setWindows(prev => ({ ...prev, [id]: { ...app, isMinimized: false } }));
      bringToFront(id);
    } else {
      // If closed, open it
      setWindows(prev => ({ ...prev, [id]: { ...app, isOpen: true, isMinimized: false } }));
      bringToFront(id);
    }
  };

  const closeApp = (id: string) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id as keyof typeof windows], isOpen: false } }));
  };

  return (
    <main className="w-screen h-screen overflow-hidden relative">

      {/* 1. MenuBar sits at the top */}
      <div className="absolute top-0 left-0 w-full z-50">
        <MenuBarLayout />
      </div>

      {/* 2. DESKTOP BOUNDARY CONTAINER */}
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

        {/* SIRI */}
        <WindowLayout
          id="siri"
          title="Siri"
          dockId="dock-icon-siri"
          isOpen={windows.siri.isOpen} isMinimized={windows.siri.isMinimized}
          onClose={() => closeApp('siri')} onMinimize={() => toggleApp('siri')} onFocus={() => bringToFront('siri')}
          zIndex={windows.siri.z} width={400} height={600}
        >
          <SiriApp onOpenApp={openApp} />
        </WindowLayout>

        {/* RESUME */}
        <WindowLayout
          id="resume"
          title="Resume - Md Zayed Ghanchi"
          dockId="dock-icon-resume"
          isOpen={windows.resume.isOpen} isMinimized={windows.resume.isMinimized}
          onClose={() => closeApp('resume')} onMinimize={() => toggleApp('resume')} onFocus={() => bringToFront('resume')}
          zIndex={windows.resume.z} width={'40%'} height={'70%'}
        >
          <ResumeApp />
        </WindowLayout>

        {/* Calculator */}
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

      </div>

      {/* 3. Dock */}
      <DockLayout onOpenApp={toggleApp} openApps={Object.fromEntries(Object.entries(windows).map(([k, v]) => [k, v.isOpen && !v.isMinimized]))} />
    </main>
  );
}