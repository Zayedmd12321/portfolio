import { LucideIcon } from 'lucide-react';

export type Category = 'all' | 'skill' | 'soft' | 'logistics' | 'action';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  avatar: LucideIcon;
  email?: string;
  location?: string;
  note: string;
  type: Category;
  color: string;
}
