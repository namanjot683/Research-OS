import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  FileCode, 
  CheckSquare, 
  Square,
  Layers
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProject } from '../context/ProjectContext';
import { aiAPI } from '../services/api';

export default function LitReview() {
  const { activeProject, papers } = useProject();
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('review'); // review | bibtex

  useEffect(() => {
    if (papers.length > 0) {
      setSelectedPaperIds(papers.map(p => p.id));
    }
  }, [papers]);

  const toggleSelectPaper = (id) => {
    if (selectedPaperIds.includes(id)) {
      setSelectedPaperIds(selectedPaperIds.filter(pId => pId !== id));
    } else {
      setSelectedPaperIds([...selectedPaperIds, id]);
    }
  };

  const generateReview = async () => {
    if (!activeProject || selectedPaperIds.length === 0) return;
    try {
      setLoading(true);
      const res = await aiAPI.litReview({
        projectId: activeProject.id,
        selectedPaperIds
      });
      setReviewData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReview();
  }, [activeProject]);

  const handleCopyMarkdown = () => {
    if (!reviewData) return;
    const fullText = `# ${reviewData.title}\n\n## Abstract\n${reviewData.abstract}\n\n` +
      reviewData.sections.map(s => `## ${s.heading}\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!reviewData) return;
    const fullText = `# ${reviewData.title}\n\n## Abstract\n${reviewData.abstract}\n\n` +
      reviewData.sections.map(s => `## ${s.heading}\n${s.content}`).join('\n\n') +
      `\n\n## References (BibTeX)\n\`\`\`bibtex\n${reviewData.bibtex}\n\`\`\``;
    
    const blob = new Blob([fullText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Literature_Review_${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-accent-violet">
            <BookOpen className="w-4 h-4" />
            <span>AI Automated Synthesis Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Literature Review Generator</h1>
          <p className="text-xs text-slate-400">
            Automatically synthesize themes, methodologies, and critical gaps across selected research papers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={generateReview}
            disabled={loading || selectedPaperIds.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-semibold rounded-xl shadow-glow-sm flex items-center space-x-2 transition disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Review</span>
          </button>
          {reviewData && (
            <>
              <button
                onClick={handleCopyMarkdown}
                className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-brand-400" />
                <span>Export .MD</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Paper Selector Sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Included Papers</span>
              <span className="text-brand-400 font-mono">{selectedPaperIds.length} / {papers.length}</span>
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {papers.map(p => {
                const isSelected = selectedPaperIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleSelectPaper(p.id)}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-start space-x-2 text-xs transition ${
                      isSelected
                        ? 'bg-brand-600/10 border-brand-500/30 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className="line-clamp-2 font-medium">{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generated Review Document */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
              <Sparkles className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-200">
                Synthesizing Literature Review across {selectedPaperIds.length} Papers...
              </p>
              <p className="text-xs text-slate-500">Evaluating methodologies, findings, critical gaps, and bibtex references</p>
            </div>
          ) : reviewData ? (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              {/* Tab Selector */}
              <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
                <button
                  onClick={() => setActiveTab('review')}
                  className={`text-xs font-bold pb-1 transition ${
                    activeTab === 'review' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Full Synthesized Review
                </button>
                <button
                  onClick={() => setActiveTab('bibtex')}
                  className={`text-xs font-bold pb-1 transition ${
                    activeTab === 'bibtex' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  BibTeX References
                </button>
              </div>

              {activeTab === 'review' ? (
                <div className="prose prose-invert prose-slate max-w-none space-y-6">
                  <h1 className="text-2xl font-bold text-slate-100">{reviewData.title}</h1>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">Executive Abstract</h4>
                    <p className="text-xs text-slate-300 italic">{reviewData.abstract}</p>
                  </div>
                  {reviewData.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <h2 className="text-base font-bold text-slate-200">{sec.heading}</h2>
                      <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-200">BibTeX Citations</h3>
                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                    {reviewData.bibtex}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p>Click "Regenerate Review" to compile your literature review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
