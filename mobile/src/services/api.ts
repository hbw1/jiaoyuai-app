import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';
import { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
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
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
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
    const response = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

export const apiService = new ApiService();

export const authApi = {
  register: (data: { name: string; email: string; password: string; grade?: number }) =>
    apiService.post('/users/register', data),
  
  login: (data: { email: string; password: string }) =>
    apiService.post('/users/login', data),
  
  getProfile: () => apiService.get('/users/profile'),
  
  updateProfile: (data: any) => apiService.put('/users/profile', data)
};

export const examApi = {
  upload: (formData: FormData) => apiService.upload('/exams/upload', formData),
  
  getList: (params?: { page?: number; limit?: number; subject?: string; status?: string }) =>
    apiService.get('/exams', params),
  
  getById: (id: string) => apiService.get(`/exams/${id}`),
  
  delete: (id: string) => apiService.delete(`/exams/${id}`)
};

export const analysisApi = {
  analyze: (examId: string) => apiService.post(`/analysis/analyze/${examId}`),
  
  getResult: (examId: string) => apiService.get(`/analysis/result/${examId}`),
  
  getReport: (examId: string) => apiService.get(`/analysis/report/${examId}`)
};

export const knowledgeApi = {
  getSubjects: () => apiService.get('/knowledge/subjects'),
  
  getPoints: (subjectId: string, grade: number) =>
    apiService.get(`/knowledge/subjects/${subjectId}/grades/${grade}/points`),
  
  getPointDetail: (pointId: string) => apiService.get(`/knowledge/points/${pointId}`),
  
  getTree: (subjectId: string, grade: number) =>
    apiService.get(`/knowledge/tree/${subjectId}/${grade}`)
};
