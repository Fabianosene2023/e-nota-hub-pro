
import React from 'react';
import { ButtonWithFeedback } from './ButtonWithFeedback';
import { ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends Omit<ButtonProps, 'onError'> {
  isLoading: boolean;
  loadingText?: string;
}

/**
 * Simple loading button wrapper for common use cases
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText = 'Carregando...',
  children,
  ...props
}) => {
  return (
    <ButtonWithFeedback
      {...props}
      loading={isLoading}
      loadingText={loadingText}
    >
      {children}
    </ButtonWithFeedback>
  );
};
