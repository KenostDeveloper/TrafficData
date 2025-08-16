import { useEffect, useState, useCallback, useRef } from 'react';
import { MapComponent } from './components/Map';
import styles from './App.module.css';
import { Modal } from './components/ui/Modal';
import { LOCAL_STORAGE_KEY } from './consts';
import { ProjectForm } from './components/ProjectForm';
import { ProjectControls } from './components/ProjectControls';
import type { Project, ProjectFormValues } from './types';
import { ProjectsList } from './components/ProjectsList';
import { fromLonLat } from 'ol/proj';
import { useNotification } from './context/NotificationContext';

const INITIAL_PROJECT_STATE: ProjectFormValues = {
  name: '',
  author: '',
  imageUrl: '',
  status: 'unverified',
  rating: 0,
  coordinates: [56.227431, 58.008653],
};

export default function App() {
  const { showNotification } = useNotification();
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [openAddProject, setOpenProject] = useState(false);
  const [openListProjects, setOpenListProjects] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>(null);
  const [newProject, setNewProject] = useState<ProjectFormValues>({
    ...INITIAL_PROJECT_STATE,
    createdAt: new Date()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = useCallback(() => {
    // Проверка обязательных полей
    if (!newProject.name.trim()) {
      showNotification({
        message: 'Введите название проекта',
        duration: 3000
      });
      return;
    }

    if (!newProject.author.trim()) {
      showNotification({
        message: 'Введите автора проекта',
        duration: 3000
      });
      return;
    }

    if (!selectedPoint) {
      showNotification({
        message: 'Выберите местоположение на карте',
        duration: 3000
      });
      return;
    }

    // Проверка URL изображения, если оно введено
    if (newProject.imageUrl && !/^https?:\/\/.+\..+/.test(newProject.imageUrl)) {
      showNotification({
        message: 'Введите корректный URL изображения',
        duration: 3000
      });
      return;
    }

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
      
      showNotification({
        message: 'Проект успешно добавлен!',
        duration: 5000
      });
    } catch (error) {
      console.error('Error adding project:', error);
      showNotification({
        message: 'Произошла ошибка при добавлении проекта',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [newProject, selectedPoint, showNotification]);

  const handleMapClick = useCallback((coords: [number, number]) => {
    setSelectedPoint(coords);
    setNewProject(prev => ({
      ...prev,
      coordinates: coords
    }));
  }, [showNotification]);

  const handleProjectChange = useCallback((field: string, value: string | number) => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleFocusOnMap = useCallback((coordinates: [number, number]) => {
    if (mapRef.current) {
      mapRef.current.getView().animate({
        center: fromLonLat(coordinates),
        zoom: 17,
        duration: 500
      });
    }
  }, [showNotification]);

  const handleDeleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    showNotification({
      message: 'Проект удален',
      duration: 3000
    });
  }, [showNotification]);

  const handleRatingIncrease = useCallback((projectId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId && project.status === 'verified') {
        return { ...project, rating: (project.rating || 0) + 1 };
      }
      return project;
    }));
  }, [showNotification]);

  const isFormValid = Boolean(
    newProject.name.trim() && 
    newProject.author.trim() && 
    selectedPoint
  );

  return (
    <div className={styles.appContainer}>
      <MapComponent
        ref={mapRef}
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
          padding='24px'
        >
          <ProjectsList 
            projects={projects}
            setProjects={setProjects}
            onFocusOnMap={handleFocusOnMap}
            onDelete={handleDeleteProject}
            onRatingIncrease={handleRatingIncrease}
          />
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