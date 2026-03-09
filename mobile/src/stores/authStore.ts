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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.login({ email, password });
          
          console.log('Login response:', JSON.stringify(response.data));
          
          if (response.data.status === 'success' && response.data.data) {
            await AsyncStorage.setItem('token', response.data.data.token);
            set({
              user: response.data.data.user as User,
              token: response.data.data.token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            console.log('Login failed: unexpected response format');
            set({ isLoading: false, error: '登录失败：服务器响应格式错误' });
            throw new Error('登录失败：服务器响应格式错误');
          }
        } catch (error: any) {
          console.log('Login error:', error.message);
          const errorMessage = error.response?.data?.message || error.message || '登录失败';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, grade?: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.register({ name, email, password, grade });
          
          console.log('Register response:', JSON.stringify(response.data));
          
          if (response.data.status === 'success' && response.data.data) {
            await AsyncStorage.setItem('token', response.data.data.token);
            set({
              user: response.data.data.user as User,
              token: response.data.data.token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            console.log('Register failed: unexpected response format');
            set({ isLoading: false, error: '注册失败：服务器响应格式错误' });
            throw new Error('注册失败：服务器响应格式错误');
          }
        } catch (error: any) {
          console.log('Register error:', error.message);
          const errorMessage = error.response?.data?.message || error.message || '注册失败';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await AsyncStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      loadUser: async () => {
        try {
          set({ isLoading: true });
          const response = await authApi.getProfile();
          
          if (response.data.status === 'success' && response.data.data) {
            set({
              user: response.data.data.user as User,
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
          const response = await authApi.updateProfile(data);
          
          if (response.data.status === 'success' && response.data.data) {
            set({
              user: response.data.data.user as User,
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

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
