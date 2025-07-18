import React, { useEffect } from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-danger" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'border-success bg-success-50';
      case 'error':
        return 'border-danger bg-danger-50';
      case 'warning':
        return 'border-warning bg-warning-50';
      case 'info':
        return 'border-primary bg-primary-50';
      default:
        return 'border-default bg-default-50';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <Card className={`max-w-md border-l-4 ${getColorClasses()}`}>
        <CardBody className="flex flex-row items-center gap-3 p-4">
          {getIcon()}
          <p className="flex-1 text-sm font-medium text-default-700">
            {message}
          </p>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={onClose}
            className="min-w-unit-6 w-6 h-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>>([]);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, isVisible: true }]);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer,
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    warning: (message: string) => showToast('warning', message),
    info: (message: string) => showToast('info', message)
  };
};