// Finder sidebar and file data
import { HardDrive, Clock, AppWindow, Download, Cloud } from 'lucide-react';

export interface SidebarItemConfig {
  icon: any;
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
  { label: 'Portfolio v1', type: 'folder' },
  { label: 'Inter IIT', type: 'folder' },
  { label: 'profile.jpg', type: 'image' },
  { label: 'main.py', type: 'code' },
];
