import { useEffect, useState } from 'react';
import styles from './Notification.module.css';
import { CheckCircle, XCircle, Info, AlertTriangle, X, CircleAlert } from 'lucide-react';


interface NotificationProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export function Notification({
  message,
  duration = 3000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      closeNotification();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const closeNotification = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Длительность анимации закрытия
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.notification} ${isExiting ? styles.exit : ''}`}>
      <div className={styles.iconContainer}>
        <CircleAlert size={24} />
      </div>
      <div className={styles.content}>{message}</div>
    </div>
  );
}