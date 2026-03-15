import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, grade?: number) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  resetAuth: () => Promise<void>;
}

interface AuthResponseData {
  user: User;
  token: string;
}

interface ProfileResponseData {
  user: User;
}

type PersistedAuthState = Pick<AuthState, 'user' | 'token' | 'isAuthenticated'>;

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.login<AuthResponseData>({ email, password });
          const data = response;
          
          if (data?.status === 'success' && data?.data) {
            await AsyncStorage.setItem('token', data.data.token);
            set({
              user: data.data.user as User,
              token: data.data.token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            const msg = data?.message || '登录失败：服务器响应格式错误';
            set({ isLoading: false, error: msg });
            throw new Error(msg);
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || '登录失败';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, grade?: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.register<AuthResponseData>({ name, email, password, grade });
          const data = response;
          
          if (data?.status === 'success' && data?.data) {
            await AsyncStorage.setItem('token', data.data.token);
            set({
              user: data.data.user as User,
              token: data.data.token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            const msg = data?.message || '注册失败：服务器响应格式错误';
            set({ isLoading: false, error: msg });
            throw new Error(msg);
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || '注册失败';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('auth-storage');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      loadUser: async () => {
        try {
          set({ isLoading: true });
          const response = await authApi.getProfile<ProfileResponseData>();
          const data = response;
          
          if (data?.status === 'success' && data?.data) {
            set({
              user: data.data.user as User,
              isAuthenticated: true,
              isLoading: false
            });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.updateProfile<ProfileResponseData>(data);
          const responseData = response;
          
          if (responseData?.status === 'success' && responseData?.data) {
            set({
              user: responseData.data.user as User,
              isLoading: false
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || '更新失败',
            isLoading: false
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      resetAuth: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('auth-storage');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): PersistedAuthState => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  ) as any
);
