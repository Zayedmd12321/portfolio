// Portfolio/Profile information
export const profileData = {
  name: 'Md Zayed Ghanchi',
  location: 'Kharagpur, India',
  education: 'Aerospace Eng. @ IIT Kharagpur',
  focus: 'SDE & DevOps',
  role: 'Full Stack Developer',
  bio: '2nd year Aero student obsessed with software.',
  specialization: 'React, Next.js & Modern UI',
  status: 'Working as Front end Developer at @COMPANY',
  contact: {
    email: 'email@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  techStack: [
    'Next.js',
    'MERN Stack',
    'FastAPI',
    'AWS',
    'Agentic AI'
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
    title: "Full Stack Intern",
    company: "TechCorp Inc.",
    status: "Present",
    description: "Spearheading the migration of legacy code to modern React architecture. Optimized database queries in PostgreSQL reducing latency by 40%.",
    technologies: ["React", "FastAPI", "PostgreSQL"]
  },
  {
    title: "Frontend Freelancer",
    company: "Self Employed",
    status: "2024",
    description: "Delivered high-performance marketing sites and dashboards. Focused on pixel-perfect implementations of Figma designs.",
    technologies: ["Next.js", "Tailwind"]
  }
];
