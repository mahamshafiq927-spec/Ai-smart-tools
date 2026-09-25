import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Bookmark, 
  RefreshCw, 
  Lock, 
  ArrowRight, 
  Clock, 
  FileText,
  AlertCircle,
  PenTool,
  Mail,
  Code,
  Share2,
  Globe,
  Lightbulb
} from 'lucide-react';
import type { ToolDefinition, User, SavedCreation } from '../types/index.ts';
import { generateAiContent } from '../lib/geminiApi.ts';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  user: User | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onSaveCreation: (creation: Omit<SavedCreation, 'id' | 'createdAt'>) => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  user,
  onOpenAuth,
  onSaveCreation,
}) => {
  // Initialize option values from tool defaults
  const [options, setOptions] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.options.forEach(opt => {
      initial[opt.id] = opt.defaultValue;
    });
    return initial;
  });

  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Reset states when switching tools
  React.useEffect(() => {
    const nextOptions: Record<string, any> = {};
    tool.options.forEach(opt => {
      nextOptions[opt.id] = opt.defaultValue;
    });
    setOptions(nextOptions);
    setPrompt('');
    setOutput('');
    setError(null);
    setSaved(false);
  }, [tool.id]);

  const handleOptionChange = (optionId: string, value: any) => {
    setOptions(prev => ({ ...prev, [optionId]: value }));
  };

  const handleGenerate = async () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }

    if (!prompt.trim()) {
      setError('Please provide a prompt or topic to generate content.');
      return;
    }

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const result = await generateAiContent({
        tool: tool.id,
        prompt: prompt.trim(),
        options: options,
      });

      setOutput(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magicai-${tool.id}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!output || !user || saved) return;
    const wordCount = output.trim().split(/\s+/).length;
    onSaveCreation({
      userId: user.id,
      toolId: tool.id,
      toolName: tool.name,
      prompt: prompt,
      result: output,
      wordCount,
    });
    setSaved(true);
  };

  // Word count & read time calculations
  const wordCount = output ? output.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6">
      
      {/* Tool Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {tool.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tool.badge}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                Gemini 2.5 Flash
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {tool.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {tool.description}
            </p>
          </div>

          {/* Quick Security Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero-Exposure Backend Proxy</span>
          </div>
        </div>

        {/* Options Row */}
        {tool.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80">
            {tool.options.map(opt => (
              <div key={opt.id}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {opt.label}
                </label>
                {opt.type === 'select' && (
                  <select
                    value={options[opt.id] || opt.defaultValue}
                    onChange={e => handleOptionChange(opt.id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {opt.options?.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Preset Prompt Chips */}
        {tool.presetPrompts.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Try Example:
            </span>
            {tool.presetPrompts.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(preset.prompt)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {preset.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        
        {/* Left Column: Prompt Input */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Input & Instructions
              </label>
              <span className="text-xs text-slate-500">
                {prompt.length} characters
              </span>
            </div>

            <textarea
              rows={11}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={tool.placeholder}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans leading-relaxed resize-none"
            />
          </div>

          {error && (
            <div className="my-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Clear input
            </button>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Output</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output Viewer */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between relative min-h-[380px]">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Generated Output
                </label>
                {output && (
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {wordCount} words • ~{readTimeMinutes} min read
                  </span>
                )}
              </div>

              {output && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Download as Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`p-1.5 rounded-lg transition-colors ${
                      saved 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={saved ? 'Saved to library' : 'Save to library'}
                  >
                    {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Content Display */}
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  MagicAI is writing your content...
                </div>
                <div className="text-xs text-slate-500">
                  Processing via Gemini 2.5 Flash server-side engine
                </div>
              </div>
            ) : output ? (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap max-h-[460px] overflow-y-auto selection:bg-indigo-600 selection:text-white">
                {output}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center px-6">
                <FileText className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium text-slate-400">Output will appear here</p>
                <p className="text-xs mt-1 text-slate-500">Configure your parameters, enter your prompt, and click Generate.</p>
              </div>
            )}
          </div>

          {/* Bottom Bar Info */}
          {output && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Ready to copy, save, or export</span>
              <button
                onClick={handleGenerate}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>
          )}

        </div>

        {/* Auth Gate Protection Overlay (if unauthenticated) */}
        {!user && (
          <div className="absolute inset-0 z-30 rounded-3xl bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border border-indigo-500/20 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4 animate-bounce">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
              Sign In to Access {tool.name}
            </h3>

            <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              All 8 MagicAI smart productivity tools require a free account. Continue with Google or Email to unlock immediate access.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              100% Free • No Credit Card Required • Instant Activation
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
