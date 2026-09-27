import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Command, 
  BrainCircuit, 
  CheckCircle2, 
  Key, 
  ChevronDown, 
  User, 
  LogOut,
  FolderKanban,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

export default function Navbar() {
  const { user, logout, updateApiKey } = useAuth();
  const { 
    projects, 
    activeProject, 
    papers, 
    selectProject, 
    setIsUploadOpen, 
    setIsCommandPaletteOpen,
    createProject 
  } = useProject();

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState(user?.apiKey || '');
  
  // New Workspace Modal States
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [showNewProjModal, setShowNewProjModal] = useState(false);
  const [projLoading, setProjLoading] = useState(false);
  const [projError, setProjError] = useState('');

  const handleSaveKey = (e) => {
    e.preventDefault();
    updateApiKey(newApiKey);
    setShowKeyModal(false);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    try {
      setProjLoading(true);
      setProjError('');
      await createProject(newProjectTitle.trim(), newProjectDesc.trim() || 'Research paper workspace');
      setNewProjectTitle('');
      setNewProjectDesc('');
      setShowNewProjModal(false);
    } catch (err) {
      setProjError(err.response?.data?.message || err.message || 'Failed to create workspace project.');
    } fontally: {
      setProjLoading(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Active Workspace */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-violet to-accent-cyan flex items-center justify-center shadow-glow-sm">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text tracking-tight flex items-center gap-2">
              Research OS
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                v2.5 RAG
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">AI Research Intelligence Platform</p>
          </div>
        </div>

        {/* Project Selector Pill */}
        <div className="relative">
          <button 
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-sm text-slate-200 transition-all"
          >
            <FolderKanban className="w-4 h-4 text-brand-400" />
            <span className="font-medium truncate max-w-[180px]">
              {activeProject ? activeProject.title : 'Select Workspace'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-brand-400 font-mono font-semibold">
              {papers.length} PDFs
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* Project Dropdown */}
          {showProjectDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Workspaces ({projects.length})
              </div>
              <div className="max-h-60 overflow-y-auto">
                {projects.map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      selectProject(proj.id);
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      activeProject?.id === proj.id ? 'bg-brand-600/10 text-brand-400 border-l-2 border-brand-500' : 'text-slate-300'
                    }`}
                  >
                    <span className="truncate font-medium">{proj.title}</span>
                    <span className="text-xs text-slate-500 font-mono">{(proj.paperIds || []).length} papers</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800 mt-2 pt-2 px-2">
                <button
                  onClick={() => {
                    setShowProjectDropdown(false);
                    setShowNewProjModal(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-semibold text-brand-400 hover:bg-brand-500/10 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center space-x-4">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl text-sm transition-all"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-xs">Quick AI Action...</span>
          <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Upload Paper Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold px-3.5 py-1.5 rounded-xl text-sm shadow-glow-sm hover:shadow-glow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload PDF</span>
        </button>

        {/* AI Key Status Badge */}
        <button
          onClick={() => setShowKeyModal(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition"
          title="Configure Gemini API Key"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-amber animate-pulse" />
          <span>{user?.apiKey ? 'Gemini Linked' : 'Gemini Auto'}</span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-violet to-brand-500 flex items-center justify-center font-bold text-xs text-white">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-sm font-semibold text-slate-100">{user?.name || 'Researcher'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || 'researcher@demo.com'}</p>
                {user?.institution && (
                  <p className="text-[10px] text-brand-400 mt-0.5 truncate font-mono">{user.institution}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  setShowKeyModal(true);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
              >
                <Key className="w-3.5 h-3.5 text-accent-amber" />
                <span>API Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Key className="w-5 h-5 text-accent-amber" />
              Configure Google Gemini API Key
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your Google Gemini API key to enable high-accuracy custom RAG synthesis.
            </p>
            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">API Key</label>
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition shadow-glow-sm"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Workspace Project Modal */}
      {showNewProjModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Create New Workspace</h3>
                <p className="text-xs text-slate-400">Isolated RAG research intelligence environment</p>
              </div>
            </div>

            {projError && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{projError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Workspace Title *</label>
                <input
                  type="text"
                  required
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="e.g. LLM Reasoning Benchmarks 2026"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Description (Optional)</label>
                <textarea
                  rows="2"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Focusing on zero-shot chain of thought and multi-document synthesis..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={projLoading || !newProjectTitle.trim()}
                  className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition shadow-glow-sm disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {projLoading ? (
                    <span>Creating Workspace...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
