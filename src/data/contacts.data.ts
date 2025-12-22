import { 
  Briefcase, Zap, ShieldCheck, ThumbsUp, 
  Brain, Calendar, Rocket 
} from 'lucide-react';
import { Contact } from '@/types/contacts.types';

export const CONTACTS: Contact[] = [
  // 1. ACTION
  {
    id: 'offer',
    firstName: 'Hiring',
    lastName: 'Manager',
    company: 'Your Company',
    role: 'Decision Maker',
    avatar: Briefcase, 
    email: 'zayed@example.com',
    location: 'Pending Decision',
    note: 'The candidate has passed all technical and cultural assessments. Ready to proceed with an offer.',
    type: 'action',
    color: 'bg-blue-600'
  },

  // 2. HARD SKILLS
  {
    id: 'tech',
    firstName: 'Technical',
    lastName: 'Proficiency',
    company: 'Engineering Dept',
    role: 'Senior Level',
    avatar: Zap,
    location: 'React / Next.js / Node',
    note: 'Demonstrates exceptional ability to build scalable, performant web applications. Code quality is high-grade.',
    type: 'skill',
    color: 'bg-orange-500'
  },
  {
    id: 'arch',
    firstName: 'System',
    lastName: 'Architecture',
    company: 'Engineering Dept',
    role: 'Expert',
    avatar: ShieldCheck,
    note: 'Understands complex data flows, state management, and modern CI/CD pipelines.',
    type: 'skill',
    color: 'bg-orange-500'
  },

  // 3. SOFT SKILLS
  {
    id: 'culture',
    firstName: 'Cultural',
    lastName: 'Fit',
    company: 'HR Dept',
    role: '10/10 Score',
    avatar: ThumbsUp,
    note: 'Collaborative, low-ego, and communicates clearly. Elevates the team environment.',
    type: 'soft',
    color: 'bg-green-500'
  },
  {
    id: 'growth',
    firstName: 'Growth',
    lastName: 'Mindset',
    company: 'L&D Dept',
    role: 'Adaptive',
    avatar: Brain,
    note: 'Rapidly adapts to new technologies. Views challenges as opportunities to learn.',
    type: 'soft',
    color: 'bg-green-500'
  },

  // 4. LOGISTICS
  {
    id: 'start',
    firstName: 'Start',
    lastName: 'Date',
    company: 'Operations',
    role: 'Immediate',
    avatar: Calendar,
    location: 'Remote / Hybrid',
    note: 'Candidate is ready to deploy immediately. No complex notice period required.',
    type: 'logistics',
    color: 'bg-purple-500'
  },
  {
    id: 'roi',
    firstName: 'Return on',
    lastName: 'Investment',
    company: 'Finance',
    role: 'High',
    avatar: Rocket,
    note: 'Hiring this candidate is projected to yield high returns in productivity and product quality.',
    type: 'logistics',
    color: 'bg-purple-500'
  }
];
