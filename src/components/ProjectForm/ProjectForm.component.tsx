import { STATUS_OPTIONS } from '../../consts';
import styles from './ProjectForm.module.css';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { ProjectFormValues } from '../../types';

interface ProjectFormProps {
  project: ProjectFormValues;
  onSubmit: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string | number) => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting,
  isValid
}: ProjectFormProps) {
  return (
    <div className={styles.formContainer}>
      <Input
        label="Название"
        value={project.name}
        onChange={(e) => onChange('name', e.target.value)}
        required
      />

      <Input
        label="Автор"
        value={project.author}
        onChange={(e) => onChange('author', e.target.value)}
        required
      />

      <Input
        label="Ссылка на изображение"
        value={project.imageUrl}
        onChange={(e) => onChange('imageUrl', e.target.value)}
        type="url"
      />

      <Select
        label="Статус"
        value={project.status}
        onChange={(e) => onChange('status', e.target.value)}
        options={STATUS_OPTIONS}
      />

      {project.status === 'verified' && (
        <Input
          label="Рейтинг"
          type="number"
          value={project.rating.toString()} // rating теперь точно number
          onChange={(e) => onChange('rating', parseInt(e.target.value) || 0)}
          min="0"
          max="100"
        />
      )}

      <div className={styles.modalActions}>
        <Button
          variant="primary"
          onClick={onSubmit}
        >
          {isSubmitting ? 'Добавление...' : 'Добавить'}
        </Button>
      </div>
    </div>
  );
}