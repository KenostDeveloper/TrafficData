import React from 'react';
import styles from './RadioButton.module.css';
import type { ProjectStatus } from '../../../types';
import { Dot } from '../Dot';
import { CircleX } from 'lucide-react';

export interface BooleanRadioButtonProps {
  value: boolean;
  text?: string;
  onChange: (value: boolean) => void;
  className?: string;
  variant?: ProjectStatus;
}

export const RadioButton: React.FC<BooleanRadioButtonProps> = ({
  value,
  onChange,
  className,
  text,
  variant = 'pending'
}) => {

  return (
    <div onClick={() => onChange(!value)} className={`${styles.radioButton} ${value? `${styles.disabled}` : ''} ${styles[variant]} ${className || ''}`}>
      {!value?
        <Dot variant={variant}/>
        :
        <CircleX size={16} />
      }
      {text}
    </div>
  );
};