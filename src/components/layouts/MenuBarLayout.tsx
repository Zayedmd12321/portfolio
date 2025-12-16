'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, BatteryCharging, Search, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS } from '@/context/OSContext';
import { MenuButton } from '@/components/ui/MenuButton';
import { MenuDropdown } from '@/components/ui/MenuDropdown';
import { appleMenuItems } from '@/data/menu.data';
import { wallpapers } from '@/data/wallpapers.data';

function useBattery() {
  const [battery, setBattery] = useState({ level: 1, charging: false, loaded: false });

  useEffect(() => {
    // @ts-ignore
    if (typeof navigator.getBattery === 'function') {
      // @ts-ignore
      navigator.getBattery().then((bat) => {
        const updateBattery = () => {
          setBattery({
            level: bat.level,
            charging: bat.charging,
            loaded: true,
          });
        };
        updateBattery();
        bat.addEventListener('levelchange', updateBattery);
        bat.addEventListener('chargingchange', updateBattery);
      });
    } else {
      setBattery({ level: 1, charging: false, loaded: true });
    }
  }, []);

  return battery;
}

export default function MenuBarLayout() {
  const [time, setTime] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const battery = useBattery();
  const menuRef = useRef<HTMLDivElement>(null);
  const controlCenterRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme, changeWallpaper } = useOS();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (activeMenu !== 'control-center') {
            setActiveMenu(null);
        }
      }
      if (controlCenterRef.current && !controlCenterRef.current.contains(event.target as Node)) {
         if (activeMenu === 'control-center') {
            setActiveMenu(null);
         }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setTime(`${dateStr}  ${timeStr}`);
    };
    tick();
    const t = setInterval(tick, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 w-full h-9 z-9999 bg-black/20 backdrop-blur-xl border-b border-white/5 text-white shadow-sm select-none flex justify-between px-2 sm:px-4 items-center font-medium text-[13px]">
      
      {/* Left Side */}
      <div className="flex items-center gap-1 sm:gap-4 h-full relative" ref={menuRef}>
        <div className="relative">
          <MenuButton 
            active={activeMenu === 'apple'} 
            onClick={() => setActiveMenu(activeMenu === 'apple' ? null : 'apple')}
          >
             <img 
              src="/icons/apple.svg" 
              alt="Apple Logo" 
              className="w-4 h-4 object-contain drop-shadow-sm opacity-90 brightness-0 invert" 
            />
          </MenuButton>
          <MenuDropdown isOpen={activeMenu === 'apple'} items={appleMenuItems} />
        </div>

        <MenuButton label="Finder" bold />
        <div className="hidden sm:flex items-center gap-3">
            <MenuButton label="File" />
            <MenuButton label="Edit" />
            <MenuButton label="View" />
            <MenuButton label="Go" />
            <MenuButton label="Window" />
            <MenuButton label="Help" />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 h-full">
        <div className="hidden sm:flex items-center gap-3 opacity-90">
            <div className="flex items-center gap-2">
                <span className="text-xs opacity-80">{Math.round(battery.level * 100)}%</span>
                {battery.charging ? (
                    <BatteryCharging size={18} className="text-green-400" />
                ) : (
                    <div className="relative">
                        <Battery size={20} className="text-gray-300" />
                        <div 
                            className="absolute top-1.5 left-0.5 h-2 bg-white rounded-[1px]" 
                            style={{ width: `${battery.level * 12}px` }} 
                        />
                    </div>
                )}
            </div>
            
            <Wifi size={16} strokeWidth={2.5} />
            <Search size={16} strokeWidth={2.5} />
            
            {/* Control Center */}
            <div className="relative" ref={controlCenterRef}>
                <div 
                    onClick={() => setActiveMenu(activeMenu === 'control-center' ? null : 'control-center')}
                    className={`ml-1 cursor-default p-1 rounded transition-colors ${activeMenu === 'control-center' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white'}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                        <circle cx="8" cy="6" r="2" fill="white" />
                        <circle cx="16" cy="12" r="2" fill="white" />
                        <circle cx="8" cy="18" r="2" fill="white" />
                    </svg>
                </div>

                <AnimatePresence>
                    {activeMenu === 'control-center' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute top-10 -right-20 sm:right-0 w-75 bg-[#1e1e1eb3] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-2xl p-4 flex flex-col gap-4 z-10000"
                        >
                            {/* Theme Toggle */}
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-gray-400 ml-1">Display & Theme</span>
                                <button 
                                    onClick={toggleTheme}
                                    className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl border border-white/5 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            {theme === 'dark' ? <Moon size={16} fill="currentColor" /> : <Sun size={16} fill="currentColor" />}
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-medium text-white">Dark Mode</span>
                                            <span className="text-[10px] text-gray-400">{theme === 'dark' ? 'On' : 'Off'}</span>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Wallpaper Picker */}
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-gray-400 ml-1">Wallpapers</span>
                                <div className="grid grid-cols-5 gap-2">
                                    {wallpapers.map((wp) => (
                                        <button
                                            key={wp.id}
                                            onClick={() => changeWallpaper(wp.path)}
                                            className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-blue-500 hover:scale-110 transition-all shadow-sm"
                                        >
                                            <img 
                                                src={wp.path} 
                                                alt={wp.alt}
                                                className="w-full h-full object-cover" 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        <span className="text-[13px] font-medium min-w-32.5 text-right tabular-nums tracking-wide">
            {time}
        </span>
      </div>
    </div>
  );
}
