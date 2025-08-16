import { createContext, useContext, useState } from 'react';
import { Notification } from '../components/ui/Notification';

interface NotificationData {
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (data: NotificationData) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const showNotification = ({ message, duration = 3000 }: NotificationData) => {
    setNotification({ message, duration });
  };

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          duration={notification.duration}
          onClose={handleClose}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}