// Menu bar configuration data
export interface MenuItem {
  label?: string;
  shortcut?: string;
  separator?: boolean;
}

export const appleMenuItems: MenuItem[] = [
  { label: 'About This Mac' },
  { separator: true },
  { label: 'System Settings...' },
  { label: 'App Store...' },
  { separator: true },
  { label: 'Force Quit...', shortcut: '⌥⌘Esc' },
  { separator: true },
  { label: 'Sleep' },
  { label: 'Restart...' },
  { label: 'Shut Down...' },
  { separator: true },
  { label: 'Lock Screen', shortcut: '⌃⌘Q' },
  { label: 'Log Out User...', shortcut: '⇧⌘Q' },
];
