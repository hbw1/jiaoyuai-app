import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';
import { ApiResponse } from '../types';
import { useAuthStore } from '../stores/authStore';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = (axios as any).create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await (useAuthStore as any).getState().resetAuth();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url);
    return response.data;
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    console.log('API upload called for url:', url);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    const data = await response.json();
    console.log('API upload response received');

    if (response.status === 401) {
      await (useAuthStore as any).getState().resetAuth();
    }

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data
        },
        message: data?.message || '上传失败'
      };
    }

    return data as ApiResponse<T>;
  }
}

export const apiService = new ApiService();

export const authApi = {
  register: <T>(data: { name: string; email: string; password: string; grade?: number }) =>
    apiService.post<T>('/users/register', data),
  
  login: <T>(data: { email: string; password: string }) =>
    apiService.post<T>('/users/login', data),
  
  getProfile: <T>() => apiService.get<T>('/users/profile'),
  
  updateProfile: <T>(data: any) => apiService.put<T>('/users/profile', data)
};

export const examApi = {
  upload: <T>(formData: FormData) => apiService.upload<T>('/exams/upload', formData),
  
  getList: <T>(params?: { page?: number; limit?: number; subject?: string; status?: string }) =>
    apiService.get<T>('/exams', params),
  
  getById: <T>(id: string) => apiService.get<T>(`/exams/${id}`),
  
  delete: <T>(id: string) => apiService.delete<T>(`/exams/${id}`)
};

export const analysisApi = {
  analyze: <T>(examId: string) => apiService.post<T>(`/analysis/analyze/${examId}`),
  
  getResult: <T>(examId: string) => apiService.get<T>(`/analysis/result/${examId}`),
  
  getReport: <T>(examId: string) => apiService.get<T>(`/analysis/report/${examId}`)
};

export const knowledgeApi = {
  getSubjects: () => apiService.get('/knowledge/subjects'),
  
  getPoints: (subjectId: string, grade: number) =>
    apiService.get(`/knowledge/subjects/${subjectId}/grades/${grade}/points`),
  
  getPointDetail: (pointId: string) => apiService.get(`/knowledge/points/${pointId}`),
  
  getTree: (subjectId: string, grade: number) =>
    apiService.get(`/knowledge/tree/${subjectId}/${grade}`)
};
