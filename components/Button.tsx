
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  customBgClass?: string; // New prop for custom background classes, e.g., 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  customBgClass,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';

  const variantStyles = {
    primary: customBgClass || 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-cyan-400', // Default primary now gray, focus is cyan
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 focus:ring-gray-500', // Adjusted text color for dark theme
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};
