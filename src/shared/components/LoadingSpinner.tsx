import { Spinner } from '@heroui/react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md' 
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <Spinner size={size} />
      <p className="text-default-500 text-sm">{message}</p>
    </div>
  );
}