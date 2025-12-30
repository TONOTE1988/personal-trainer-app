export interface GenerateParams {
  goal: 'strength' | 'weightLoss' | 'endurance' | 'performance';
  duration: 15 | 30 | 45 | 60;
  location: 'home' | 'gym';
  equipment: 'none' | 'dumbbells' | 'machines' | 'barbell';
  restrictions: ('knee' | 'back' | 'shoulder' | 'none')[];
  frequency: number;
}

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

export interface LLMService {
  generateWorkout(params: GenerateParams): Promise<WorkoutMenu>;
}

export async function createLLMService(): Promise<LLMService> {
  const provider = process.env.LLM_PROVIDER || 'dummy';

  if (provider === 'openai') {
    const { OpenAILLMService } = await import('./openai');
    return new OpenAILLMService();
  }
  
  const { DummyLLMService } = await import('./dummy');
  return new DummyLLMService();
}

