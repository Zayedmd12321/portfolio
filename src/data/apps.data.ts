// Application configuration data
export interface AppConfig {
  id: string;
  name: string;
  icon: string;
}

export const dockApps: AppConfig[] = [
  { id: 'finder', name: 'Finder', icon: '/icons/Finder.png' },
  { id: 'safari', name: 'Safari', icon: '/icons/Safari.png' },
  { id: 'notes', name: 'Notes', icon: '/icons/Notes.png' },
  { id: 'siri', name: 'Siri', icon: '/icons/Siri.png' },
  { id: 'mail', name: 'Mail', icon: '/icons/Mail.png' },
  { id: 'photos', name: 'Photos', icon: '/icons/Photos.png' },
  { id: 'terminal', name: 'Terminal', icon: '/icons/Terminal.png' },
  { id: 'vscode', name: 'VS Code', icon: '/icons/VSCode.svg' },
  { id: 'music', name: 'Music', icon: '/icons/Music.png' },
  { id: 'system', name: 'Settings', icon: '/icons/System.png' },
  { id: 'calculator', name: 'Calculator', icon: '/icons/Calculator.png' },
  { id: 'contacts', name: 'Contacts', icon: '/icons/Contacts.png' },
];
