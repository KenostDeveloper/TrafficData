import React, { useEffect, type ReactNode } from 'react';
import styles from './Modal.module.css';
import { X } from 'lucide-react';

type ModalPosition =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
  height?: string;
  position?: ModalPosition;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = '500px',
  height = 'auto',
  position = 'center',
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalContentWrapper}>
        <div
          className={`${styles.modalContent} ${styles[position]}`}
          style={{ width, height }}
        >
          <div className={styles.modalHeader}>
            <h3>{title}</h3>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              aria-label="Закрыть модальное окно"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>
          <div className={styles.modalBody}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};