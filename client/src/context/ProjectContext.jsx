import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectAPI, paperAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [papers, setPapers] = useState([]);
  const [activePaper, setActivePaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Fetch projects on load or token change
  const loadProjects = async () => {
    if (!token) {
      setProjects([]);
      setActiveProject(null);
      setPapers([]);
      setActivePaper(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await projectAPI.getAll();
      const loadedProjects = res.data || [];
      setProjects(loadedProjects);
      if (loadedProjects.length > 0) {
        selectProject(loadedProjects[0].id);
      } else {
        setActiveProject(null);
        setPapers([]);
        setActivePaper(null);
      }
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [token, user]);

  const selectProject = async (projectId) => {
    try {
      const res = await projectAPI.getOne(projectId);
      setActiveProject(res.data);
      setPapers(res.data.papers || []);
      if (res.data.papers && res.data.papers.length > 0) {
        setActivePaper(res.data.papers[0]);
      } else {
        setActivePaper(null);
      }
    } catch (err) {
      console.error('Error selecting project', err);
    }
  };

  const createProject = async (title, description) => {
    const res = await projectAPI.create({ title, description });
    setProjects(prev => [...prev, res.data]);
    selectProject(res.data.id);
    return res.data;
  };

  const uploadPaper = async (file, title, authors, year) => {
    if (!activeProject) throw new Error('No active workspace project selected');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (title) formData.append('title', title);
    if (authors) formData.append('authors', authors);
    if (year) formData.append('year', year);

    const res = await paperAPI.upload(activeProject.id, formData);
    setPapers(prev => [...prev, res.data]);
    if (!activePaper) setActivePaper(res.data);
    return res.data;
  };

  const uploadBatchPapers = async (files, authors, year) => {
    if (!activeProject) throw new Error('No active workspace project selected');
    if (!files || files.length === 0) throw new Error('No PDF files provided for batch upload');

    const formData = new FormData();
    Array.from(files).forEach(f => {
      formData.append('files', f);
    });
    if (authors) formData.append('authors', authors);
    if (year) formData.append('year', year);

    const res = await paperAPI.uploadBatch(activeProject.id, formData);
    const addedPapers = res.data || [];
    setPapers(prev => [...prev, ...addedPapers]);
    if (!activePaper && addedPapers.length > 0) {
      setActivePaper(addedPapers[0]);
    }
    return addedPapers;
  };

  const deletePaper = async (paperId) => {
    await paperAPI.delete(paperId);
    setPapers(prev => prev.filter(p => p.id !== paperId));
    if (activePaper?.id === paperId) {
      const remaining = papers.filter(p => p.id !== paperId);
      setActivePaper(remaining.length > 0 ? remaining[0] : null);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      papers,
      activePaper,
      loading,
      isUploadOpen,
      setIsUploadOpen,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      selectProject,
      createProject,
      uploadPaper,
      uploadBatchPapers,
      deletePaper,
      setActivePaper,
      reloadProjects: loadProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
