import React, { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: InputType;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', error, fullWidth = false, ...props }, ref) => {
    return (
      <div className={`${styles.inputContainer} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${error ? styles.error : ''}`}
          {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';