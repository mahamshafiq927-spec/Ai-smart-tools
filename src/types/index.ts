export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  provider: 'google' | 'password';
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export type ToolId = 
  | 'article-writer'
  | 'email-writer'
  | 'code-explainer'
  | 'summarizer'
  | 'social-media'
  | 'translator'
  | 'brainstorm'
  | 'prompt-enhancer';

export interface ToolOption {
  id: string;
  label: string;
  type: 'select' | 'text' | 'range';
  defaultValue: string | number;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  badge: string;
  description: string;
  category: 'Writing' | 'Coding' | 'Business' | 'Marketing' | 'Creativity';
  icon: string;
  placeholder: string;
  systemSummary: string;
  options: ToolOption[];
  presetPrompts: { title: string; prompt: string }[];
}

export interface SavedCreation {
  id: string;
  userId: string;
  toolId: ToolId;
  toolName: string;
  prompt: string;
  result: string;
  createdAt: string;
  wordCount: number;
}
