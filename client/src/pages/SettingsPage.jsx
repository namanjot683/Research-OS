import React, { useState } from 'react';
import { Settings, Key, User, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, updateApiKey } = useAuth();
  const [apiKey, setApiKey] = useState(user?.apiKey || '');
  const [name, setName] = useState(user?.name || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-800 pb-6 space-y-1">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400">
          <Settings className="w-4 h-4" />
          <span>System & Credentials</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Platform Settings</h1>
        <p className="text-xs text-slate-400">
          Manage your AI model configurations, Gemini API credentials, and researcher profile.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gemini Key Panel */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Google Gemini API Key</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Research OS integrates Google Gemini API (gemini-1.5-flash) for RAG context reasoning, citation verification, and literature synthesis.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Profile Info */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <User className="w-4 h-4 text-brand-400" />
            <span>Researcher Information</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Institution / Department</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-glow-sm flex items-center space-x-2 transition"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
