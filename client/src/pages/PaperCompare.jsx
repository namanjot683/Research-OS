import React, { useState, useEffect } from 'react';
import { TableProperties, Sparkles, Download, Check, RefreshCw } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { aiAPI } from '../services/api';

export default function PaperCompare() {
  const { activeProject, papers } = useProject();
  const [matrixData, setMatrixData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatrix = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const res = await aiAPI.compareMatrix({ projectId: activeProject.id });
      setMatrixData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, [activeProject]);

  const handleExportCSV = () => {
    if (matrixData.length === 0) return;
    const headers = ['Title', 'Year', 'Authors', 'Objective', 'Methodology', 'Key Findings', 'Limitations'];
    const rows = matrixData.map(p => [
      `"${p.title.replace(/"/g, '""')}"`,
      p.year,
      `"${p.authors.replace(/"/g, '""')}"`,
      `"${p.objective.replace(/"/g, '""')}"`,
      `"${p.methodology.replace(/"/g, '""')}"`,
      `"${p.findings.replace(/"/g, '""')}"`,
      `"${p.limitations.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Paper_Comparison_Matrix_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-accent-cyan">
            <TableProperties className="w-4 h-4" />
            <span>Comparative Research Matrix</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Research Paper Comparison Matrix</h1>
          <p className="text-xs text-slate-400">
            Compare objectives, methodologies, datasets, and limitations side-by-side across all workspace papers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchMatrix}
            disabled={loading}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Matrix</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-glow-sm flex items-center space-x-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-accent-cyan animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-200">Extracting Comparative Dimensions...</p>
        </div>
      ) : matrixData.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400">
          <TableProperties className="w-10 h-10 mx-auto mb-2 text-slate-600" />
          <p>No papers available to construct comparative matrix.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-x-auto shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <th className="p-4 min-w-[200px] border-r border-slate-800">Paper & Authors</th>
                <th className="p-4 min-w-[220px] border-r border-slate-800">Core Objective</th>
                <th className="p-4 min-w-[220px] border-r border-slate-800">Methodology</th>
                <th className="p-4 min-w-[240px] border-r border-slate-800">Key Empirical Findings</th>
                <th className="p-4 min-w-[200px]">Limitations & Constraints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {matrixData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-4 border-r border-slate-800/80 align-top">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
                      {row.year}
                    </span>
                    <h4 className="font-bold text-slate-100 mt-1.5">{row.title}</h4>
                    <p className="text-[11px] text-slate-500 italic mt-0.5">{row.authors}</p>
                  </td>
                  <td className="p-4 border-r border-slate-800/80 align-top leading-relaxed text-slate-300">
                    {row.objective}
                  </td>
                  <td className="p-4 border-r border-slate-800/80 align-top leading-relaxed font-sans text-brand-300">
                    {row.methodology}
                  </td>
                  <td className="p-4 border-r border-slate-800/80 align-top leading-relaxed text-emerald-300">
                    {row.findings}
                  </td>
                  <td className="p-4 align-top leading-relaxed text-rose-300/90">
                    {row.limitations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
