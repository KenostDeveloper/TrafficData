import { List, MapPinPlus } from 'lucide-react';
import { Button } from '../ui/Button';

type ProjectControlsProps = {
  onAddProject: () => void;
  onShowList: () => void;
  showControls: boolean;
};

export function ProjectControls({
  onAddProject,
  onShowList,
  showControls
}: ProjectControlsProps) {
  if (!showControls) return null;

  return (
    <>
      <Button
        variant="map"
        onClick={onAddProject}
        icon={<MapPinPlus />}
        aria-label="Добавить проект"
      >
        Добавить проект
      </Button>
      <Button
        variant="map"
        onClick={onShowList}
        icon={<List />}
        aria-label="Список проектов"
      >
        Список проектов
      </Button>
    </>
  );
}