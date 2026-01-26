import contactDetails from "./contactDetails";

// Portfolio/Profile information
export const profileData = {
  name: 'Md Zayed Ghanchi',
  location: 'Kharagpur, India',
  education: '2nd Year UG @ IIT Kharagpur',
  focus: 'SDE & Web Developments',
  role: 'Full Stack Developer',
  bio: 'Undergraduate student at IIT Kharagpur. Always learning, building, and pushing code.',
  specialization: 'React, Next.js & Modern UI',
  status: 'Working as Front end Developer at @COMPANY',
  contact: {
    email: contactDetails.email,
    github: contactDetails.github,
    linkedin: contactDetails.linkedin
  },
  techStack: [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind',
    'Node.js',
    'MongoDB',
    'Express',
    'MERN Stack',
  ],
  currently_exploring: [
    'Docker',
    'PostgreSQL',
    'AWS',
    'FastAPI',
    'Firebase',
    'Supabase'
  ]
};

// Skills/Technologies data
export interface Skill {
  name: string;
  desc: string;
  file: string;
  color: string;
}

export const skills: Skill[] = [
  { name: "Next.js", desc: "React Framework", file: "nextjs_icon_dark.svg", color: "bg-white/10 text-white" },
  { name: "React", desc: "UI Library", file: "react_dark.svg", color: "bg-blue-500/10 text-blue-400" },
  { name: "TypeScript", desc: "JavaScript but better", file: "typescript.svg", color: "bg-blue-600/10 text-blue-500" },
  { name: "Tailwind", desc: "CSS Framework", file: "tailwindcss.svg", color: "bg-cyan-500/10 text-cyan-400" },
//   { name: "FastAPI", desc: "High Performance API", file: "fastapi.svg", color: "bg-teal-500/10 text-teal-400" },
  { name: "Node.js", desc: "Runtime Environment", file: "nodejs.svg", color: "bg-green-600/10 text-green-500" },
  { name: "MongoDB", desc: "NoSQL Database", file: "mongodb-icon-dark.svg", color: "bg-green-500/10 text-green-400" },
//   { name: "PostgreSQL", desc: "Relational Database", file: "postgresql.svg", color: "bg-blue-400/10 text-blue-300" },
//   { name: "AWS", desc: "Cloud Infrastructure", file: "aws_dark.svg", color: "bg-yellow-600/10 text-yellow-500" },
//   { name: "Docker", desc: "Containerization", file: "docker.svg", color: "bg-blue-600/10 text-blue-500" },
  { name: "Git", desc: "Version Control", file: "git.svg", color: "bg-orange-600/10 text-orange-500" },
  { name: "Figma", desc: "Design Tool", file: "figma.svg", color: "bg-purple-500/10 text-purple-400" },
];

// Experience data
export interface Experience {
  title: string;
  company: string;
  status: string;
  description: string;
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    title: "Front End Intern",
    company: "Tilak Karvekar",
    status: "Present",
    description: "Creating Responsive websites constituting charts of various fundamental metrics of company. Handling huge data and optimizing the website for better performance and user experience.",
    technologies: ["React", "Tailwind"]
  },
  {
    title: "Tech Team Member",
    company: "NSSC IIT Kharagpur",
    status: "2024-2025",
    description: "Contributed to the development of the official NSSC website using Next.js and Modern UI. Improved user engagement by implementing responsive design principles.",
    technologies: ["Next.js", "MongoDB", "Express"]
  }
];

export interface Projects {
  id: number;
  name: string;
  description: string;
  techStack: string[];
  link: string | null;
  role: string;
}

export const projects: Projects[] = [
  {
    id: 1,
    name: "Vylos",
    description: "A web application to deploy your react, node or static projects for free with custom domains and serverless. Uses FastAPI backend with AWS deployment and nginx server.",
    techStack: ["AWS", "Nginx", "FastAPI", "Docker", "PostgreSQL"],
    link: null,
    role: "Full Stack Developer",
  },
  {
    id: 2,
    name: "Inter IIT Tech Meet 14.0 - Pathway",
    description: "Development team member for the Pathway problem statement focused on Agentic AI. Helped with Frontend, Backend and DevOps",
    techStack: ["Next.js", "Docker", "AWS", "FastAPI", "PostgreSQL"],
    link: null,
    role: "Dev Team Member"
  },
  {
    id: 3,
    name: "NSSC Official Website",
    description: "Frontend development for the National Students' Space Challenge official website.",
    techStack: ["Next.js", "React"],
    link: "https://nssc.in",
    role: "Frontend Developer"
  },
  {
    id: 4,
    name: "NSSC Student Ambassador Portal",
    description: "Web platform for the Student Ambassador program of NSSC.",
    techStack: ["Next.js", "React"],
    link: "https://sa.nssc.in",
    role: "Frontend Developer"
  },
];
