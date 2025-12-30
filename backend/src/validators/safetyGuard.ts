import { WorkoutMenu, GenerateParams } from '../services/llm/interface';

export interface SafetyCheckResult {
  isValid: boolean;
  violations: string[];
  sanitizedMenu?: WorkoutMenu;
}

export function validateWorkoutSafety(
  menu: WorkoutMenu,
  params: GenerateParams
): SafetyCheckResult {
  const violations: string[] = [];
  
  // 簡易的な検証（本番ではより詳細に）
  if (params.restrictions.includes('knee')) {
    for (const ex of menu.main) {
      if (ex.name.includes('ジャンプ') || ex.name.includes('ボックス')) {
        violations.push(`膝の制約に違反: "${ex.name}"`);
      }
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    sanitizedMenu: violations.length > 0 ? menu : undefined,
  };
}

export function validateGenerateParams(params: unknown): {
  valid: boolean;
  errors: string[];
  data?: GenerateParams;
} {
  const errors: string[] = [];
  const data = params as Record<string, unknown>;

  const validGoals = ['strength', 'weightLoss', 'endurance', 'performance'];
  if (!validGoals.includes(data.goal as string)) {
    errors.push(`Invalid goal`);
  }

  const validDurations = [15, 30, 45, 60];
  if (!validDurations.includes(data.duration as number)) {
    errors.push(`Invalid duration`);
  }

  const validLocations = ['home', 'gym'];
  if (!validLocations.includes(data.location as string)) {
    errors.push(`Invalid location`);
  }

  const validEquipment = ['none', 'dumbbells', 'machines', 'barbell'];
  if (!validEquipment.includes(data.equipment as string)) {
    errors.push(`Invalid equipment`);
  }

  if (!Array.isArray(data.restrictions)) {
    errors.push('restrictions must be an array');
  }

  if (typeof data.frequency !== 'number' || data.frequency < 1 || data.frequency > 7) {
    errors.push('frequency must be 1-7');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? (data as GenerateParams) : undefined,
  };
}

