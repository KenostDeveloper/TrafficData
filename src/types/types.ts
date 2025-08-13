// types.ts
export type ProjectStatus = 'verified' | 'pending' | 'unverified';

export interface Project {
  id: string;
  name: string;
  author: string;
  imageUrl: string;
  coordinates: [number, number]; // долгота, широта
  createdAt: Date;
  status: 'verified' | 'pending' | 'unverified';
  rating?: number;
}
export interface ProjectFormValues {
  name: string;
  author: string;
  imageUrl: string;
  status: ProjectStatus;
  rating?: number;
}

export interface MapComponentProps {
  onMapClick?: (coords: [number, number]) => void;
  center?: [number, number];
  zoom?: number;
}

export interface ProjectFormProps {
  onSubmit: (project: ProjectFormValues) => void;
  onCancel: () => void;
}

export interface ProjectListProps {
  projects: Project[];
  onCenterMap: (coords: [number, number]) => void;
  onDelete: (id: string) => void;
  onIncreaseRating: (id: string) => void;
  onClose: () => void;
}