import { ProfileSetupForm } from './ProfileSetupForm';
import { MotivationForm } from './MotivationForm';
import { ConstraintForm } from './ConstraintForm'; 
import { AskSimulator } from './AskSimulator';

export const TaskComponentMap: Record<string, React.ComponentType<any>> = {
  ProfileSetupForm: ProfileSetupForm,
  MotivationForm: MotivationForm,
  ConstraintForm: ConstraintForm,
  AskSimulator: AskSimulator,
};