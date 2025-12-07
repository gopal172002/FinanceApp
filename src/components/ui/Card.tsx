import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    padding = true
}) => {
    return (
        <div
            className={clsx(
                'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
                padding && 'p-6',
                className
            )}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
    return (
        <div className={clsx('mb-4', className)}>
            {children}
        </div>
    );
};

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
    return (
        <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
            {children}
        </h3>
    );
};

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
    return (
        <div className={clsx(className)}>
            {children}
        </div>
    );
};
