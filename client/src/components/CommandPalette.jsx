import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, MessageSquare, BookOpen, TableProperties, Quote, History, GraduationCap, X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useProject();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { label: 'Ask AI RAG Chat about Methodology', path: '/chat', icon: MessageSquare, description: 'Query papers contextually' },
    { label: 'Generate Full Literature Review', path: '/lit-review', icon: BookOpen, description: 'Synthesize across all papers' },
    { label: 'Compare Papers Side-by-Side', path: '/matrix', icon: TableProperties, description: 'View comparative matrix' },
    { label: 'Detect Unaddressed Research Gaps', path: '/gap-detector', icon: Sparkles, description: 'Find novel thesis directions' },
    { label: 'Generate APA/IEEE Citations', path: '/citations', icon: Quote, description: 'Export reference lists' },
    { label: 'Visualize Research Timeline', path: '/timeline', icon: History, description: 'Chronological breakthrough timeline' },
    { label: 'Start Study Quiz & Flashcards', path: '/quiz', icon: GraduationCap, description: 'Test paper comprehension' }
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path) => {
    setIsCommandPaletteOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-brand-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a research action or command..."
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder-slate-500"
          />
          <button onClick={() => setIsCommandPaletteOpen(false)} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No matching AI actions found</p>
          ) : (
            filtered.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(action.path)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between transition group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-brand-500/20 text-slate-400 group-hover:text-brand-400 flex items-center justify-center transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{action.label}</p>
                      <p className="text-[11px] text-slate-500">{action.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Run →</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
