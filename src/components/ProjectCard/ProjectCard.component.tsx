import { MapPin, Star, Trash } from 'lucide-react';
import { useState } from 'react';
import styles from './ProjectCard.module.css'
import type { Project } from '../../types';

interface ProjectCardProps {
    project: Project;
    onRatingIncrease?: () => void;
    onDelete?: () => void;
    onFocusOnMap?: () => void;
}

export function ProjectCard({ project, onRatingIncrease, onDelete, onFocusOnMap }: ProjectCardProps) {
    const [isStarClicked, setIsStarClicked] = useState(false);
    const [isDeleteClicked, setIsDeleteClicked] = useState(false);

    const handleStarClick = () => {
        if (project.status === 'verified' && onRatingIncrease) {
            setIsStarClicked(true);
            setTimeout(() => setIsStarClicked(false), 200);
            onRatingIncrease();
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteClicked(true);
        setTimeout(() => {
            setIsDeleteClicked(false);
            onDelete?.();
        }, 200);
    };

    const handleMapPinClick = () => {
        onFocusOnMap?.();
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageCard}>
                {project.imageUrl ?
                    <img className={styles.image} src={project.imageUrl || ''} alt={project.name} />
                    :
                    project.name
                }
            </div>
            <div className={styles.cardContent}>
                <div>
                    <div className={styles.cardTitle}>{project.name}</div>
                    <div className={styles.cardInfo}>
                        <div className={styles.cardInfoText}>
                            <div className={styles.cardDate}>
                                {new Date(project.createdAt).toLocaleDateString('ru-RU', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric' 
                                }).replace(/\//g, '.')}
                            </div>
                            <div className={styles.dot}>•</div>
                            <div className={styles.cardDescription}>{project.author}</div>
                        </div>
                        {project.status === 'verified' &&
                            <div className={styles.cardRating}>
                                <Star className={styles.cardIcon} width={14} strokeWidth={2} />
                                {project.rating! > 999 ?
                                    <div>999+</div>
                                    :
                                    <div>{project.rating}</div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.cardEvents}>
                    <MapPin 
                        className={styles.cardIcon} 
                        width={16} 
                        strokeWidth={1}
                        onClick={handleMapPinClick}
                    />
                    {project.status === 'verified' &&
                        <Star 
                            className={`${styles.cardIcon} ${isStarClicked ? styles.starClicked : ''}`}
                            width={16} 
                            strokeWidth={1}
                            onClick={handleStarClick}
                        />
                    }
                    <Trash 
                        className={`${styles.cardIcon} ${isDeleteClicked ? styles.deleteClicked : ''}`}
                        width={16} 
                        strokeWidth={1}
                        onClick={handleDeleteClick}
                    />
                </div>
            </div>
        </div>
    );
}