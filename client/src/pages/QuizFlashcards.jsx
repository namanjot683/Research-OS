import React, { useState, useEffect } from 'react';
import { GraduationCap, RotateCw, CheckCircle2, XCircle, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { aiAPI } from '../services/api';

export default function QuizFlashcards() {
  const { activeProject } = useProject();
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('flashcards'); // flashcards | quiz
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!activeProject) return;
      try {
        setLoading(true);
        const res = await aiAPI.quiz({ projectId: activeProject.id });
        setFlashcards(res.data.flashcards || []);
        setQuiz(res.data.quiz || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [activeProject]);

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400">
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Learning & Comprehension</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Quiz & Flashcard Generator</h1>
          <p className="text-xs text-slate-400">
            Master core paper concepts, architectures, and mathematical insights interactively.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === 'flashcards' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Study Flashcards ({flashcards.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === 'quiz' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Practice Quiz ({quiz.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-200">Generating Study Deck & Comprehension Questions...</p>
        </div>
      ) : activeTab === 'flashcards' ? (
        /* Flashcards Mode */
        <div className="max-w-2xl mx-auto space-y-6">
          {currentCard ? (
            <div className="space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full min-h-[300px] glass-panel rounded-3xl p-8 border border-slate-800 hover:border-brand-500/40 cursor-pointer flex flex-col justify-between transition-all duration-500 shadow-2xl relative"
              >
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="text-brand-400 font-semibold">{currentCard.paperTitle}</span>
                  <span>Card {currentCardIndex + 1} of {flashcards.length} • Click to Flip 🔄</span>
                </div>

                <div className="my-auto text-center space-y-3 py-6">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    {isFlipped ? 'Answer / Explanation' : 'Question / Concept'}
                  </p>
                  <h3 className="text-xl font-bold text-slate-100 leading-relaxed">
                    {isFlipped ? currentCard.answer : currentCard.question}
                  </h3>
                </div>

                <div className="text-center text-[11px] text-slate-500 font-mono">
                  Topic: {currentCard.topic || 'General Science'}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  disabled={currentCardIndex === 0}
                  onClick={() => { setCurrentCardIndex(prev => prev - 1); setIsFlipped(false); }}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl disabled:opacity-40"
                >
                  ← Previous Card
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  {currentCardIndex + 1} / {flashcards.length}
                </span>
                <button
                  disabled={currentCardIndex === flashcards.length - 1}
                  onClick={() => { setCurrentCardIndex(prev => prev + 1); setIsFlipped(false); }}
                  className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl shadow-glow-sm disabled:opacity-40"
                >
                  Next Card →
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-400">No flashcards generated.</p>
          )}
        </div>
      ) : (
        /* Quiz Mode */
        <div className="max-w-3xl mx-auto space-y-6">
          {quiz.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCorrect = selectedAnswers[q.id] === q.correctIndex;

            return (
              <div key={q.id || idx} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold font-mono text-brand-400">Question #{idx + 1}</span>
                  {isAnswered && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-100">{q.question}</h3>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const selected = selectedAnswers[q.id] === optIdx;
                    let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";
                    if (isAnswered) {
                      if (optIdx === q.correctIndex) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                      else if (selected) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-slate-100">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
