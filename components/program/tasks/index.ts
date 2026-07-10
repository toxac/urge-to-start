// components/program/tasks/index.ts
import { ProfileSetupForm } from './ProfileSetupForm';
import { MotivationForm } from './MotivationForm';
import { ConstraintForm } from './ConstraintForm';
import { AskSimulator } from './AskSimulator';
import { KnownReachoutWidget } from './KnownReachoutWidget';
import { DigitalPresenceWidget } from './DigitalPresenceWidget';
import { ObservationNotepad } from './ObservationNotepad';
import { BaseTaskComponentProps } from './types';

export const TaskComponentMap: Record<string, React.ComponentType<BaseTaskComponentProps>> = {
  ProfileSetupForm,
  MotivationForm,
  ConstraintForm,
  AskSimulator,
  KnownReachoutWidget,
  DigitalPresenceWidget,
  ObservationNotepad,
};

export type { BaseTaskComponentProps } from './types';