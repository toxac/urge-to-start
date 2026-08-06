// components/program/tasks/index.ts
import { BaseTaskComponentProps } from './types';

// mission 1 task components
import { MotivationForm } from './mission1/MotivationForm';
import { CommitmentForm } from './mission1/CommitmentForm';
import { RoadblockForm } from './mission1/RoadblockForm';
import { SocialFootprintAForm } from './mission1/SocialFootprintAForm';
import { SkillsForm } from './mission1/SkillsForm';
import { CheerSquadForm } from './mission1/CheerSquadForm';
import { CommunityIntroForm } from './mission1/CommunityIntroForm';
import { OffAppActionForm } from './common/OffAppActionForm';
import { AuditForm } from './mission1/AuditForm';




export const TaskComponentMap: Record<string, React.ComponentType<BaseTaskComponentProps>> = {
  //common
  OffAppActionForm: OffAppActionForm,
  //mission 1
  MotivationForm: MotivationForm,
  CommitmentForm: CommitmentForm,
  RoadblockForm: RoadblockForm, 
  SocialFootprintAForm: SocialFootprintAForm,
  SkillsForm: SkillsForm,
  CheerSquadForm: CheerSquadForm,
  CommunityIntroForm: CommunityIntroForm,
  AuditForm: AuditForm,


};

export type { BaseTaskComponentProps } from './types'; 