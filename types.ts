export interface AgentPersona {
  name: string;
  description: string;
  expertise: string[];
  personalityTraits: string[];
  avatarPrompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
