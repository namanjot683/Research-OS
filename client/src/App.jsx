import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UploadModal from './components/UploadModal';
import CommandPalette from './components/CommandPalette';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import RAGChat from './pages/RAGChat';
import DocumentViewer from './pages/DocumentViewer';
import LitReview from './pages/LitReview';
import PaperCompare from './pages/PaperCompare';
import GapDetector from './pages/GapDetector';
import Citations from './pages/Citations';
import Timeline from './pages/Timeline';
import QuizFlashcards from './pages/QuizFlashcards';
import BookmarksHub from './pages/BookmarksHub';
import SettingsPage from './pages/SettingsPage';
import { BrainCircuit } from 'lucide-react';

function AppContent() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center animate-bounce shadow-glow-md">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <p className="text-xs font-semibold text-slate-400 font-mono tracking-wider">LOADING RESEARCH OS...</p>
      </div>
    );
  }

  if (!user || !token) {
    return <AuthPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950/60">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<RAGChat />} />
              <Route path="/viewer" element={<DocumentViewer />} />
              <Route path="/lit-review" element={<LitReview />} />
              <Route path="/matrix" element={<PaperCompare />} />
              <Route path="/gap-detector" element={<GapDetector />} />
              <Route path="/citations" element={<Citations />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/quiz" element={<QuizFlashcards />} />
              <Route path="/bookmarks" element={<BookmarksHub />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Global Overlays */}
        <UploadModal />
        <CommandPalette />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}
