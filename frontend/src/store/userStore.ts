import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';

interface UserState {
  userId: string | null;
  ticketBalance: number;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  purchaseTickets: (productId?: string, quantity?: number) => Promise<boolean>;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      ticketBalance: 0,
      isLoading: false,
      error: null,

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          let { userId } = get();

          if (!userId) {
            const result = await apiClient.createAnonymousUser();
            userId = result.id;
            apiClient.setUserId(userId);
            set({ userId, ticketBalance: result.ticketBalance, isLoading: false });
          } else {
            apiClient.setUserId(userId);
            try {
              const me = await apiClient.getMe();
              set({ ticketBalance: me.ticketBalance, isLoading: false });
            } catch {
              const result = await apiClient.createAnonymousUser();
              userId = result.id;
              apiClient.setUserId(userId);
              set({ userId, ticketBalance: result.ticketBalance, isLoading: false });
            }
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to initialize', isLoading: false });
        }
      },

      refreshBalance: async () => {
        const { userId } = get();
        if (!userId) return;
        try {
          const result = await apiClient.getTicketBalance();
          set({ ticketBalance: result.balance });
        } catch (error) {
          console.error('Failed to refresh balance:', error);
        }
      },

      purchaseTickets: async (productId?: string, quantity?: number) => {
        set({ isLoading: true, error: null });
        try {
          const result = await apiClient.purchaseTickets(productId, quantity);
          set({ ticketBalance: result.newBalance, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to purchase', isLoading: false });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ userId: state.userId }),
    }
  )
);

