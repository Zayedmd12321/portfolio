import { Zap, Terminal, Music, Mail, Moon, Cpu, Eye, Layers, Code, Briefcase } from 'lucide-react';

export type AchievementCategory = 'system' | 'apps' | 'hidden';

export const ACHIEVEMENTS = [
  // --- SYSTEM ---
  {
    id: 'boot_up',
    title: 'Hello World',
    description: 'Boot up the portfolio for the first time.',
    xp: 100,
    icon: Cpu,
    category: 'system',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'explorer',
    title: 'Power User',
    description: 'Open 5 different applications.',
    xp: 150,
    icon: Layers,
    category: 'system',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'night_owl',
    title: 'Dark Side',
    description: 'Switch to Dark Mode.',
    xp: 75,
    icon: Moon,
    category: 'system',
    color: 'from-indigo-500 to-purple-600'
  },

  // --- APPS ---
  {
    id: 'terminal_wizard',
    title: 'Hacker Mode',
    description: 'Open the Terminal app.',
    xp: 50,
    icon: Terminal,
    category: 'apps',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'music_lover',
    title: 'Vibe Check',
    description: 'Open the Music app.',
    xp: 50,
    icon: Music,
    category: 'apps',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'recruiter',
    title: 'You\'re Hired!',
    description: 'Open the Mail or Resume app.',
    xp: 200,
    icon: Briefcase,
    category: 'apps',
    color: 'from-yellow-400 to-orange-500'
  },
  
  // --- HIDDEN ---
  {
    id: 'stalker',
    title: 'Deep Dive',
    description: 'Read the "About Me" note.',
    xp: 100,
    icon: Eye,
    category: 'hidden',
    color: 'from-teal-400 to-blue-500'
  }
];