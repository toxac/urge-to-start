// components/program/tasks/index.ts

import { ProfileSetupForm } from './ProfileSetupForm';
import { MotivationForm } from './MotivationForm';
import { ConstraintForm } from './ConstraintForm'; 
import { AskSimulator } from './AskSimulator';
import { KnownReachoutWidget } from './KnownReachoutWidget';
import { DigitalPresenceWidget } from './DigitalPresenceWidget';

export const TaskComponentMap: Record<string, React.ComponentType<any>> = {
  ProfileSetupForm: ProfileSetupForm,
  MotivationForm: MotivationForm,
  ConstraintForm: ConstraintForm,
  AskSimulator: AskSimulator,
  KnownReachoutWidget: KnownReachoutWidget,
  DigitalPresenceWidget: DigitalPresenceWidget
};