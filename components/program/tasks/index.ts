// components/program/tasks/index.ts
import { BaseTaskComponentProps } from './types';

// mission 1 task components
import { MotivationForm } from './mission1/MotivationForm';
import { CommitmentForm } from './mission1/CommitmentForm';
import { RoadblockForm } from './mission1/RoadblockForm';
import { SocialFootprintAForm } from './mission1/SocialFootprintAForm';
import { SkillsForm } from './mission1/SkillsForm';
import { CheerSquadForm } from './mission1/CheerSquadForm';




export const TaskComponentMap: Record<string, React.ComponentType<BaseTaskComponentProps>> = {
  //mission 1
  MotivationForm: MotivationForm,
  CommitmentForm: CommitmentForm,
  RoadblockForm: RoadblockForm, 
  SocialFootprintAForm: SocialFootprintAForm,
  SkillsForm: SkillsForm,
  CheerSquadForm: CheerSquadForm,

};

export type { BaseTaskComponentProps } from './types'; 