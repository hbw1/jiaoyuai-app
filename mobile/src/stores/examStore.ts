import { create } from 'zustand';
import { Exam } from '../types';
import { examApi, analysisApi } from '../services/api';

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  isLoading: boolean;
  error: string | null;
  
  fetchExams: (params?: { page?: number; limit?: number; subject?: string; status?: string }) => Promise<void>;
  fetchExamById: (id: string) => Promise<void>;
  uploadExam: (formData: FormData) => Promise<Exam>;
  deleteExam: (id: string) => Promise<void>;
  analyzeExam: (examId: string) => Promise<void>;
  clearCurrentExam: () => void;
  clearError: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: [],
  currentExam: null,
  isLoading: false,
  error: null,

  fetchExams: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await examApi.getList(params);
      
      if (response.data.status === 'success' && response.data.data) {
        set({
          exams: response.data.data.exams as Exam[],
          isLoading: false
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '获取试卷列表失败',
        isLoading: false
      });
    }
  },

  fetchExamById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await examApi.getById(id);
      
      if (response.data.status === 'success' && response.data.data) {
        set({
          currentExam: response.data.data.exam as Exam,
          isLoading: false
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '获取试卷详情失败',
        isLoading: false
      });
    }
  },

  uploadExam: async (formData: FormData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await examApi.upload(formData);
      
      if (response.data.status === 'success' && response.data.data) {
        const newExam = response.data.data.exam as Exam;
        set((state) => ({
          exams: [newExam, ...state.exams],
          currentExam: newExam,
          isLoading: false
        }));
        return newExam;
      }
      throw new Error('上传失败');
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '上传试卷失败',
        isLoading: false
      });
      throw error;
    }
  },

  deleteExam: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await examApi.delete(id);
      
      set((state) => ({
        exams: state.exams.filter((exam) => exam.id !== id),
        currentExam: state.currentExam?.id === id ? null : state.currentExam,
        isLoading: false
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '删除试卷失败',
        isLoading: false
      });
      throw error;
    }
  },

  analyzeExam: async (examId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await analysisApi.analyze(examId);
      
      if (response.data.status === 'success' && response.data.data) {
        const currentExam = get().currentExam;
        if (!currentExam) return;
        
        const updatedExam: Exam = {
          ...currentExam,
          analysisResult: response.data.data.analysisResult,
          status: 'analyzed'
        };
        
        set((state) => ({
          currentExam: updatedExam,
          exams: state.exams.map((exam) =>
            exam.id === examId ? updatedExam : exam
          ),
          isLoading: false
        }));
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '分析失败',
        isLoading: false
      });
      throw error;
    }
  },

  clearCurrentExam: () => set({ currentExam: null }),
  
  clearError: () => set({ error: null })
}));
