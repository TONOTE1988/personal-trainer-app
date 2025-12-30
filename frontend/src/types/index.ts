export type Goal = 'strength' | 'weightLoss' | 'endurance' | 'performance';
export type Duration = 15 | 30 | 45 | 60;
export type Location = 'home' | 'gym';
export type Equipment = 'none' | 'dumbbells' | 'machines' | 'barbell';
export type Restriction = 'knee' | 'back' | 'shoulder' | 'none';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutMenu {
  title: string;
  description: string;
  warmup: Exercise[];
  main: Exercise[];
  cooldown: Exercise[];
  totalTime: number;
  calorieEstimate?: number;
  warnings: string[];
}

export interface GenerateParams {
  goal: Goal;
  duration: Duration;
  location: Location;
  equipment: Equipment;
  restrictions: Restriction[];
  frequency: number;
}

export interface Workout {
  id: string;
  type: 'generated' | 'template';
  templateId?: string;
  title: string;
  content?: WorkoutMenu;
  params?: GenerateParams;
  createdAt: string;
  updatedAt: string;
}

export type TemplateCategory =
  | 'home15min'
  | 'gymUpperPush'
  | 'gymUpperPull'
  | 'lowerKneeFriendly'
  | 'coreBackFriendly'
  | 'lowImpactHIIT';

export interface WorkoutTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  description: string;
  duration: number;
  level: Level;
  location: Location;
  equipment: Equipment[];
  menu: {
    beginner: WorkoutMenu;
    intermediate: WorkoutMenu;
    advanced: WorkoutMenu;
  };
}

