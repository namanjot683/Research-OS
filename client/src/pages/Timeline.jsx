import React, { useState, useEffect } from 'react';
import { History, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { aiAPI } from '../services/api';

export default function Timeline() {
  const { activeProject } = useProject();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!activeProject) return;
      try {
        setLoading(true);
        const res = await aiAPI.timeline({ projectId: activeProject.id });
        setTimeline(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [activeProject]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-1">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-accent-violet">
          <History className="w-4 h-4" />
          <span>Chronological Scientific Evolution</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Research Breakthrough Timeline</h1>
        <p className="text-xs text-slate-400">
          Visual evolution of research paradigms and landmark breakthroughs in your workspace.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 space-y-8 py-4">
        {timeline.map((item, idx) => (
          <div key={item.id || idx} className="relative pl-8 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-brand-500 text-brand-400 flex items-center justify-center font-bold text-xs shadow-glow-sm group-hover:scale-110 transition">
              {item.year.toString().slice(-2)}
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-brand-500/30 transition space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-brand-400 font-mono px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                  {item.year}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  {item.category || 'Architecture Breakthrough'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-400 italic font-mono">{item.authors}</p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-200 mb-1">Impact & Milestone:</p>
                {item.milestone}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
