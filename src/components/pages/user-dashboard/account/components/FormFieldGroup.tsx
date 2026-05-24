'use client';

import type { ReactNode } from 'react';

interface FormFieldGroupProps {
  label: string | ReactNode;
  children: ReactNode;
  className?: string;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  label,
  children,
  className = '',
}) => {
  return (
    <div className={`w-full relative ${className}`}>
      <p className="absolute right-0 top-0 text-sm-medium text-textSecondary w-70">
        {label}
      </p>
      {children}
    </div>
  );
};

export default FormFieldGroup;
