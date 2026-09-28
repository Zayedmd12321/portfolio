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
    date: '09/28/2026',
    preview: 'Md Zayed Ghanchi — Portfolio',
    isPortfolio: true,
    body: ''
  },
  {
    id: 'projects',
    title: 'Projects',
    date: '09/28/2026',
    preview: 'Vylos, Wind Router, Pathway & more',
    isPortfolio: true,
    body: ''
  }
];
