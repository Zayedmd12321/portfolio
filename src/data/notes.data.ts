// Notes app initial data
export interface Note {
  id: string;
  title: string;
  date: string;
  preview: string;
  isPortfolio: boolean;
  body: string;
}

export const initialNotes: Note[] = [
  {
    id: 'about',
    title: 'About Me',
    date: '12/13/2025',
    preview: 'Md Zayed Ghanchi - Portfolio',
    isPortfolio: true,
    body: ''
  }
];
