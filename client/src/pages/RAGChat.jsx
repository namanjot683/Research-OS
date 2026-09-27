import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Quote, 
  Copy, 
  Check, 
  Filter, 
  RefreshCw,
  Layers
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProject } from '../context/ProjectContext';
import { aiAPI } from '../services/api';

export default function RAGChat() {
  const { activeProject, papers, activePaper, setActivePaper } = useProject();
  const [selectedPaperScope, setSelectedPaperScope] = useState('all');
  const [messages, setMessages] = useState([
    {
      id: 'm_init',
      sender: 'ai',
      text: `Hello! I am your AI Research Assistant powered by **Retrieval-Augmented Generation (RAG)**.\n\nI have indexed **${papers.length} research papers** in your workspace workspace. Ask me any question about methodologies, equations, datasets, or comparative conclusions!`,
      citations: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !activeProject) return;

    const userQuery = input.trim();
    setInput('');

    const userMsg = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiAPI.chat({
        projectId: activeProject.id,
        query: userQuery,
        selectedPaperId: selectedPaperScope
      });

      const aiMsg = {
        id: 'm_' + (Date.now() + 1),
        sender: 'ai',
        text: res.data.answer,
        citations: res.data.citations || [],
        confidence: res.data.confidence || 0.92,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'm_err_' + Date.now(),
          sender: 'ai',
          text: 'Apologies, I encountered an issue retrieving context vectors. Please check backend connection.',
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    "Compare the core methodologies of all papers in this workspace.",
    "What are the major limitations reported in the Transformer paper?",
    "Explain how RAG memory architecture reduces model hallucinations.",
    "Summarize the datasets and empirical metrics across papers."
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950">
      {/* Scope Control Header */}
      <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              RAG Conversational Assistant
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Live RAG Vector Store
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Synthesizing information across uploaded workspace PDFs</p>
          </div>
        </div>

        {/* Paper Filter Selector */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Context Scope:</span>
          <select
            value={selectedPaperScope}
            onChange={(e) => setSelectedPaperScope(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Workspace Papers ({papers.length})</option>
            {papers.map(p => (
              <option key={p.id} value={p.id}>Only: {p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-4 max-w-4xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-accent-violet to-brand-500 text-white font-bold text-xs'
                  : 'bg-gradient-to-tr from-brand-600 to-accent-cyan text-white shadow-glow-sm'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div className={`space-y-2 max-w-2xl ${msg.sender === 'user' ? 'items-end' : ''}`}>
              <div
                className={`p-5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'glass-card border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>

              {/* Citations & Source Chunks */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="glass-card p-3 rounded-xl border border-slate-800/80 bg-slate-900/40 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Quote className="w-3 h-3 text-brand-400" />
                      <span>Retrieved Citations & Sources ({msg.citations.length})</span>
                    </span>
                    {msg.confidence && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {Math.round(msg.confidence * 100)}% Confidence Match
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {msg.citations.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start justify-between space-x-2 text-[11px]"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-brand-400">
                            [{c.paperTitle}, Page {c.page || 1}]
                          </span>
                          <p className="text-slate-300 line-clamp-2 italic">"{c.text}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time & Action bar */}
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 px-1">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-slate-300 transition flex items-center space-x-1"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center space-x-3 text-slate-400 text-xs animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <span>Searching vector embeddings & synthesizing answer...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length < 3 && (
        <div className="px-6 py-2 flex flex-wrap gap-2">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInput(prompt)}
              className="text-xs bg-slate-900 border border-slate-800 hover:border-brand-500/40 text-slate-300 px-3 py-1.5 rounded-full transition"
            >
              ⚡ {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the research papers (e.g. 'Compare dataset sizes and BLEU scores')..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white flex items-center justify-center shadow-glow-sm transition disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
