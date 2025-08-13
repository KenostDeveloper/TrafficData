
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'map';
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  icon,
  className = '',
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};