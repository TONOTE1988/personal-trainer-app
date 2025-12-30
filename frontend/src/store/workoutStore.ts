import { create } from 'zustand';
import { apiClient } from '../api/client';
import { GenerateParams, Workout, WorkoutMenu } from '../types';

interface WorkoutState {
  currentWorkout: (Workout & { content?: WorkoutMenu }) | null;
  generateParams: GenerateParams | null;
  isGenerating: boolean;
  history: Workout[];
  historyTotal: number;
  isLoadingHistory: boolean;
  error: string | null;
  setGenerateParams: (params: GenerateParams) => void;
  generate: () => Promise<boolean>;
  clearCurrentWorkout: () => void;
  loadHistory: (offset?: number) => Promise<void>;
  loadWorkoutDetail: (id: string) => Promise<void>;
  saveToHistory: (workout: Workout & { content?: WorkoutMenu }) => void;
  deleteWorkout: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentWorkout: null,
  generateParams: null,
  isGenerating: false,
  history: [],
  historyTotal: 0,
  isLoadingHistory: false,
  error: null,

  setGenerateParams: (params) => set({ generateParams: params }),

  generate: async () => {
    const { generateParams } = get();
    if (!generateParams) {
      set({ error: 'Please fill in all required fields' });
      return false;
    }

    set({ isGenerating: true, error: null });
    try {
      const result = await apiClient.generateWorkout(generateParams);
      const workout: Workout & { content: WorkoutMenu } = {
        id: result.workout.id,
        type: 'generated',
        title: result.workout.title,
        content: {
          title: result.workout.title,
          description: result.workout.description,
          warmup: result.workout.warmup,
          main: result.workout.main,
          cooldown: result.workout.cooldown,
          totalTime: result.workout.totalTime,
          calorieEstimate: result.workout.calorieEstimate,
          warnings: result.workout.warnings,
        },
        params: generateParams,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({ currentWorkout: workout, isGenerating: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to generate', isGenerating: false });
      return false;
    }
  },

  clearCurrentWorkout: () => set({ currentWorkout: null }),

  loadHistory: async (offset = 0) => {
    set({ isLoadingHistory: true, error: null });
    try {
      const result = await apiClient.getWorkouts({ limit: 20, offset });
      if (offset === 0) {
        set({ history: result.workouts, historyTotal: result.total, isLoadingHistory: false });
      } else {
        const { history } = get();
        set({ history: [...history, ...result.workouts], historyTotal: result.total, isLoadingHistory: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load', isLoadingHistory: false });
    }
  },

  loadWorkoutDetail: async (id: string) => {
    set({ isGenerating: true, error: null });
    try {
      const result = await apiClient.getWorkout(id);
      set({ currentWorkout: { ...result, type: result.type as 'generated' | 'template' }, isGenerating: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load', isGenerating: false });
    }
  },

  saveToHistory: (workout) => {
    const { history } = get();
    set({ history: [workout, ...history] });
  },

  deleteWorkout: async (id: string) => {
    try {
      await apiClient.deleteWorkout(id);
      const { history } = get();
      set({ history: history.filter((w) => w.id !== id) });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

