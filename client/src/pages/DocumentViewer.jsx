import React, { useState } from 'react';
import { 
  FileText, 
  Bookmark, 
  Highlighter, 
  Search, 
  CheckCircle, 
  ChevronRight, 
  Share2, 
  Sparkles, 
  BookOpen,
  Plus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { bookmarkAPI } from '../services/api';

export default function DocumentViewer() {
  const { papers, activePaper, setActivePaper } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [selectedText, setSelectedText] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('reader'); // reader | summary | annotations

  if (!activePaper) {
    return (
      <div className="p-12 text-center text-slate-400">
        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
        <p>No paper selected. Please upload or choose a paper from your workspace.</p>
      </div>
    );
  }

  const handleHighlight = async (chunkText, page) => {
    try {
      const newBm = {
        paperId: activePaper.id,
        paperTitle: activePaper.title,
        text: chunkText,
        note: customNote || 'Highlight saved',
        page: page || 1,
        color: selectedColor
      };
      const res = await bookmarkAPI.create(newBm);
      setBookmarks(prev => [...prev, res.data]);
      setCustomNote('');
      alert(`Highlight added in ${selectedColor.toUpperCase()} color!`);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredChunks = (activePaper.chunks || []).filter(c => 
    !searchTerm || c.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-950">
      {/* Paper List Selector Sidebar */}
      <div className="w-72 border-r border-slate-800 bg-slate-950 p-4 space-y-3 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Workspace Documents ({papers.length})
        </div>
        {papers.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePaper(p)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${
              activePaper.id === p.id
                ? 'bg-brand-600/10 border-brand-500/40 text-slate-100 shadow-glow-sm'
                : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-brand-400 font-semibold">{p.year}</span>
              <span className="text-[10px] text-slate-500">{p.pageCount || 10} pgs</span>
            </div>
            <h4 className="text-xs font-bold mt-1 line-clamp-1">{p.title}</h4>
            <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">{p.authors}</p>
          </button>
        ))}
      </div>

      {/* Main Document Content Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Document Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-0.5 max-w-xl">
            <h2 className="text-base font-bold text-slate-100 truncate">{activePaper.title}</h2>
            <p className="text-xs text-slate-400 truncate">{activePaper.authors} • {activePaper.venue}</p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                activeTab === 'reader' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Document Reader
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                activeTab === 'summary' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Executive Summary
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'reader' ? (
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6 w-full">
            {/* Search Bar & Color Highlight Picker */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search keywords inside paper..."
                  className="bg-transparent text-xs text-slate-200 focus:outline-none w-full"
                />
              </div>

              {/* Color Selector */}
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Highlighter className="w-4 h-4 text-slate-400" />
                <span>Marker:</span>
                {['yellow', 'green', 'purple'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-5 h-5 rounded-full border-2 transition ${
                      color === 'yellow' ? 'bg-amber-400 border-amber-300' :
                      color === 'green' ? 'bg-emerald-400 border-emerald-300' : 'bg-purple-400 border-purple-300'
                    } ${selectedColor === color ? 'scale-125 ring-2 ring-white' : 'opacity-70'}`}
                  />
                ))}
              </div>
            </div>

            {/* Abstract Card */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-500/20 bg-brand-950/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">Abstract</h3>
              <p className="text-sm text-slate-200 leading-relaxed italic">{activePaper.abstract}</p>
            </div>

            {/* Text Chunks */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Document Segments ({filteredChunks.length})
              </h3>
              {filteredChunks.map((chunk, idx) => (
                <div
                  key={chunk.id || idx}
                  className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition relative group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                    <span>Page {chunk.page || 1} • Segment #{idx + 1}</span>
                    <button
                      onClick={() => handleHighlight(chunk.text, chunk.page)}
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Bookmark Highlight</span>
                    </button>
                  </div>
                  <p className={`text-sm text-slate-200 leading-relaxed font-sans ${
                    selectedColor === 'yellow' ? 'hover:bg-amber-500/10' :
                    selectedColor === 'green' ? 'hover:bg-emerald-500/10' : 'hover:bg-purple-500/10'
                  } transition p-2 rounded-lg cursor-pointer`}>
                    {chunk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Executive Summary View */
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6 w-full">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-violet/10 text-accent-violet flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">AI Synthesized Paper Summary</h3>
                  <p className="text-xs text-slate-400">Multi-perspective breakdown of paper contributions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">Executive Summary</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activePaper.summary?.executive || activePaper.abstract}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-accent-violet uppercase tracking-wider mb-1">Core Methodology</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activePaper.summary?.methodology || 'Novel attention and deep representation learning architecture.'}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Key Empirical Findings</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activePaper.summary?.findings || 'Outperformed state-of-the-art baselines on benchmark datasets.'}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Reported Limitations</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activePaper.summary?.limitations || 'Quadratic sequence complexity and hardware memory bounds.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
