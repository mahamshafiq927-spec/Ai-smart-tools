import type { ToolDefinition } from '../types/index.ts';

export const TOOLS_DATA: ToolDefinition[] = [
  {
    id: 'article-writer',
    name: 'Smart Article & Blog Writer',
    badge: 'Popular',
    description: 'Generate comprehensive, SEO-optimized articles, blog posts, and thought leadership essays in seconds.',
    category: 'Writing',
    icon: 'PenTool',
    placeholder: 'Enter your article topic, target keywords, or core thesis (e.g., "The future of autonomous AI agents in healthcare in 2026")...',
    systemSummary: 'Creates structured, publication-ready markdown articles with hooks, subheadings, and actionable conclusions.',
    options: [
      {
        id: 'format',
        label: 'Article Format',
        type: 'select',
        defaultValue: 'Full Blog Post with Subheadings',
        options: [
          { value: 'Full Blog Post with Subheadings', label: 'Full Blog Post (H2/H3s)' },
          { value: 'SEO Listicle (Top 7-10 Points)', label: 'SEO Listicle' },
          { value: 'Executive Thought Leadership Piece', label: 'Executive Thought Leadership' },
          { value: 'Step-by-Step How-To Guide', label: 'How-To Guide' },
        ]
      },
      {
        id: 'tone',
        label: 'Writing Tone',
        type: 'select',
        defaultValue: 'Engaging & Conversational',
        options: [
          { value: 'Engaging & Conversational', label: 'Engaging & Conversational' },
          { value: 'Professional & Authoritative', label: 'Professional & Authoritative' },
          { value: 'Bold & Persuasive', label: 'Bold & Persuasive' },
          { value: 'Educational & Academic', label: 'Educational & Academic' },
        ]
      },
      {
        id: 'length',
        label: 'Approximate Length',
        type: 'select',
        defaultValue: 'Standard (~800 words)',
        options: [
          { value: 'Concise (~400 words)', label: 'Concise (~400 words)' },
          { value: 'Standard (~800 words)', label: 'Standard (~800 words)' },
          { value: 'In-Depth Comprehensive (~1500 words)', label: 'Deep Dive (~1500 words)' },
        ]
      }
    ],
    presetPrompts: [
      {
        title: 'AI in 2026',
        prompt: 'How AI agents and autonomous reasoning are reshaping everyday software engineering workflows in 2026.'
      },
      {
        title: 'Remote Work Productivity',
        prompt: '10 practical habits for maintaining deep focus and high velocity while working asynchronously across global timezones.'
      },
      {
        title: 'Clean Code Principles',
        prompt: 'Why readable, maintainable TypeScript architectures always beat clever code over a 5-year product lifecycle.'
      }
    ]
  },
  {
    id: 'email-writer',
    name: 'Professional Email Composer',
    badge: 'High Converting',
    description: 'Draft polite, persuasive, and crisp emails for sales, partnerships, follow-ups, or internal leadership.',
    category: 'Business',
    icon: 'Mail',
    placeholder: 'Describe the situation and goal (e.g., "Follow up with client Sarah after a demo call yesterday, answering her pricing questions and scheduling a pilot kickoff")...',
    systemSummary: 'Outputs high-impact emails with compelling subject lines, clean body copy, and unambiguous next steps.',
    options: [
      {
        id: 'format',
        label: 'Email Purpose',
        type: 'select',
        defaultValue: 'Client Follow-Up & Next Steps',
        options: [
          { value: 'Client Follow-Up & Next Steps', label: 'Client Follow-Up' },
          { value: 'Cold Sales Outreach & Pitch', label: 'Cold Sales Outreach' },
          { value: 'Executive Meeting Request', label: 'Meeting Request' },
          { value: 'Polite Negotiation or Declining', label: 'Polite Negotiation / Decline' },
          { value: 'Team Announcement or Update', label: 'Team Announcement' },
        ]
      },
      {
        id: 'tone',
        label: 'Tone',
        type: 'select',
        defaultValue: 'Polite, Crisp & Professional',
        options: [
          { value: 'Polite, Crisp & Professional', label: 'Polite & Professional' },
          { value: 'Warm, Friendly & Collaborative', label: 'Warm & Friendly' },
          { value: 'Persuasive & Value-Driven', label: 'Persuasive & Direct' },
          { value: 'Formal & Executive', label: 'Formal Executive' },
        ]
      }
    ],
    presetPrompts: [
      {
        title: 'Post-Demo Follow Up',
        prompt: 'Send a follow-up email after presenting our enterprise SaaS solution to the VP of Engineering, attaching our security whitepaper and offering a 14-day sandbox.'
      },
      {
        title: 'Gentle Payment Reminder',
        prompt: 'Send a polite, professional reminder to a consulting client regarding an overdue invoice (#INV-2041) due 10 days ago.'
      },
      {
        title: 'Partnership Inquiry',
        prompt: 'Reach out to a tech podcast host proposing a sponsored segment or guest appearance regarding practical AI tooling.'
      }
    ]
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer & Bug Fixer',
    badge: 'Dev Favorite',
    description: 'Debug errors, optimize slow code, understand complex algorithms, or convert between languages.',
    category: 'Coding',
    icon: 'Code',
    placeholder: 'Paste your code snippet or error message here (e.g. JavaScript, Python, Rust, SQL, TypeScript)...',
    systemSummary: 'Analyzes logic line-by-line, pinpoints edge cases, provides fixed code snippets with Markdown syntax highlighting.',
    options: [
      {
        id: 'mode',
        label: 'Analysis Mode',
        type: 'select',
        defaultValue: 'Find & Fix Bugs with Explanation',
        options: [
          { value: 'Find & Fix Bugs with Explanation', label: 'Find & Fix Bugs' },
          { value: 'Explain Logic Step-by-Step', label: 'Explain Logic Step-by-Step' },
          { value: 'Optimize Performance & Refactor', label: 'Optimize & Clean Code' },
          { value: 'Add TypeScript Types & JSDoc', label: 'Add Types & Documentation' },
        ]
      },
      {
        id: 'tone',
        label: 'Detail Level',
        type: 'select',
        defaultValue: 'Senior Engineer Mentorship',
        options: [
          { value: 'Senior Engineer Mentorship', label: 'Senior Engineer Insight' },
          { value: 'Quick Solution with Minimal Text', label: 'Quick Solution Only' },
          { value: 'Beginner-Friendly with Plain English', label: 'Beginner-Friendly' },
        ]
      }
    ],
    presetPrompts: [
      {
        title: 'Async Race Condition',
        prompt: `async function fetchUsers() {
  const users = await api.getUsers();
  users.forEach(async (u) => {
    const details = await api.getDetails(u.id);
    u.profile = details;
  });
  return users; // Why does this return before profiles are populated?
}`
      },
      {
        title: 'SQL Performance',
        prompt: `SELECT * FROM orders 
JOIN customers ON orders.customer_id = customers.id 
WHERE customers.country = 'US' AND orders.created_at >= '2026-01-01'
ORDER BY orders.amount DESC;
-- How can I optimize this query and what indexes are needed?`
      }
    ]
  },
  {
    id: 'summarizer',
    name: 'AI Text & Document Summarizer',
    badge: 'Time Saver',
    description: 'Condense articles, whitepapers, transcripts, or long contracts into crystal clear executive briefs.',
    category: 'Writing',
    icon: 'FileText',
    placeholder: 'Paste raw text, meeting notes, interview transcript, or long research notes to summarize...',
    systemSummary: 'Distills complex documents into TL;DR, high-priority bullet points, and key action items.',
    options: [
      {
        id: 'format',
        label: 'Summary Style',
        type: 'select',
        defaultValue: 'Executive TL;DR with Bullet Points',
        options: [
          { value: 'Executive TL;DR with Bullet Points', label: 'TL;DR + Bullets' },
          { value: 'Actionable Checklist & Decisions', label: 'Actionable Checklist' },
          { value: 'Single Impactful Paragraph', label: 'Single Paragraph' },
          { value: 'Explain Like I Am 5 (ELI5)', label: 'Simple & Plain (ELI5)' },
        ]
      }
    ],
    presetPrompts: [
      {
        title: 'Meeting Notes',
        prompt: 'John discussed Q3 budget reallocation. Sarah agreed to finalize the design mockups by Friday. The database migration will be scheduled for Sunday 2 AM UTC to avoid peak traffic. Need approvals from DevOps and Security leads.'
      },
      {
        title: 'Complex Policy',
        prompt: 'Terms of Service clause explaining data collection: We collect user telemetry, browser headers, and session activity to prevent distributed denial of service and fraudulent sign-ups. IP addresses are hashed after 30 days.'
      }
    ]
  },
  {
    id: 'social-media',
    name: 'Viral Social Media Creator',
    badge: 'Growth Engine',
    description: 'Craft viral hooks, engaging LinkedIn stories, punchy X/Twitter threads, and high-retention captions.',
    category: 'Marketing',
    icon: 'Share2',
    placeholder: 'What is your core message or story? (e.g. "Just launched our first SaaS tool after 6 months of solo building, here is the biggest lesson I learned")...',
    systemSummary: 'Generates high-engagement social media posts with strong hooks, line breaks, and hashtags.',
    options: [
      {
        id: 'platform',
        label: 'Platform',
        type: 'select',
        defaultValue: 'LinkedIn (Thought Leadership)',
        options: [
          { value: 'LinkedIn (Thought Leadership)', label: 'LinkedIn Post' },
          { value: 'X / Twitter (Viral Hook & Thread)', label: 'X / Twitter Thread' },
          { value: 'Instagram (Hook + Story + Hashtags)', label: 'Instagram Caption' },
          { value: 'YouTube (Catchy Title & Description)', label: 'YouTube Metadata' },
        ]
      },
      {
        id: 'tone',
        label: 'Hook Style',
        type: 'select',
        defaultValue: 'Curiosity & Storytelling',
        options: [
          { value: 'Curiosity & Storytelling', label: 'Storytelling & Curiosity' },
          { value: 'Bold Contrarian Take', label: 'Bold Contrarian' },
          { value: 'Data & Tactical Breakdown', label: 'Data & Tactical' },
          { value: 'Inspirational & Motivating', label: 'Inspirational' },
        ]
      }
    ],
    presetPrompts: [
      {
        title: 'SaaS Launch Lesson',
        prompt: 'Share 3 counter-intuitive mistakes first-time founders make when shipping AI products in 2026.'
      },
      {
        title: 'Career Milestone',
        prompt: 'Announce transitioning from a traditional 9-to-5 corporate job into building full-stack applications with AI.'
      }
    ]
  },
  {
    id: 'translator',
    name: 'Multilingual Cultural Translator',
    badge: '50+ Languages',
    description: 'Translate across global languages with natural idiomatic phrasing, tone matching, and cultural nuance.',
    category: 'Writing',
    icon: 'Globe',
    placeholder: 'Enter text to translate...',
    systemSummary: 'Delivers fluent translations avoiding robotic literal syntax.',
    options: [
      {
        id: 'targetLanguage',
        label: 'Target Language',
        type: 'select',
        defaultValue: 'Spanish',
        options: [
          { value: 'Spanish', label: 'Spanish (Español)' },
          { value: 'French', label: 'French (Français)' },
          { value: 'German', label: 'German (Deutsch)' },
          { value: 'Japanese', label: 'Japanese (日本語)' },
          { value: 'Chinese (Simplified)', label: 'Chinese (简体中文)' },
          { value: 'Arabic', label: 'Arabic (العربية)' },
          { value: 'Hindi', label: 'Hindi (हिन्दी)' },
          { value: 'Portuguese', label: 'Portuguese (Português)' },
          { value: 'Italian', label: 'Italian (Italiano)' },
          { value: 'Korean', label: 'Korean (한국어)' },
        ]
      },
      {
        id: 'tone',
        label: 'Register & Tone',
        type: 'select',
        defaultValue: 'Natural Native Speaker',
        options: [
          { value: 'Natural Native Speaker', label: 'Natural Native' },
          { value: 'Formal Corporate Business', label: 'Formal Business' },
          { value: 'Casual & Youthful', label: 'Casual / Friendly' },
        ]
      }
    ],
    presetPrompts: [
      {
        title: 'Welcome Email',
        prompt: 'Welcome to our platform! We are thrilled to partner with you. Let us know if you have any questions or need custom onboarding.'
      },
      {
        title: 'Customer Support',
        prompt: 'We sincerely apologize for the delay. Our technical engineering team has resolved the issue and your subscription has been credited for the inconvenience.'
      }
    ]
  },
  {
    id: 'brainstorm',
    name: 'Idea & Innovation Incubator',
    badge: 'Creative Engine',
    description: 'Brainstorm startup concepts, novel product features, YouTube videos, or marketing campaign ideas.',
    category: 'Creativity',
    icon: 'Lightbulb',
    placeholder: 'What are you trying to brainstorm? (e.g. "Unique micro-SaaS ideas for freelance graphic designers who use iPad")...',
    systemSummary: 'Explores uncrowded angles, provides feasibility analysis and first prototype steps.',
    options: [
      {
        id: 'format',
        label: 'Output Structure',
        type: 'select',
        defaultValue: 'Ranked List with Feasibility & USP',
        options: [
          { value: 'Ranked List with Feasibility & USP', label: 'Ranked with USP & Effort' },
          { value: 'Crazy / 10x Moonshot Ideas', label: '10x Moonshot Angles' },
          { value: 'Fast 48-Hour Weekend Projects', label: '48-Hour Weekend Projects' },
        ]
      }
    ],
    presetPrompts: [
      {
        title: 'AI Tool Ideas',
        prompt: '5 high-demand workflow automation tools for small real estate agencies.'
      },
      {
        title: 'YouTube Channel Concepts',
        prompt: 'High-retention tech explainer video concepts that appeal to both beginners and experienced developers.'
      }
    ]
  },
  {
    id: 'prompt-enhancer',
    name: 'Master Prompt Enhancer',
    badge: 'Supercharge AI',
    description: 'Transform basic prompts into world-class, multi-step prompt engineering blueprints.',
    category: 'Writing',
    icon: 'Sparkles',
    placeholder: 'Paste your raw prompt (e.g., "Write me a sales page for a fitness app")...',
    systemSummary: 'Transforms inputs using the professional CO-STAR framework (Context, Objective, Style, Tone, Audience, Response).',
    options: [
      {
        id: 'format',
        label: 'Framework',
        type: 'select',
        defaultValue: 'CO-STAR Framework (Enterprise Grade)',
        options: [
          { value: 'CO-STAR Framework (Enterprise Grade)', label: 'CO-STAR Framework' },
          { value: 'Role + Task + Few-Shot Examples', label: 'Role + Few-Shot Examples' },
          { value: 'Chain-of-Thought Reasoning Blueprint', label: 'Chain-of-Thought (Step-by-Step)' },
        ]
      }
    ],
    presetPrompts: [
      {
        title: 'Basic Blog Prompt',
        prompt: 'Write a blog post about why sleep is important for software developers.'
      },
      {
        title: 'Marketing Pitch',
        prompt: 'Help me write an ad for a new noise-cancelling headset.'
      }
    ]
  }
];
