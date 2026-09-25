import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  ExternalLink, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import type { SavedCreation } from '../types/index.ts';

interface SavedCreationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedCreation[];
  onDelete: (id: string) => void;
  onSelectCreation?: (creation: SavedCreation) => void;
}

export const SavedCreationsModal: React.FC<SavedCreationsModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onDelete,
  onSelectCreation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = savedList.filter(item => 
    item.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                My Saved Creations
              </h2>
              <p className="text-xs text-slate-400">
                {savedList.length} saved output{savedList.length === 1 ? '' : 's'} across MagicAI tools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-4 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search saved creations by prompt or keyword..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-400">No saved creations found</p>
              <p className="text-xs mt-1">Generate text with any tool and click "Save to Library" to keep it here.</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.toolName}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.result, item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-medium line-clamp-1 italic text-slate-400">
                  Prompt: "{item.prompt}"
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 text-xs text-slate-200 font-sans whitespace-pre-wrap max-h-36 overflow-y-auto border border-slate-800/60">
                  {item.result}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
