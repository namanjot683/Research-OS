import React, { useState, useEffect } from 'react';
import { Quote, Copy, Check, Download } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { aiAPI } from '../services/api';

export default function Citations() {
  const { activeProject } = useProject();
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('apa'); // apa | ieee | mla | chicago | bibtex
  const [copiedId, setCopiedId] = useState(null);

  const fetchCitations = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const res = await aiAPI.citations({ projectId: activeProject.id });
      setCitations(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitations();
  }, [activeProject]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    const text = citations.map(c => c[selectedFormat]).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `References_${selectedFormat.toUpperCase()}_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400">
            <Quote className="w-4 h-4" />
            <span>Academic References Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Automatic Citation Generator</h1>
          <p className="text-xs text-slate-400">
            Instantly format citations in APA 7th, IEEE, MLA 9th, Chicago, and BibTeX format for your bibliography.
          </p>
        </div>

        <button
          onClick={handleExportAll}
          disabled={citations.length === 0}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-sm flex items-center space-x-2 transition disabled:opacity-40"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Citations</span>
        </button>
      </div>

      {/* Format Selector Pills */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
        {[
          { key: 'apa', label: 'APA 7th Edition' },
          { key: 'ieee', label: 'IEEE Style' },
          { key: 'mla', label: 'MLA 9th Edition' },
          { key: 'chicago', label: 'Chicago 17th' },
          { key: 'bibtex', label: 'BibTeX' }
        ].map(fmt => (
          <button
            key={fmt.key}
            onClick={() => setSelectedFormat(fmt.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              selectedFormat === fmt.key
                ? 'bg-brand-600 text-white shadow-glow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      {/* Citations List */}
      <div className="space-y-4">
        {citations.map((c, idx) => (
          <div
            key={c.paperId || idx}
            className="glass-card p-5 rounded-2xl border border-slate-800 flex items-start justify-between space-x-4"
          >
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-wider">
                Ref #{idx + 1} • {c.title}
              </span>
              <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                {c[selectedFormat]}
              </p>
            </div>

            <button
              onClick={() => handleCopy(c.paperId, c[selectedFormat])}
              className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition shrink-0 mt-6"
            >
              {copiedId === c.paperId ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedId === c.paperId ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
