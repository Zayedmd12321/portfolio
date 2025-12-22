'use client';
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { NotificationProvider, useNotification } from '@/context/NotificationContext';

function DesktopContent() {
  const { showNotification } = useNotification();
  
  // --- Boot & Mount State ---
  const [isMounted, setIsMounted] = useState(false);
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [bootSequencePhase, setBootSequencePhase] = useState<'boot' | 'terminal' | 'complete'>('boot');
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
  });

  const [centerPosition, setCenterPosition] = useState({ x: 100, y: 50 });

  useEffect(() => {
    const calculateCenter = () => {
      if (typeof window !== 'undefined') {
        const notesWidth = Math.min(window.innerWidth * 0.6, 1000); 
        const notesHeight = 700;
        const x = (window.innerWidth - notesWidth) / 2;
        const y = (window.innerHeight - 36 - notesHeight) / 2;
        setCenterPosition({ x: Math.max(10, x), y: Math.max(40, y) });
      }
    };

    calculateCenter();
    
    // Simulate loading assets
    const initTimer = setTimeout(() => setIsMounted(true), 1500); 

    window.addEventListener('resize', calculateCenter);
    return () => {
        window.removeEventListener('resize', calculateCenter);
        clearTimeout(initTimer);
    };
  }, []);

  // Boot sequence effect
  useEffect(() => {
    if (!showBootScreen && bootSequencePhase === 'boot') {
      // Phase 1: Open terminal in boot mode
      setBootSequencePhase('terminal');
      setWindows(prev => ({
        ...prev,
        terminal: { ...prev.terminal, isOpen: true, isMinimized: false }
      }));
      bringToFront('terminal');
    }
  }, [showBootScreen, bootSequencePhase]);

  // Handle terminal boot completion callback
  const handleTerminalBootComplete = () => {
    setTerminalBootMode(false);
    setBootSequencePhase('complete');
    
    // Wait a bit, then open notes
    setTimeout(() => {
      setWindows(prev => ({
        ...prev,
        notes: { ...prev.notes, isOpen: true, isMinimized: false }
      }));
      bringToFront('notes');
      
      // Show notification after notes opens
      setTimeout(() => {
        showNotification(
          'System Online',
          "Portfolio loaded successfully. Explore apps from the Dock or ask Siri.",
          'system'
        );
      }, 500);
    }, 800);
  };

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

  return (
    <main className="w-screen h-screen relative selection:bg-blue-500/30">
      
      {/* 1. Boot Screen - Sits on top (z-[99999]) */}
      {showBootScreen && (
        <BootScreen 
            isLoading={!isMounted} 
            onComplete={() => setShowBootScreen(false)} 
        />
      )}

      {/* 2. Main Desktop - Fades in when boot is done */}
      <motion.div 
        className="w-full h-full relative"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
            opacity: showBootScreen ? 0 : 1, 
            scale: showBootScreen ? 1.1 : 1 
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
          {/* --- WALLPAPER LAYER (FIXED) --- */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center" 
            style={{ backgroundImage: 'var(--wallpaper)' }}
          >
             {/* Optional tint for better contrast */}
             <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Menubar */}
          <div className="absolute top-0 left-0 w-full z-50">
            <MenuBarLayout />
          </div>

          <Notification />

          {/* Windows Area */}
          <div className="absolute top-9 left-0 w-full h-[calc(100%-36px)]">
            
            <WindowLayout
              id="notes"
              title="Notes"
              dockId="dock-icon-notes"
              isOpen={windows.notes.isOpen} isMinimized={windows.notes.isMinimized}
              onClose={() => closeApp('notes')} onMinimize={() => toggleApp('notes')} onFocus={() => bringToFront('notes')}
              zIndex={windows.notes.z}
              width={'60%'}
              minWidth={300}
              minHeight={700}
              x={centerPosition.x}
              y={centerPosition.y}
              sidebar={true}
            >
              <NotesApp />
            </WindowLayout>

            <WindowLayout
              id="siri"
              title="Siri"
              dockId="dock-icon-siri"
              isOpen={windows.siri.isOpen} isMinimized={windows.siri.isMinimized}
              onClose={() => closeApp('siri')} onMinimize={() => toggleApp('siri')} onFocus={() => bringToFront('siri')}
              zIndex={windows.siri.z}
              width={500}
              height={600}
            >
              <SiriApp onOpenApp={openApp} />
            </WindowLayout>

            <WindowLayout
              id="mail"
              title="Mail"
              dockId="dock-icon-mail"
              isOpen={windows.mail.isOpen} isMinimized={windows.mail.isMinimized}
              onClose={() => closeApp('mail')} onMinimize={() => toggleApp('mail')} onFocus={() => bringToFront('mail')}
              zIndex={windows.mail.z} width={900} height={600} sidebar={true}
            >
              <MailApp />
            </WindowLayout>

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
              zIndex={windows.terminal.z} width={600} height={600}
            >
              <TerminalApp bootMode={terminalBootMode} onBootComplete={handleTerminalBootComplete} />
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
              zIndex={windows.music.z} minWidth={900} width={'40%'} minHeight={500} height={'30%'}
            >
              <MusicApp />
            </WindowLayout>

          </div>

          <DockLayout onOpenApp={toggleApp} openApps={Object.fromEntries(Object.entries(windows).map(([k, v]) => [k, v.isOpen && !v.isMinimized]))} />
      </motion.div>
    </main>
  );
}

export default function Desktop() {
  return (
    <NotificationProvider>
      <DesktopContent />
    </NotificationProvider>
  );
}