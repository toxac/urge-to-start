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
import { CommunityWidget } from './CommunityWidget';

import { UnfairAdvantageForm } from './project/UnfairAdvantageForm';
import { PositioningStatementForm } from './project/PositioningStatementForm';
import { ComplianceChecklist } from './project/ComplainceChecklist';
import { GoNoGoDecisionForm } from './project/GoNoGoDecisionForm';
import { CoreProblemForm } from './project/CoreProblemForm';
import { SolutionSpaceForm } from './project/SolutionSpaceForm';
import { SolutionPathForm } from './project/SolutionPathForm';
import { MSPDefinitionForm } from './project/MSPDefinitionForm';
import { MSPCanvasForm } from './project/MSPCanvasForm';
import { ViabilityNumbersForm } from './project/ViabilityNumbersForm';
import { ViabilityTimelineForm } from './project/ViabilityTimelineForm';
import { FinalViabilityForm } from './project/FinalViabilityForm';

import { PricingModelsForm } from './project/PricingModelsForm';
import { SetPriceForm } from './project/SetPriceForm';
import { ChannelExplorationForm } from './project/ChannelExplorationForm';
import { AcquisitionCostForm } from './project/AcquisitionCostForm';
import { PartnerMappingForm } from './project/PartnerMappingForm';
import { PartnershipPlanForm } from './project/PartnershipPlanForm';
import { CostMappingForm } from './project/CostMappingForm';
import { UnitEconomicsForm } from './project/UnitEconomicsForm';
import { CostRealityForm } from './project/CostRealityForm';
import { BreakevenForm } from './project/BreakevenForm';
import { ScenarioPlanningForm } from './project/ScenarioPlanningForm';
import { FinalEconomicsForm } from './project/FinalEconomicsForm';

import { BuildScopeForm } from './project/BuildScopeForm';
import { RequirementsDocForm } from './project/RequirementsDocForm';
import { FirstMilestoneForm } from './project/FirstMilestoneForm';
import { SuppliesAuditForm } from './project/SuppliesAuditForm';
import { SkillsAuditForm } from './project/SkillsAuditForm';
import { BottleneckForm } from './project/BottleneckForm';
import { BuildReadinessForm } from './project/BuildReadinessForm';
import { LandingPageCheckForm } from './project/LandingPageCheckForm';
import { WaitlistForm } from './project/WaitlistForm';
import { EarlyFollowersForm } from './project/EarlyFollowersForm';
import { BuildTimelineForm } from './project/BuildTimelineForm';
import { WeeklySprintForm } from './project/WeeklySprintForm';
import { AccountabilityForm } from './project/AccountabilityForm';
import { BuildManifestoForm } from './project/BuildManifestoForm';


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
  ViabilityNumbersForm,
  ViabilityTimelineForm,
  FinalViabilityForm,
  // mission 4
  PricingModelsForm,
  SetPriceForm,
  ChannelExplorationForm,
  AcquisitionCostForm,
  PartnerMappingForm,
  PartnershipPlanForm,
  CostMappingForm,
  UnitEconomicsForm,
  CostRealityForm,
  BreakevenForm,
  ScenarioPlanningForm,
  FinalEconomicsForm,
  // mission 5
  BuildScopeForm,
  RequirementsDocForm,
  FirstMilestoneForm,
  SuppliesAuditForm,
  SkillsAuditForm,
  BottleneckForm,
  BuildReadinessForm,
  LandingPageCheckForm,
  WaitlistForm,
  EarlyFollowersForm,
  CommunityWidget,
  BuildTimelineForm,
  WeeklySprintForm,
  AccountabilityForm,
  BuildManifestoForm,

};

export type { BaseTaskComponentProps } from './types';