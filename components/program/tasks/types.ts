// components/program/tasks/types.ts
import { TaskSchema } from '@/types/playbook';

export interface BaseTaskComponentProps {
  /** Full task object from playbook */
  task: TaskSchema;
  /** Current user ID for storage operations */
  userId: string;
  /** Existing progress data if task was previously started/completed */
  existingProgress?: {
    id: string;
    status: 'not_started' | 'in_progress' | 'completed' | string;
    saved_payload?: any;
  };
  /** Callback when task is successfully completed */
  onSuccess?: () => void;
}