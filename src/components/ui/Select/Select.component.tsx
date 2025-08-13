import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = ({ label, options, className = '', ...props }: SelectProps) => {
  return (
    <div className={`${styles.selectContainer} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectWrapper}>
        <select className={styles.select} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.chevron} size={14} />
      </div>
    </div>
  );
};