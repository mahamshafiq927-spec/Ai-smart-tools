import { GoogleGenAI } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';

dotenv.config();

// Ensure Gemini client is instantiated with the server-side key
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// System prompts tailored for each MagicAI tool
const TOOL_SYSTEM_PROMPTS: Record<string, string> = {
  'article-writer': `You are MagicAI's master editorial and article writing engine. 
Produce high quality, engaging, well-structured articles with compelling headlines, introduction hooks, organized subheadings (Markdown H2/H3), readable paragraphs, and clear conclusions. Adhere strictly to the requested tone, format, and length.`,

  'email-writer': `You are MagicAI's executive communications expert.
Draft polished, high-converting, professional emails with clear subject lines, respectful greetings, clear context, actionable value proposition, crisp call-to-action (CTA), and professional sign-off.`,

  'code-explainer': `You are MagicAI's senior software engineer and code mentor.
When explaining code, provide step-by-step logic breakdowns, complexity notes (Time/Space O(n)), best practices, and potential edge cases.
When debugging or refactoring, highlight the exact flaw, provide the corrected code in markdown codeblocks, and explain the fix thoroughly.`,

  'summarizer': `You are MagicAI's executive synthesizer and text summarizer.
Distill documents, notes, or articles into:
1. Executive Summary (TL;DR)
2. Core Takeaways (Bullet points)
3. Action Items or Decisions (if applicable)
Ensure zero fluff and maximum density of insight.`,

  'social-media': `You are MagicAI's viral social media growth strategist.
Create high-engagement posts tailored to the requested platform (LinkedIn, X/Twitter, Instagram, YouTube). Include high-retention hooks, concise formatting with strategic line breaks, relevant emoji accents, and targeted trending hashtags.`,

  'translator': `You are MagicAI's expert polyglot linguist and localized cultural translator.
Translate the text faithfully while preserving colloquialisms, emotional tone, cultural context, and professional appropriateness. If helpful, provide brief notes on nuances or alternate word choices.`,

  'brainstorm': `You are MagicAI's innovation and creative ideation partner.
Generate bold, fresh, practical ideas organized into categories with feasibility ratings, unique selling propositions (USPs), potential challenges, and recommended first steps.`,

  'prompt-enhancer': `You are MagicAI's prompt engineering specialist.
Analyze the user's raw prompt and transform it into an elite, multi-dimensional prompt using the standard CO-STAR framework (Context, Objective, Style, Tone, Audience, Response format). Include variables and test examples.`
};

export async function handleApiRoute(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
): Promise<boolean> {
  const url = req.url || '';

  // Only handle /api/ routes
  if (!url.startsWith('/api/')) {
    return false;
  }

  // Health check endpoint
  if (url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    }));
    return true;
  }

  // Generate endpoint
  if (url === '/api/generate' && req.method === 'POST') {
    try {
      // 1. Verify Authorization Header
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Unauthorized: You must be logged in to use MagicAI tools. Please sign in.' 
        }));
        return true;
      }

      const token = authHeader.substring(7).trim();
      if (!token || token === 'undefined' || token === 'null') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid session token. Please sign in again.' 
        }));
        return true;
      }

      // 2. Read and parse body
      const body = await parseRequestBody(req);
      const { tool = 'article-writer', prompt, options = {} } = body;

      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Prompt is required.' }));
        return true;
      }

      // 3. Check Gemini API key
      const ai = getGeminiClient();
      if (!ai) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Gemini API key is not configured on the server. Please ensure GEMINI_API_KEY is defined in environment variables.' 
        }));
        return true;
      }

      // 4. Construct tool-specific instruction and prompt
      const systemInstruction = TOOL_SYSTEM_PROMPTS[tool] || TOOL_SYSTEM_PROMPTS['article-writer'];
      
      let contextualPrompt = `User Request for [${tool}]:\n${prompt}\n`;
      if (options.tone) contextualPrompt += `\nDesired Tone: ${options.tone}`;
      if (options.length) contextualPrompt += `\nTarget Length: ${options.length}`;
      if (options.targetLanguage) contextualPrompt += `\nTarget Language: ${options.targetLanguage}`;
      if (options.format) contextualPrompt += `\nOutput Format: ${options.format}`;
      if (options.platform) contextualPrompt += `\nPlatform: ${options.platform}`;
      if (options.mode) contextualPrompt += `\nOperational Mode: ${options.mode}`;

      // 5. Call Gemini 2.5 Flash
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contextualPrompt,
        config: {
          systemInstruction,
          temperature: options.creativity ? Number(options.creativity) : 0.7,
        }
      });

      const generatedText = response.text || 'No text output received from AI model.';

      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({
        result: generatedText,
        tool,
        timestamp: new Date().toISOString()
      }));
      return true;

    } catch (err: any) {
      console.error('API /api/generate Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: err?.message || 'An error occurred during AI content generation.' 
      }));
      return true;
    }
  }

  // Not found for other /api/* routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
  return true;
}

function parseRequestBody(req: IncomingMessage & { body?: any }): Promise<any> {
  return new Promise((resolve, reject) => {
    if (req.body) {
      return resolve(req.body);
    }
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      // Safeguard against oversized payloads (limit 1MB)
      if (data.length > 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', err => reject(err));
  });
}
