// components/program/tasks/index.ts
import { ProfileSetupForm } from './ProfileSetupForm';
import { MotivationForm } from './MotivationForm';
import { ConstraintForm } from './ConstraintForm';
import { AskSimulator } from './AskSimulator';
import { KnownReachoutWidget } from './KnownReachoutWidget';
import { DigitalPresenceWidget } from './DigitalPresenceWidget';
import { ObservationNotepad } from './ObservationNotepad';
import { BaseTaskComponentProps } from './types';
import { OpportunityForm } from './opportunity/OpportunityForm';
import { CustomerAvatarForm } from './project/CustomerAvatarForm';
import { InterviewSynthesisForm } from './project/InterviewSynthesisForm';
import { OpportunityListReview } from './opportunity/OpportunityListReview';
import { OpportunityScorer } from './opportunity/OpportunityScorer';
import { OpportunityValidator } from './opportunity/OpportunityValidator';
import { ProjectCreationForm } from './project/ProjectCreationForm';
import { SimpleActionWidget } from './SimpleActionWidget';


export const TaskComponentMap: Record<string, React.ComponentType<BaseTaskComponentProps>> = {
  //mission 1
  ProfileSetupForm,
  MotivationForm,
  ConstraintForm,
  AskSimulator,
  KnownReachoutWidget,
  DigitalPresenceWidget,
  //mission 2
  ObservationNotepad,
  OpportunityForm,
  OpportunityListReview,
  OpportunityValidator,
  OpportunityScorer,
  ProjectCreationForm,
  // mission 3
  SimpleActionWidget,
  CustomerAvatarForm,
  InterviewSynthesisForm,
};

export type { BaseTaskComponentProps } from './types';