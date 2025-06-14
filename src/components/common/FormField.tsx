
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'input';
  inputType?: 'text' | 'email' | 'number' | 'tel';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  step?: string;
  min?: string | number;
  max?: string | number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

export const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, required, error, helpText, className } = props;
  
  const fieldId = React.useId();
  const hasError = !!error;

  const renderInput = () => {
    switch (props.type) {
      case 'input':
        return (
          <Input
            id={fieldId}
            type={props.inputType || 'text'}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={props.disabled}
            step={props.step}
            min={props.min}
            max={props.max}
            className={cn(hasError && 'border-destructive focus-visible:ring-destructive')}
          />
        );
      
      case 'select':
        return (
          <Select value={props.value} onValueChange={props.onChange} disabled={props.disabled}>
            <SelectTrigger className={cn(hasError && 'border-destructive focus:ring-destructive')}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={props.disabled}
            rows={props.rows}
            className={cn(hasError && 'border-destructive focus-visible:ring-destructive')}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={fieldId} className={cn(hasError && 'text-destructive')}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
      {helpText && !hasError && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
      {hasError && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
