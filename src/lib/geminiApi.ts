import { authService } from './authService.ts';
import type { ToolId } from '../types/index.ts';

export interface GenerateRequestOptions {
  tool: ToolId;
  prompt: string;
  options?: Record<string, any>;
}

export interface GenerateResponse {
  result: string;
  tool: string;
  timestamp: string;
}

export async function generateAiContent(params: GenerateRequestOptions): Promise<string> {
  const token = authService.getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please sign in to access MagicAI smart tools.');
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      tool: params.tool,
      prompt: params.prompt,
      options: params.options || {}
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Generation failed with status ${response.status}`);
  }

  return data.result;
}
