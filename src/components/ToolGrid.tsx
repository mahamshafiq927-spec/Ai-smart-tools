import React from 'react';
import { 
  Sparkles, 
  PenTool, 
  Mail, 
  Code, 
  FileText, 
  Share2, 
  Globe, 
  Lightbulb, 
  ArrowRight,
  Lock
} from 'lucide-react';
import { TOOLS_DATA } from '../lib/toolsData.ts';
import type { ToolDefinition, User } from '../types/index.ts';

interface ToolGridProps {
  onSelectTool: (tool: ToolDefinition) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  user: User | null;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  onSelectTool,
  activeCategory,
  onSelectCategory,
  user,
}) => {
  const categories = ['All', 'Writing', 'Business', 'Coding', 'Marketing', 'Creativity'];

  const filteredTools = TOOLS_DATA.filter(tool => {
    if (activeCategory === 'All') return true;
    return tool.category === activeCategory;
  });

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'PenTool': return <PenTool className="w-6 h-6 text-indigo-400" />;
      case 'Mail': return <Mail className="w-6 h-6 text-emerald-400" />;
      case 'Code': return <Code className="w-6 h-6 text-cyan-400" />;
      case 'FileText': return <FileText className="w-6 h-6 text-amber-400" />;
      case 'Share2': return <Share2 className="w-6 h-6 text-pink-400" />;
      case 'Globe': return <Globe className="w-6 h-6 text-blue-400" />;
      case 'Lightbulb': return <Lightbulb className="w-6 h-6 text-yellow-400" />;
      default: return <Sparkles className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Banner with MagicAI Branding */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Gemini 2.5 Flash • Secure Authentication</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            MagicAI Smart Tools
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Free, production-grade AI tools for content creators, software engineers, and digital entrepreneurs. Fast, private, and powered by server-side Gemini intelligence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>8 Free AI Tools</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>Google & Email OAuth</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Zero Client Secret Exposure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool)}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-850 transition-all duration-200 group flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 relative"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/30 transition-colors shadow-sm">
                  {getToolIcon(tool.icon)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {tool.badge}
                  </span>
                  {!user && (
                    <span className="p-1 rounded-md bg-slate-800 text-slate-400" title="Requires login">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight mb-1.5">
                {tool.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                {tool.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:text-indigo-300">
              <span>Launch Tool</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
