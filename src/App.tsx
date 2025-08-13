import { useEffect, useState, useCallback } from 'react';
import { MapComponent } from './components/Map';
import styles from './App.module.css';
import { Modal } from './components/ui/Modal';
import { LOCAL_STORAGE_KEY } from './consts';
import { ProjectForm } from './components/ProjectForm';
import { ProjectControls } from './components/ProjectControls';
import type { Project } from './types';

const INITIAL_PROJECT_STATE = {
  name: '',
  author: '',
  imageUrl: '',
  status: 'unverified' as const,
  rating: 0,
  coordinates: [56.227431, 58.008653] as [number, number]
};

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [openAddProject, setOpenProject] = useState(false);
  const [openListProjects, setOpenListProjects] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>(null);
  const [newProject, setNewProject] = useState(INITIAL_PROJECT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = useCallback(() => {
    if (!selectedPoint || !newProject.name || !newProject.author) return;

    setIsSubmitting(true);

    try {
      const project: Project = {
        id: Date.now().toString(),
        ...newProject,
        coordinates: selectedPoint,
        createdAt: new Date()
      };

      setProjects(prev => [...prev, project]);
      setOpenProject(false);
      setSelectedPoint(null);
      setNewProject(INITIAL_PROJECT_STATE);
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [newProject, selectedPoint]);

  const handleMapClick = useCallback((coords: [number, number]) => {
    setSelectedPoint(coords);
    setNewProject(prev => ({
      ...prev,
      coordinates: coords
    }));
  }, []);

  const handleProjectChange = useCallback((field: string, value: string | number) => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  useEffect(() => {
    if (openAddProject) {
      setSelectedPoint(null);
    }
  }, [openAddProject]);

  const isFormValid = Boolean(
    newProject.name.trim() && 
    newProject.author.trim() && 
    selectedPoint
  );

  return (
    <div className={styles.appContainer}>
      <MapComponent
        projects={projects}
        onMapClick={handleMapClick}
        selectedPoint={openAddProject ? selectedPoint : null}
      />

      <div className={styles.controls}>
        <Modal
          isOpen={openAddProject}
          onClose={() => setOpenProject(false)}
          title="Новый проект"
          width="340px"
          position="top-left"
        >
          <ProjectForm
            project={newProject}
            onSubmit={handleAddProject}
            onCancel={() => setOpenProject(false)}
            onChange={handleProjectChange}
            isSubmitting={isSubmitting}
            isValid={isFormValid}
          />
        </Modal>

        <Modal
          isOpen={openListProjects}
          onClose={() => setOpenListProjects(false)}
          title="Список проектов"
          width="600px"
          height="100vh"
          position="top-right"
        >
          {/* Здесь можно добавить компонент ProjectsList в будущем */}
          <div>Список проектов будет здесь</div>
        </Modal>

        <ProjectControls
          onAddProject={() => setOpenProject(true)}
          onShowList={() => setOpenListProjects(true)}
          showControls={!openListProjects && !openAddProject}
        />
      </div>
    </div>
  );
}