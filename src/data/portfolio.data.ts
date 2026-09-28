import contactDetails from "./contactDetails";

// Portfolio/Profile information
export const profileData = {
  name: 'Md Zayed Ghanchi',
  location: 'Cuttack, Odisha, India',
  education: 'B.Tech (Hons.) Aerospace Engineering @ IIT Kharagpur',
  focus: 'Full-Stack Development & Backend Systems',
  role: 'Software Engineer',
  bio: 'B.Tech Aerospace student at IIT Kharagpur, building resilient, large-scale web systems. Incoming Software Developer at Corridor Platforms.',
  specialization: 'React, Next.js, FastAPI & Distributed Systems',
  status: 'Incoming SDE Intern @ Corridor Platforms | SWE Intern @ ResearchFundamental',
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
    'Python',
    'FastAPI',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Nginx',
    'Kafka',
    'AWS',
    'MERN Stack',
  ],
  currently_exploring: [
    'Kubernetes',
    'System Design',
    'Distributed Systems',
    'Agentic AI',
    'Rust',
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
  { name: "TypeScript", desc: "Typed JavaScript", file: "typescript.svg", color: "bg-blue-600/10 text-blue-500" },
  { name: "Tailwind", desc: "CSS Framework", file: "tailwindcss.svg", color: "bg-cyan-500/10 text-cyan-400" },
  { name: "Python", desc: "Backend & Scripting", file: "python.svg", color: "bg-yellow-500/10 text-yellow-400" },
  { name: "C++", desc: "Systems Programming", file: "cpp.svg", color: "bg-blue-500/10 text-blue-400" },
  { name: "FastAPI", desc: "High-Performance API", file: "fastapi.svg", color: "bg-teal-500/10 text-teal-400" },
  { name: "Node.js", desc: "JS Runtime", file: "nodejs.svg", color: "bg-green-600/10 text-green-500" },
  { name: "Express", desc: "Node Web Framework", file: "expressjs_dark.svg", color: "bg-white/10 text-white" },
  { name: "PostgreSQL", desc: "Relational Database", file: "postgresql.svg", color: "bg-blue-400/10 text-blue-300" },
  { name: "MongoDB", desc: "NoSQL Database", file: "mongodb-icon-dark.svg", color: "bg-green-500/10 text-green-400" },
  { name: "Redis", desc: "In-Memory Cache", file: "redis.svg", color: "bg-red-500/10 text-red-400" },
  { name: "Docker", desc: "Containerization", file: "docker.svg", color: "bg-blue-600/10 text-blue-500" },
  { name: "Kafka", desc: "Event Streaming", file: "kafka.svg", color: "bg-neutral-500/10 text-neutral-300" },
  { name: "Nginx", desc: "Reverse Proxy", file: "nginx.svg", color: "bg-green-500/10 text-green-400" },
  { name: "AWS", desc: "Cloud Infrastructure", file: "aws_dark.svg", color: "bg-yellow-600/10 text-yellow-500" },
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
  logo?: string;
  logoBg?: string;
  logoScale?: number;
  logoText?: { text: string; className: string };
}

