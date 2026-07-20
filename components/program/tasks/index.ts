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
import { UnfairAdvantageForm } from './project/UnfairAdvantageForm';
import { PositioningStatementForm } from './project/PositioningStatementForm';
import { ComplianceChecklist } from './project/ComplainceChecklist';
import { GoNoGoDecisionForm } from './project/GoNoGoDecisionForm';
import { CoreProblemForm } from './project/CoreProblemForm';
import { SolutionSpaceForm } from './project/SolutionSpaceForm';
import { SolutionPathForm } from './project/SolutionPathForm';
import { MSPDefinitionForm } from './project/MSPDefinitionForm';
import { MSPCanvasForm } from './project/MSPCanvasForm';


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
  UnfairAdvantageForm,
  PositioningStatementForm,
  ComplianceChecklist,
  GoNoGoDecisionForm,
  CoreProblemForm,
  SolutionSpaceForm,
  SolutionPathForm,
  MSPDefinitionForm,
  MSPCanvasForm,
};

export type { BaseTaskComponentProps } from './types';