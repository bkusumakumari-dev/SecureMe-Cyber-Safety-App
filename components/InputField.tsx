
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  icon?: React.ReactNode; // New prop for an icon
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, className, icon, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-gray-200 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${icon ? 'pl-10' : ''} ${className || ''}`}
          {...props}
        />
      </div>
    </div>
  );
};
