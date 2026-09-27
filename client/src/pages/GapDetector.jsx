import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Lightbulb, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { aiAPI } from '../services/api';

export default function GapDetector() {
  const { activeProject } = useProject();
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGaps = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const res = await aiAPI.gapDetector({ projectId: activeProject.id });
      setGaps(res.data.gaps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, [activeProject]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-accent-amber">
            <Sparkles className="w-4 h-4" />
            <span>AI Automated Discovery</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Intelligent Research Gap Detector</h1>
          <p className="text-xs text-slate-400">
            Uncover unaddressed scientific challenges, conflicting findings, and generated novel thesis proposals.
          </p>
        </div>

        <button
          onClick={fetchGaps}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-accent-amber to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-glow-sm flex items-center space-x-2 transition disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Scan Research Gaps</span>
        </button>
      </div>

      {/* Gaps List */}
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-accent-amber animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-200">Analyzing Cross-Paper Contradictions & Bottlenecks...</p>
        </div>
      ) : gaps.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400">
          <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-slate-600" />
          <p>No research gaps detected yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {gaps.map((gap, idx) => (
            <div
              key={gap.id || idx}
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-accent-amber/40 transition space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-accent-amber/10 text-accent-amber flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{gap.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                    Severity: {gap.severity || 'Critical'}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
                    Impact: {gap.impact || 'High'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {gap.description}
              </p>

              {/* Related Papers */}
              {gap.relatedPapers && (
                <div className="text-[11px] text-slate-400 space-x-2">
                  <span className="font-semibold text-slate-400">Identified From:</span>
                  {gap.relatedPapers.map((paperTitle, pIdx) => (
                    <span key={pIdx} className="inline-block bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                      {paperTitle}
                    </span>
                  ))}
                </div>
              )}

              {/* Thesis Proposal Suggestion Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-accent-amber/20 flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-accent-amber uppercase tracking-wider">
                    Recommended Thesis Proposal / Research Direction
                  </h4>
                  <p className="text-xs font-semibold text-slate-100 mt-1">
                    "{gap.suggestedTopic}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
