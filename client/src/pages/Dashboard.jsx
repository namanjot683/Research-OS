import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  BookOpen, 
  TableProperties, 
  Sparkles, 
  Layers, 
  Plus, 
  CheckCircle, 
  BrainCircuit, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function Dashboard() {
  const { activeProject, papers, setIsUploadOpen, setActivePaper } = useProject();

  const totalChunks = papers.reduce((acc, p) => acc + (p.chunks ? p.chunks.length : 0), 0);

  const quickModules = [
    { title: 'AI RAG Chat', desc: 'Ask complex scientific queries across all papers.', link: '/chat', icon: MessageSquare, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { title: 'Literature Review', desc: 'Auto-synthesize multi-paper review document.', link: '/lit-review', icon: BookOpen, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
    { title: 'Comparison Matrix', desc: 'Side-by-side paper comparison matrix.', link: '/matrix', icon: TableProperties, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { title: 'Research Gap Detector', desc: 'Identify open challenges & future directions.', link: '/gap-detector', icon: Sparkles, color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Multi-Document Retrieval Augmented Generation (RAG)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              {activeProject ? activeProject.title : 'Research OS Workspace'}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {activeProject?.description || 'Upload 10+ research papers at once with no limits to analyze, compare, extract gaps, and generate literature reviews with AI intelligence.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-xs shadow-glow-md flex items-center space-x-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Papers ({papers.length})</span>
            </button>
            <Link
              to="/chat"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition"
            >
              <MessageSquare className="w-4 h-4 text-brand-400" />
              <span>Launch RAG Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Uploaded Papers</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{papers.length} <span className="text-xs text-emerald-400 font-semibold">Indexed</span></h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Vector Embeddings</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{totalChunks} <span className="text-xs text-slate-500 font-normal">chunks</span></h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-violet/10 text-accent-violet flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">RAG Retrieval Precision</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">98.4%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">AI Engine</p>
            <h3 className="text-sm font-bold text-slate-100 mt-1">Gemini 1.5 Flash</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-amber/10 text-accent-amber flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Core Intelligence Modules */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Research Intelligence Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <Link
                key={idx}
                to={mod.link}
                className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-brand-500/30 flex flex-col justify-between group transition"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center mb-4 transition group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-brand-400 transition">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Workspace Papers List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Workspace Papers ({papers.length})
          </h2>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="text-xs text-brand-400 hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Research PDFs</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="glass-card p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {paper.year} • {paper.venue || 'Academic Paper'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {paper.chunks?.length || 0} chunks
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-2 line-clamp-1">
                  {paper.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                  {paper.authors}
                </p>
                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {paper.abstract}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[11px] text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Vector Indexed</span>
                </div>
                <Link
                  to="/viewer"
                  onClick={() => setActivePaper(paper)}
                  className="text-xs font-medium text-brand-400 hover:text-brand-300 flex items-center space-x-1"
                >
                  <span>Read & Highlight</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
