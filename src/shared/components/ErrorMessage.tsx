import { Button } from '@heroui/react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showIcon?: boolean;
}

export default function ErrorMessage({ 
  message, 
  onRetry,
  showIcon = true 
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      {showIcon && (
        <AlertCircle className="w-12 h-12 text-danger-500" />
      )}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-danger-600 mb-2">
          Something went wrong
        </h3>
        <p className="text-default-500 text-sm max-w-md">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button 
          color="primary" 
          variant="flat"
          startContent={<RefreshCw size={16} />}
          onPress={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}