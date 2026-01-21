
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, id, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-gray-200 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${className || ''}`}
        {...props}
      />
    </div>
  );
};
