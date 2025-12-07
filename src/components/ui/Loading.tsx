import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC<{ size?: number }> = ({ size = 24 }) => {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 size={size} className="animate-spin text-primary-600" />
        </div>
    );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
    );
};

export const TableSkeleton: React.FC = () => {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-24" />
                    <Skeleton className="h-12 w-24" />
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton: React.FC = () => {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
};
