import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={clsx(
                    'w-full px-3 py-2 border rounded-lg transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    error
                        ? 'border-danger'
                        : 'border-gray-300 dark:border-gray-600',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                    'placeholder-gray-400 dark:placeholder-gray-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-danger">{error}</p>
            )}
        </div>
    );
};
