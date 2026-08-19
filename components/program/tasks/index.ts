// components/program/tasks/index.ts
import { BaseTaskComponentProps } from './types';

// mission 1 task components
import { MotivationForm } from './mission1/MotivationForm';
import { CommitmentForm } from './mission1/CommitmentForm';
import { RoadblockForm } from './mission1/RoadblockForm';
import { SocialFootprintForm } from './mission1/SocialFootprintForm';
import { SkillsForm } from './mission1/SkillsForm';
import { CheerSquadForm } from './mission1/CheerSquadForm';
import { CommunityIntroForm } from './mission1/CommunityIntroForm';
import { OffAppActionForm } from './common/OffAppActionForm';
import { AuditForm } from './mission1/AuditForm';

// mission 2 task components
import { ObservationForm } from './common/ObservationForm';
import { OpportunityForm } from './mission2/OpportunityForm';
import { OpportunityScoringForm } from './mission2/OpportunityScoringForm';
import { OpportunityPickerForm } from './mission2/OpportunityPickerForm';
import { DecisionGateForm } from './mission2/DecisionGateForm';

// mission 3 task components
import { CustomerInterviewLogger } from './mission3/CustomerInterviewLogger';
import { ProblemDefinitionForm } from './mission3/ProblemDefinitionForm';
import { CustomerPersonaForm } from './mission3/CustomerPersonaForm';
import { SolutionTypeForm } from './mission3/SolutionTypeForm';
import { MSPDefinitionForm } from './mission3/MSPDefinitionForm';
import { MSPBuildForm } from './mission3/MSPBuildForm';
import { LandscapeForm } from './mission3/LandscapeForm';
import { ComplianceForm } from './mission3/ComplainceChecklist';
import { ViabilityCheckForm } from './mission3/ViabilityCheckForm';
import { WorstCaseForm } from './mission3/WorstCaseForm';
import { ViabilityDecisionGateForm } from './mission3/ViabilityDecisionGateForm';

// mission 4 components
import { ValuePropositionForm } from './mission4/ValuePropositionForm';
import { FeatureBrainstormForm } from './mission4/FeatureBrainstormForm';
import { FeaturePrioritizationForm } from './mission4/FeaturePrioritizationForm';
import { CustomerJourneyForm } from './mission4/CustomerJourneyForm';
import { UnitCostForm } from './mission4/UnitCostForm';


export const TaskComponentMap: Record<string, React.ComponentType<BaseTaskComponentProps>> = {
  //common
  OffAppActionForm: OffAppActionForm,
  //mission 1
  MotivationForm: MotivationForm,
  CommitmentForm: CommitmentForm,
  RoadblockForm: RoadblockForm,
  SocialFootprintForm: SocialFootprintForm,
  SkillsForm: SkillsForm,
  CheerSquadForm: CheerSquadForm,
  CommunityIntroForm: CommunityIntroForm,
  AuditForm: AuditForm,
  //mission 2
  ObservationForm: ObservationForm,
  OpportunityForm: OpportunityForm,
  OpportunityScoringForm: OpportunityScoringForm,
  OpportunityPickerForm: OpportunityPickerForm,
  DecisionGateForm: DecisionGateForm,
  //mission 3
  CustomerInterviewLogger: CustomerInterviewLogger,
  ProblemDefinitionForm: ProblemDefinitionForm,
  CustomerPersonaForm: CustomerPersonaForm,
  SolutionTypeForm: SolutionTypeForm,
  MSPDefinitionForm: MSPDefinitionForm,
  MSPBuildForm: MSPBuildForm,
  LandscapeForm: LandscapeForm,
  ComplianceForm: ComplianceForm,
  ViabilityCheckForm: ViabilityCheckForm,
  WorstCaseForm: WorstCaseForm,
  ViabilityDecisionGateForm: ViabilityDecisionGateForm,
  //mission 4
  ValuePropositionForm: ValuePropositionForm,
  FeatureBrainstormForm: FeatureBrainstormForm,
  FeaturePrioritizationForm: FeaturePrioritizationForm,
  CustomerJourneyForm: CustomerJourneyForm,
  UnitCostForm: UnitCostForm,




};

export type { BaseTaskComponentProps } from './types'; 