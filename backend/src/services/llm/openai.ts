import { LLMService, GenerateParams, WorkoutMenu } from './interface';

export class OpenAILLMService implements LLMService {
  async generateWorkout(params: GenerateParams): Promise<WorkoutMenu> {
    // 本番実装時にOpenAI APIを呼び出す。今はダミーにフォールバック
    const { DummyLLMService } = await import('./dummy');
    const dummyService = new DummyLLMService();
    return dummyService.generateWorkout(params);
  }
}