export const experiences: Experience[] = [
  {
    title: "Software Developer",
    company: "Corridor Platforms",
    status: "Incoming",
    description: "Joining as an incoming Software Developer to build platform tooling for governed AI and risk-decisioning systems used by global financial institutions.",
    technologies: ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
    logo: "/logos/corridor.svg",
    logoBg: "bg-white"
  },
  {
    title: "Software Developer Intern",
    company: "ResearchFundamental",
    status: "Present",
    description: "Extracted 11.7M daily OHLCV bars across 4,391 BSE tickers, flagging 218 stocks with unadjusted corporate actions. Built the OEM/FADA analytics module benchmarking 50+ India-market OEMs, and shipped interactive financial models with MUI X Charts for 3000+ companies. Automated GitHub issue creation and gated Claude-authored fix PRs behind team review.",
    technologies: ["React", "Node.js", "Python", "PostgreSQL", "MongoDB"],
    logoBg: "bg-white",
    logoText: {
      text: "RF",
      className: "text-blue-600 font-bold tracking-tight text-[0.9375rem] leading-none",
    }
  },
  {
    title: "InterIIT Tech Meet 14.0 - Pathway (Silver)",
    company: "IIT Kharagpur Contingent",
    status: "Nov 2025 - Dec 2025",
    description: "Built a polymorphic 37-pattern candlestick detection engine over 1-hour OHLCV data for 80 US tickers, with nightly LLM reasoning cron jobs over Postgres. Contributed to a 15-service host-mode Docker Compose platform spanning FastAPI, Postgres, Redis and Kafka, streaming detections to the frontend over WebSockets. Silver medal — contingent Gold.",
    technologies: ["FastAPI", "PostgreSQL", "Redis", "Kafka", "Docker", "Next.js"],
    logo: "/logos/interiit.png",
    logoBg: "bg-white"
  },
  {
    title: "Tech Head",
    company: "National Students' Space Challenge, IIT Kharagpur",
    status: "May 2025 - Present",
    description: "Built the NSSC registrations backend in Node.js + Express, powering 4500+ registrations across 300+ teams for 10+ events. Own 5 society websites end-to-end across 5 GitHub orgs and 10+ repos, from MERN development to Vercel deploys. Ran on-ground ops for 500+ attendees at NSSC 2025.",
    technologies: ["Next.js", "Node.js", "Express", "MongoDB"],
    logo: "/logos/nssc.png",
    logoBg: "bg-white"
  },
  {
    title: "Senior Executive Member",
    company: "Space Technology Students' Society (spAts), IIT Kharagpur",
    status: "Feb 2025 - Present",
    description: "Recruited, trained and now lead the tech team building the NSSC 2026 portal — owning the stack, task allocation and code review. Cultivated frontend proficiency across 13 juniors with hands-on production build tasks and ran an internal team hackathon.",
    technologies: ["React", "Next.js", "TypeScript"],
    logo: "/logos/spats.png",
    logoBg: "bg-white",
    logoScale: 1.5
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
    name: "Vylos — Containerized PaaS",
    description: "A Heroku-style deployment platform. Orchestrates full container lifecycle via the Docker SDK, deploying GitHub repos to live subdomains and scaling to 8 containers on a single EC2 node. Dynamic Nginx reverse-proxy generator auto-reloads per-app subdomain routes, FastAPI routes are secured with stateless JWTs behind GitHub + Google OAuth 2.0, and real-time container logs stream to the dashboard over persistent SSE.",
    techStack: ["FastAPI", "Docker", "Nginx", "AWS", "PostgreSQL"],
    link: null,
    role: "Full Stack Developer",
  },
  {
    id: 2,
    name: "Wind Optimal Flight Route Planner",
    description: "3D (lat/lon/altitude) graph optimizer minimizing fuel burn through real NOAA GFS winds — saves 2.6–6.9% vs. the great-circle route. A* with a provably admissible tailwind heuristic expands 42% fewer nodes than Dijkstra at equal cost, and a hybrid A* over a 4-D state space respects banked-turn physics. Server-side GRIB subsetting compresses wind data ~13,700x (490 MB → 37 KB), cached in Redis on FastAPI.",
    techStack: ["Python", "FastAPI", "Redis", "NumPy"],
    link: null,
    role: "Solo Developer"
  },
  {
    id: 3,
    name: "InterIIT 14.0 — Pathway (Silver)",
    description: "Polymorphic 37-pattern candlestick detection engine over 1-hour OHLCV for 80 US tickers, with nightly LLM reasoning cron jobs. Real-time detections and reasoning stream to the frontend over WebSockets, powered by Kafka event streams across a 15-service host-mode Docker Compose stack.",
    techStack: ["Next.js", "FastAPI", "PostgreSQL", "Kafka", "Docker"],
    link: null,
    role: "Dev Team Member"
  },
  {
    id: 4,
    name: "Query Management System",
    description: "Role-based ticket platform spanning 5 teams (management, sponsorship, tech, PR, design) with RBAC permissions. LLM-driven auto-assignment matches free-text queries against a JSON knowledge base, and admin-controlled workflows gate escalation, reassignment and status updates with automated emails.",
    techStack: ["Next.js", "Node.js", "MongoDB", "TypeScript"],
    link: null,
    role: "Full Stack Developer"
  },
  {
    id: 5,
    name: "NSSC Official Website",
    description: "Official website of the National Students' Space Challenge, IIT Kharagpur — powered 4500+ registrations across 300+ teams for 10+ events and 5+ workshops.",
    techStack: ["Next.js", "React", "MongoDB", "Node.js"],
    link: "https://nssc.in",
    role: "Tech Head"
  },
  {
    id: 6,
    name: "NSSC Student Ambassador Portal",
    description: "Web platform for the NSSC Student Ambassador program — registration, dashboard, and rewards flow.",
    techStack: ["Next.js", "React"],
    link: "https://sa.nssc.in",
    role: "Frontend Developer"
  },
];
