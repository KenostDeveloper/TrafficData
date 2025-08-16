
import React from 'react';
import styles from './Dot.module.css';
import type { ProjectStatus } from '../../../types';

interface DotProps {
  variant?: ProjectStatus;
}

export const Dot: React.FC<DotProps> = ({
  variant = 'pending',
}) => {

  return (
    <div className={`${styles[variant]} ${styles.dot}`}></div>
  );
};