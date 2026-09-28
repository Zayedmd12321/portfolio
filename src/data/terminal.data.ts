// Terminal command responses
export interface CommandResponse {
  command: string;
  response: string;
}

export const terminalCommands: Record<string, string> = {
  help: 'Available commands: help, clear, about, contact, whoami, skills',
  about: 'Md Zayed Ghanchi — B.Tech Aerospace @ IIT Kharagpur. Incoming SDE @ Corridor Platforms.',
  whoami: 'zayed',
  skills: 'React, Next.js, TypeScript, FastAPI, Python, Node.js, PostgreSQL, Docker, AWS, Kafka.',
  contact: 'Email: eagle.zayed@gmail.com | GitHub: Zayedmd12321 | LinkedIn: md-zayed-ghanchi',
};

export const terminalUsername = 'zayed';
export const terminalHost = 'macbook';
export const terminalPrompt = '~ %';
