export type MascotType = 'dragon' | 'fox' | 'sprout' | 'robot';

export type MascotStage = 'baby' | 'child' | 'teen' | 'adult';

export type MascotMood = 'happy' | 'excited' | 'calm' | 'concerned' | 'celebrating' | 'sleeping';

export interface Mascot {
  type: MascotType;
  name: string;
  stage: MascotStage;
  mood: MascotMood;
  accessories: string[];
}

export type DayStatus = 'smoke-free' | 'slip' | 'relapse' | 'pre-quit' | 'future';

export interface DayLog {
  date: string;
  status: DayStatus;
  mood?: number;
  triggers?: string[];
  notes?: string;
  cravingsCount?: number;
}

export interface UserProfile {
  id: string;
  age?: string;
  gender?: string;
  country?: string;
  cigarettesPerDay: number;
  yearsSmoked: number;
  costPerPack: number;
  cigarettesPerPack: number;
  quitDate: string;
  triggers: string[];
  motivations: string[];
  mascot: Mascot;
}

export interface Streak {
  current: number;
  longest: number;
  totalSmokeFree: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

export interface HealthMilestone {
  id: string;
  title: string;
  description: string;
  daysRequired: number;
  achieved: boolean;
  achievedDate?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
}

export type OnboardingStep = 
  | 'welcome'
  | 'consent'
  | 'about-you'
  | 'smoking-profile'
  | 'goal'
  | 'mascot'
  | 'summary';
