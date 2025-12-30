import { WorkoutTemplate, WorkoutMenu } from '../types';

function createLeveledMenu(baseMenu: Omit<WorkoutMenu, 'warnings'>, warnings: string[] = []): { beginner: WorkoutMenu; intermediate: WorkoutMenu; advanced: WorkoutMenu } {
  return {
    beginner: { ...baseMenu, warnings: [...warnings, '💡 初心者向け：フォームを優先して'] },
    intermediate: { ...baseMenu, warnings },
    advanced: { ...baseMenu, warnings: [...warnings, '🔥 上級者向け：負荷が高めです'] },
  };
}

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'home15-fullbody',
    category: 'home15min',
    title: '自宅15分 全身クイックワークアウト',
    description: '器具なしで自宅で行える15分の全身トレーニング',
    duration: 15,
    level: 'intermediate',
    location: 'home',
    equipment: ['none'],
    menu: createLeveledMenu({
      title: '自宅15分 全身クイックワークアウト',
      description: '短時間で効率よく全身を動かすメニューです',
      warmup: [
        { name: 'マーチング', sets: 1, reps: '1分', rest: '0秒' },
        { name: 'アームサークル', sets: 1, reps: '20回', rest: '0秒' },
      ],
      main: [
        { name: 'プッシュアップ', sets: 3, reps: '10回', rest: '30秒', notes: '膝つきOK' },
        { name: 'スクワット', sets: 3, reps: '15回', rest: '30秒' },
        { name: 'プランク', sets: 2, reps: '30秒', rest: '20秒' },
      ],
      cooldown: [
        { name: 'ストレッチ', sets: 1, reps: '2分', rest: '0秒' },
      ],
      totalTime: 15,
      calorieEstimate: 100,
    }),
  },
  {
    id: 'gym-upper-push',
    category: 'gymUpperPush',
    title: 'ジム上半身プッシュ',
    description: '胸・肩・三頭筋を鍛えるプッシュ系ワークアウト',
    duration: 45,
    level: 'intermediate',
    location: 'gym',
    equipment: ['dumbbells', 'machines', 'barbell'],
    menu: createLeveledMenu({
      title: 'ジム上半身プッシュ',
      description: 'プッシュ系で上半身を鍛えます',
      warmup: [
        { name: 'トレッドミル', sets: 1, reps: '5分', rest: '0秒' },
      ],
      main: [
        { name: 'ベンチプレス', sets: 4, reps: '8-10回', rest: '90秒' },
        { name: 'ショルダープレス', sets: 3, reps: '10回', rest: '75秒' },
        { name: 'サイドレイズ', sets: 3, reps: '12-15回', rest: '60秒' },
      ],
      cooldown: [
        { name: '胸のストレッチ', sets: 1, reps: '30秒', rest: '0秒' },
      ],
      totalTime: 45,
      calorieEstimate: 250,
    }),
  },
  {
    id: 'low-impact-hiit',
    category: 'lowImpactHIIT',
    title: '低衝撃HIIT',
    description: 'ジャンプなし！関節に優しい高強度インターバル',
    duration: 20,
    level: 'intermediate',
    location: 'home',
    equipment: ['none'],
    menu: createLeveledMenu({
      title: '低衝撃HIIT',
      description: 'ジャンプなしで心拍数を上げるHIIT',
      warmup: [
        { name: 'マーチング', sets: 1, reps: '2分', rest: '0秒' },
      ],
      main: [
        { name: 'ステップアウトスクワット', sets: 4, reps: '30秒', rest: '15秒' },
        { name: 'マウンテンクライマー', sets: 4, reps: '30秒', rest: '15秒' },
        { name: 'プランクショルダータップ', sets: 4, reps: '30秒', rest: '15秒' },
      ],
      cooldown: [
        { name: '深呼吸', sets: 1, reps: '1分', rest: '0秒' },
      ],
      totalTime: 20,
      calorieEstimate: 150,
    }, ['💨 低衝撃でも効果的！']),
  },
];

export const categoryInfo: Record<string, { name: string; icon: string; description: string }> = {
  home15min: { name: '自宅15分', icon: '🏠', description: '忙しい日でもサクッと' },
  gymUpperPush: { name: '上半身プッシュ', icon: '💪', description: '胸・肩・三頭筋' },
  gymUpperPull: { name: '上半身プル', icon: '🏋️', description: '背中・二頭筋' },
  lowerKneeFriendly: { name: 'ひざ優しめ', icon: '🦵', description: '膝に配慮' },
  coreBackFriendly: { name: '腰やさしい体幹', icon: '🔙', description: '腰を守りながら' },
  lowImpactHIIT: { name: '低衝撃HIIT', icon: '⚡', description: 'ジャンプなし' },
};

export function getTemplateById(id: string): WorkoutTemplate | undefined {
  return workoutTemplates.find((t) => t.id === id);
}

