import React, { useState } from 'react';
import { Upload, X, FileText, Sparkles, CheckCircle2, Files, Layers, Trash2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function UploadModal() {
  const { isUploadOpen, setIsUploadOpen, uploadPaper, uploadBatchPapers, papers } = useProject();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  if (!isUploadOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      if (filesArray.length === 1 && !title) {
        setTitle(filesArray[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pdf') || f.type === 'application/pdf');
      if (droppedFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...droppedFiles]);
        if (droppedFiles.length === 1 && !title) {
          setTitle(droppedFiles[0].name.replace(/\.[^/.]+$/, ""));
        }
      }
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setTitle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0 && !title) {
      setError('Please select at least one PDF research paper to upload.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (selectedFiles.length > 1) {
        await uploadBatchPapers(selectedFiles, authors, year);
      } else if (selectedFiles.length === 1) {
        await uploadPaper(selectedFiles[0], title || selectedFiles[0].name.replace(/\.[^/.]+$/, ""), authors, year);
      } else {
        await uploadPaper(null, title, authors, year);
      }

      setIsUploadOpen(false);
      setSelectedFiles([]);
      setTitle('');
      setAuthors('');
    } catch (err) {
      setError(err.message || 'Failed to process batch upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={() => setIsUploadOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-100">Upload Research Papers</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Unlimited Batch Scale
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Workspace: <span className="font-semibold text-brand-400">{papers.length} Papers Indexed</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              dragActive ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload-input"
            />
            <label htmlFor="pdf-upload-input" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-brand-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200">
                Drag & Drop <span className="text-brand-400 font-bold">10+ PDF Papers at once</span> or <span className="text-brand-400 hover:underline">browse files</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Select multiple PDFs for instant batch vector indexing (No limit)</p>
            </label>
          </div>

          {/* Selected Files Queue */}
          {selectedFiles.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center space-x-1.5 text-brand-400">
                  <Files className="w-4 h-4" />
                  <span>Selected PDF Queue ({selectedFiles.length} Papers)</span>
                </span>
                <button
                  type="button"
                  onClick={clearAllFiles}
                  className="text-[11px] text-rose-400 hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Selection</span>
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span className="truncate text-slate-200 font-medium">{file.name}</span>
                      <span className="text-[10px] text-slate-500">({(file.size / (1024 * 1024)).toFixed(1)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-slate-500 hover:text-rose-400 transition ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {selectedFiles.length <= 1 && (
            <div>
              <label className="text-xs font-semibold text-slate-300">Paper Title {selectedFiles.length === 1 ? '*' : '(Optional)'}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Attention Is All You Need"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Default Authors</label>
              <input
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Research Authors"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Publication Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              <span>Auto-extracts vector chunks for RAG</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (selectedFiles.length === 0 && !title)}
                className="flex items-center space-x-2 px-5 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-glow-sm transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading & Indexing {selectedFiles.length > 0 ? selectedFiles.length : 1} Papers...</span>
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Upload & Process {selectedFiles.length > 1 ? `${selectedFiles.length} Papers` : 'Paper'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
