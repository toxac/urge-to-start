'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Database, Json } from '@/types/supabase';
import { completeTaskExecution } from '@/actions/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type TaskRow = Database['public']['Tables']['tasks']['Row'];

interface TaskFormRendererProps {
  task: TaskRow;
  existingProgress?: any;
  onSuccess?: (data: any) => void;
}

interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'toggle' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export function TaskFormRenderer({ task, existingProgress, onSuccess }: TaskFormRendererProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Extract config fields safely out of the table's jsonb column
  const config = (task.metadata_config as Record<string, any>) || {};
  const fields: FieldDefinition[] = config.fields || [];
  
  // Bind pre-saved answers from user_progress directly into react-hook-form defaults
  const isCompleted = existingProgress?.status === 'completed';
  const defaultValues = existingProgress?.saved_payload || {};
  
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const response = await completeTaskExecution({
        taskId: task.id,
        savedPayload: data
      });

      if (response.success) {
        if (onSuccess) onSuccess(response.data);
      } else {
        setServerError(response.error);
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred compiling the task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {serverError && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          ⚠️ {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="w-full space-y-5">
          {fields.map((field) => (
            <div key={field.name} className="w-full space-y-2">
              <Label className="text-sm font-semibold tracking-tight block">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>

              {/* TYPE 1: TEXTAREA */}
              {field.type === 'textarea' && (
                <Textarea
                  className="w-full min-h-[120px] resize-none"
                  placeholder={field.placeholder}
                  disabled={isCompleted}
                  {...register(field.name, { required: field.required })}
                />
              )}

              {/* TYPE 2: DROPDOWN SELECT */}
              {field.type === 'select' && (
                <select
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isCompleted}
                  {...register(field.name, { required: field.required })}
                >
                  <option value="">{field.placeholder || "Choose an option..."}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}

              {/* TYPE 3: TOGGLE SWITCH */}
              {field.type === 'toggle' && (
                <div className="w-full flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                  <span className="text-xs text-muted-foreground">Toggle to confirm agreement or visibility state</span>
                  <Controller
                    control={control}
                    name={field.name}
                    rules={{ required: field.required }}
                    render={({ field: { value, onChange } }) => (
                      <Switch
                        checked={!!value}
                        onCheckedChange={onChange}
                        disabled={isCompleted}
                      />
                    )}
                  />
                </div>
              )}

              {/* TYPE 4: RADIO BUTTON GROUPS */}
              {field.type === 'radio' && (
                <div className="w-full grid grid-cols-1 gap-2 bg-muted/10 p-3 border rounded-xl">
                  {field.options?.map((option) => (
                    <label 
                      key={option} 
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer text-sm"
                    >
                      <input
                        type="radio"
                        value={option}
                        disabled={isCompleted}
                        className="h-4 w-4 text-primary border-input focus:ring-primary"
                        {...register(field.name, { required: field.required })}
                      />
                      <span className="text-foreground font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* TYPE 5 & 6: DEFAULT INPUT (TEXT / NUMBER) */}
              {(field.type === 'text' || field.type === 'number') && (
                <Input
                  type={field.type}
                  className="w-full"
                  placeholder={field.placeholder}
                  disabled={isCompleted}
                  {...register(field.name, { required: field.required })}
                />
              )}

              {errors[field.name] && (
                <p className="text-xs font-semibold text-destructive">This validation parameter is mandatory.</p>
              )}
            </div>
          ))}
        </div>

        {!isCompleted && (
          <Button type="submit" className="w-full h-11 text-sm font-medium" disabled={isSubmitting}>
            {isSubmitting ? 'Syncing Playbook Ledger...' : 'Complete Task & Claim XP'}
          </Button>
        )}
      </form>
    </div>
  );
}