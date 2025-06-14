
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonWithFeedbackProps extends ButtonProps {
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

/**
 * Enhanced button component with visual feedback states
 * Provides loading, success, and error states with appropriate icons
 */
export const ButtonWithFeedback: React.FC<ButtonWithFeedbackProps> = ({
  children,
  loading = false,
  success = false,
  error = false,
  loadingText = 'Processando...',
  successText = 'Sucesso!',
  errorText = 'Erro',
  onSuccess,
  onError,
  className,
  disabled,
  ...props
}) => {
  const [feedbackState, setFeedbackState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  React.useEffect(() => {
    if (loading) {
      setFeedbackState('loading');
    } else if (success) {
      setFeedbackState('success');
      onSuccess?.();
      // Reset after 2 seconds
      setTimeout(() => setFeedbackState('idle'), 2000);
    } else if (error) {
      setFeedbackState('error');
      onError?.();
      // Reset after 3 seconds
      setTimeout(() => setFeedbackState('idle'), 3000);
    } else {
      setFeedbackState('idle');
    }
  }, [loading, success, error, onSuccess, onError]);

  const getButtonContent = () => {
    switch (feedbackState) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {loadingText}
          </>
        );
      case 'success':
        return (
          <>
            <Check className="w-4 h-4 mr-2" />
            {successText}
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            {errorText}
          </>
        );
      default:
        return children;
    }
  };

  const getButtonVariant = () => {
    switch (feedbackState) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return props.variant || 'default';
    }
  };

  return (
    <Button
      {...props}
      variant={getButtonVariant()}
      disabled={disabled || loading}
      className={cn(
        className,
        feedbackState === 'success' && 'bg-green-600 hover:bg-green-700',
        feedbackState === 'loading' && 'cursor-wait'
      )}
    >
      {getButtonContent()}
    </Button>
  );
};
