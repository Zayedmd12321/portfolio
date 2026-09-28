// Finder sidebar and file data
import { HardDrive, Clock, AppWindow, Download, Cloud, type LucideIcon } from 'lucide-react';

export interface SidebarItemConfig {
  icon: LucideIcon;
  label: string;
}

export interface FileItemConfig {
  label: string;
  type: 'folder' | 'image' | 'code';
}

export const finderSidebarFavorites: SidebarItemConfig[] = [
  { icon: HardDrive, label: 'Macintosh HD' },
  { icon: Clock, label: 'Recents' },
  { icon: AppWindow, label: 'Applications' },
  { icon: Download, label: 'Downloads' },
];

export const finderSidebarCloud: SidebarItemConfig[] = [
  { icon: Cloud, label: 'iCloud Drive' },
];

export const finderFiles: FileItemConfig[] = [
  { label: 'Vylos', type: 'folder' },
  { label: 'Inter IIT 14.0', type: 'folder' },
  { label: 'zayed.png', type: 'image' },
  { label: 'main.py', type: 'code' },
];
