import { LLMService, GenerateParams, WorkoutMenu, Exercise } from './interface';

export class DummyLLMService implements LLMService {
  async generateWorkout(params: GenerateParams): Promise<WorkoutMenu> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const warmup = this.generateWarmup(params);
    const main = this.generateMainExercises(params);
    const cooldown = this.generateCooldown();
    const warnings = this.generateWarnings(params);

    const goalTitles: Record<string, string> = {
      strength: '筋力アップ',
      weightLoss: '脂肪燃焼',
      endurance: '持久力向上',
      performance: 'パフォーマンス強化',
    };

    return {
      title: `${goalTitles[params.goal]}ワークアウト（${params.duration}分）`,
      description: `${params.location === 'home' ? '自宅' : 'ジム'}で行う${params.duration}分のワークアウトです。週${params.frequency}回を目安に。`,
      warmup,
      main,
      cooldown,
      totalTime: params.duration,
      calorieEstimate: Math.round(params.duration * 5 * 1.2),
      warnings,
    };
  }

  private generateWarmup(params: GenerateParams): Exercise[] {
    const warmup: Exercise[] = [
      { name: 'マーチング', sets: 1, reps: '2分', rest: '0秒', notes: 'ゆっくり心拍数を上げる' },
    ];

    if (!params.restrictions.includes('knee')) {
      warmup.push({ name: 'ボディウェイトスクワット', sets: 1, reps: '10回', rest: '0秒', notes: '浅めで' });
    }

    return warmup;
  }

  private generateMainExercises(params: GenerateParams): Exercise[] {
    const exercises: Exercise[] = [];
    const hasKneeIssue = params.restrictions.includes('knee');
    const hasBackIssue = params.restrictions.includes('back');
    const hasShoulderIssue = params.restrictions.includes('shoulder');

    if (!hasShoulderIssue) {
      exercises.push({ name: 'プッシュアップ', sets: 3, reps: '10-12回', rest: '60秒', notes: '膝つきOK' });
    }

    if (!hasKneeIssue) {
      exercises.push({ name: 'スクワット', sets: 3, reps: '12-15回', rest: '60秒' });
    } else {
      exercises.push({ name: 'グルートブリッジ', sets: 3, reps: '15回', rest: '45秒', notes: '膝に優しい' });
    }

    if (!hasBackIssue) {
      exercises.push({ name: 'プランク', sets: 3, reps: '30秒', rest: '30秒' });
    } else {
      exercises.push({ name: 'デッドバグ', sets: 3, reps: '10回（各側）', rest: '30秒', notes: '腰に優しい' });
    }

    return exercises;
  }

  private generateCooldown(): Exercise[] {
    return [
      { name: 'ストレッチ', sets: 1, reps: '3分', rest: '0秒', notes: '全身をほぐす' },
      { name: '深呼吸', sets: 1, reps: '5回', rest: '0秒' },
    ];
  }

  private generateWarnings(params: GenerateParams): string[] {
    const warnings: string[] = [
      '⚠️ このメニューは参考情報です。医療アドバイスではありません。',
      '⚠️ 痛みが出たらすぐに中止してください。',
    ];

    if (params.restrictions.includes('knee')) {
      warnings.push('🦵 膝に配慮したメニューですが、違和感があれば中止してください。');
    }
    if (params.restrictions.includes('back')) {
      warnings.push('🔙 腰に配慮したメニューですが、痛みが出たら中止してください。');
    }

    return warnings;
  }
}

