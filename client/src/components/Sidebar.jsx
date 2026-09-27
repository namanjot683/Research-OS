import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  TableProperties, 
  Sparkles, 
  Quote, 
  History, 
  GraduationCap, 
  Bookmark, 
  Settings,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function Sidebar() {
  const { papers, activeProject } = useProject();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, category: 'Core' },
    { name: 'AI RAG Chat', path: '/chat', icon: MessageSquare, category: 'Core', badge: 'RAG' },
    { name: 'Document Viewer', path: '/viewer', icon: FileText, category: 'Core' },
    { name: 'Literature Review', path: '/lit-review', icon: BookOpen, category: 'Synthesis', badge: 'Auto' },
    { name: 'Comparison Matrix', path: '/matrix', icon: TableProperties, category: 'Synthesis' },
    { name: 'Research Gap Detector', path: '/gap-detector', icon: Sparkles, category: 'Synthesis', badge: 'AI' },
    { name: 'Citation Generator', path: '/citations', icon: Quote, category: 'Tools' },
    { name: 'Research Timeline', path: '/timeline', icon: History, category: 'Tools' },
    { name: 'Quiz & Flashcards', path: '/quiz', icon: GraduationCap, category: 'Tools' },
    { name: 'Bookmarks & Highlights', path: '/bookmarks', icon: Bookmark, category: 'Tools' },
    { name: 'Settings', path: '/settings', icon: Settings, category: 'System' }
  ];

  const categories = ['Core', 'Synthesis', 'Tools', 'System'];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      {/* Active Workspace Paper Status Bar */}
      <div className="p-4 border-b border-slate-800/60 bg-slate-900/40">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Indexed Papers</span>
          <span className="font-mono px-1.5 py-0.5 rounded text-[10px] bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30">
            {papers.length} Papers
          </span>
        </div>
        {/* Active Scale Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 via-accent-cyan to-emerald-400 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(10, papers.length * 5))}%` }}
          />
        </div>
        <p className="text-[10px] text-emerald-400 mt-1.5 leading-tight flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Unlimited Multi-PDF Batch Scale</span>
        </p>
      </div>

      {/* Navigation Sections */}
      <div className="p-3 space-y-6 flex-1">
        {categories.map(cat => {
          const items = navItems.filter(i => i.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {cat}
              </div>
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-600/20 to-brand-500/10 text-brand-400 border border-brand-500/30 shadow-glow-sm font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-[11px]">ChromaDB Vector Index</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </div>
    </aside>
  );
}
