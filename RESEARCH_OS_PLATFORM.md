# Research OS – AI Powered Research Intelligence Platform

**Research OS** is a full-stack, AI-powered research intelligence platform engineered to streamline literature reviews, multi-document analysis, citation generation, and research gap detection for students, professors, and researchers.

---

## 🌟 Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │    React.js + Tailwind CSS Frontend  │
                      │  (Port 3000 - Glassmorphism UI/UX)   │
                      └──────────────────┬───────────────────┘
                                         │ REST APIs
                                         ▼
                      ┌──────────────────────────────────────┐
                      │   Node.js Express Backend Server     │
                      │      (Port 5000 - Storage & Auth)    │
                      └─────────┬──────────────────┬─────────┘
                                │                  │
                    Proxy RAG   │                  │ Persistent JSON/SQLite
                    Requests    ▼                  ▼ Metadata Store
                      ┌──────────────────┐    ┌─────────────────────┐
                      │  Python FastAPI  │    │  User, Workspace,   │
                      │  AI Microservice │    │  Papers & Bookmarks │
                      │   (Port 8000)    │    └─────────────────────┘
                      └─────────┬────────┘
                                │ Gemini API
                                ▼
                      ┌──────────────────┐
                      │ Google Gemini AI │
                      │  (1.5/2.0 Flash) │
                      └──────────────────┘
```

---

## 📁 Repository Structure

```
c:\Users\Asus\OneDrive\beeeeee\
├── client/                     # React.js + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, UploadModal, CommandPalette
│   │   ├── context/           # AuthContext, ProjectContext
│   │   ├── pages/             # 10 Core Research Intelligence Pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RAGChat.jsx
│   │   │   ├── DocumentViewer.jsx
│   │   │   ├── LitReview.jsx
│   │   │   ├── PaperCompare.jsx
│   │   │   ├── GapDetector.jsx
│   │   │   ├── Citations.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── QuizFlashcards.jsx
│   │   │   ├── BookmarksHub.jsx
│   │   │   └── SettingsPage.jsx
│   │   └── services/          # Axios API Service Engine
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend Server
│   ├── server.js              # Full REST API Controller & Routes
│   ├── db.js                  # Persistent Data Manager & Sample Pre-loaded Papers
│   ├── middleware/            # JWT Auth & Upload Manager
│   ├── services/              # AI Helper with Gemini & Python Fallback
│   └── uploads/               # Uploaded PDF Documents Directory
│
└── ai_service/                 # Python FastAPI AI Microservice
    ├── main.py                # Fast RAG Vector Lookup & Gemini AI Pipeline
    └── requirements.txt       # FastAPI, Google-GenerativeAI, PyPDF, NumPy
```

---

## 🚀 Key Modules & Capabilities

1. **Multi-Paper Batch Workspace Management (Unlimited Scale & 10+ Papers at once)**:
   - Create isolated project workspaces.
   - Batch upload **10, 20, 50+ PDF research papers simultaneously** without artificial limits, complete with real-time text chunking and vector indexing.
   - Pre-loaded with landmark AI research papers (*Attention Is All You Need, RAG, ResNet, GANs*) for out-of-the-box evaluation.

2. **Conversational Multi-Paper RAG Chat**:
   - Chat with single papers or all workspace papers simultaneously.
   - Exact citation references `[Paper Title, Page X]`, snippet context previews, and confidence match scores.

3. **Multi-Document Literature Review Generator**:
   - Automated synthesis of selected or all papers into structured literature review sections: *Introduction, Methodological Comparison, Thematic Synthesis, Critical Gaps, Future Directions, and BibTeX*.
   - Export to Markdown (`.md`) format.

4. **Paper Comparison Matrix**:
   - Side-by-side interactive comparison matrix analyzing *Title, Authors, Year, Core Objective, Methodology, Key Findings, Limitations, and Future Scope*.
   - Exportable to `.csv`.

5. **Intelligent Research Gap Detector**:
   - Scans papers to find unaddressed challenges, conflicting conclusions, and severity/impact ratings.
   - Generates 3+ novel thesis/research topic proposals.

6. **Automatic Citation Generator**:
   - Instant citation generation in **APA 7th, IEEE, MLA 9th, Chicago 17th, and BibTeX** formats with 1-click copy.

7. **Interactive Document Reader & Color Highlighting**:
   - Custom yellow, green, and purple text markers.
   - Search keywords inside papers, save bookmarks, and view executive AI summaries.

8. **Research Timeline Visualizer**:
   - Interactive visual timeline charting publication dates, paradigm shifts, and architectural evolutions.

9. **Quiz & Flashcard Generator**:
   - Interactive study deck mode with flip cards and multiple-choice quiz with immediate scoring & explanations.

10. **Global Quick Action Palette (Ctrl+K)**:
    - Instant modal trigger for rapid navigation and prompt execution across the workspace.

---

## ⚡ How to Run the Application

### 1. Backend Express Server (Port 5000)
```bash
cd server
npm install
node server.js
```

### 2. Python AI Microservice (Port 8000)
```bash
cd ai_service
pip install -r requirements.txt
python main.py
```

### 3. React Frontend (Port 3000)
```bash
cd client
npm install
npm run dev
```

---

## 🔑 Gemini API Key Configuration

In the web interface:
1. Click on the **Gemini Auto** / **Key** badge in the top navigation bar or go to **Settings**.
2. Enter your Google Gemini API key (`AIzaSy...`).
3. Click **Save Settings**. The platform will seamlessly route RAG queries through your API key!
