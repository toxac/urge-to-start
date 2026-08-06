// components/program/tasks/index.ts
import { BaseTaskComponentProps } from './types';

// mission 1 task components
import { MotivationForm } from './mission1/MotivationForm';
import { CommitmentForm } from './mission1/CommitmentForm';
import { RoadblockForm } from './mission1/RoadblockForm';




export const TaskComponentMap: Record<string, React.ComponentType<BaseTaskComponentProps>> = {
  //mission 1
  MotivationForm: MotivationForm,
  CommitmentForm: CommitmentForm,
  RoadblockForm: RoadblockForm, 

};

export type { BaseTaskComponentProps } from './types'; 