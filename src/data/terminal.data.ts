// Terminal command responses
export interface CommandResponse {
  command: string;
  response: string;
}

export const terminalCommands: Record<string, string> = {
  help: 'Available commands: help, clear, about, contact',
  about: 'I am a 2nd year Aerospace student at IIT KGP.',
  contact: 'Email: zayed@example.com',
};

export const terminalUsername = 'zayed';
export const terminalHost = 'macbook';
export const terminalPrompt = '~ %';
