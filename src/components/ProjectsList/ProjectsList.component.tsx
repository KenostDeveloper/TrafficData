import { useState } from "react";
import type { Project } from "../../types";
import { ProjectCard } from "../ProjectCard";
import styles from './ProjectsList.module.css'
import { RadioButton } from "../ui/RadioButton";

interface ProjectsListProps {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    onFocusOnMap: (coordinates: [number, number]) => void;
    onDelete: (projectId: string) => void;
    onRatingIncrease: (projectId: string) => void;
}

export function ProjectsList({ 
    projects, 
    setProjects,
    onFocusOnMap,
    onDelete,
    onRatingIncrease
}: ProjectsListProps) {
    const [showVerified, setShowVerified] = useState<boolean>(false);
    const [showPending, setShowPending] = useState<boolean>(false);
    const [showUnverified, setShowUnverified] = useState<boolean>(false);

    // Сортируем проекты по дате создания (новые сначала)
    const sortedProjects = [...projects].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Фильтруем уже отсортированные проекты
    const filteredProjects = sortedProjects.filter(project => {
        if (!showVerified && !showPending && !showUnverified) return true;
        return (
            (showVerified && project.status === 'verified') ||
            (showPending && project.status === 'pending') ||
            (showUnverified && project.status === 'unverified')
        );
    });

    const countVerified = projects.filter(p => p.status === 'verified').length;
    const countPending = projects.filter(p => p.status === 'pending').length;
    const countUnverified = projects.filter(p => p.status === 'unverified').length;

    return (
        <div>
            <div className={styles.filters}>
                <RadioButton
                    value={showVerified}
                    onChange={() => setShowVerified(!showVerified)}
                    variant='verified'
                    text={`Проверенные (${countVerified})`}
                />
                <RadioButton
                    value={showPending}
                    onChange={() => setShowPending(!showPending)}
                    variant='pending'
                    text={`На проверке (${countPending})`}
                />
                <RadioButton
                    value={showUnverified}
                    onChange={() => setShowUnverified(!showUnverified)}
                    variant='unverified'
                    text={`Непроверенные (${countUnverified})`}
                />
            </div>
       
            <div className={styles.list}>
                {filteredProjects.map((project: Project) => (
                    <ProjectCard 
                        key={project.id}
                        project={project}
                        onRatingIncrease={() => onRatingIncrease(project.id)}
                        onDelete={() => onDelete(project.id)}
                        onFocusOnMap={() => onFocusOnMap(project.coordinates)}
                    />
                ))}
            </div>
        </div>
    );
}