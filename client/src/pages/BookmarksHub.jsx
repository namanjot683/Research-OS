import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, FileText, Highlighter } from 'lucide-react';
import { bookmarkAPI } from '../services/api';

export default function BookmarksHub() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await bookmarkAPI.getAll();
      setBookmarks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    await bookmarkAPI.delete(id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-1">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400">
          <Bookmark className="w-4 h-4" />
          <span>Knowledge Highlights Repository</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Bookmarks & Saved Passages</h1>
        <p className="text-xs text-slate-400">
          Central hub for your highlighted paper passages, annotations, and key quotes.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400">
          <Bookmark className="w-10 h-10 mx-auto mb-2 text-slate-600" />
          <p>No saved highlights yet. Highlight text inside Document Reader to save passages here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((b) => (
            <div key={b.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-brand-400 font-semibold">{b.paperTitle}</span>
                  <span>Page {b.page || 1}</span>
                </div>

                <p className="text-xs text-slate-200 mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 italic leading-relaxed">
                  "{b.text}"
                </p>

                {b.note && (
                  <p className="text-[11px] text-slate-400 mt-2">
                    <span className="font-semibold text-slate-300">Note:</span> {b.note}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Bookmark</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
