import { create } from 'zustand';
import { AnalysisResult, Exam } from '../types';
import { examApi, analysisApi } from '../services/api';

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  
  fetchExams: (params?: { page?: number; limit?: number; subject?: string; status?: string }) => Promise<void>;
  fetchExamById: (id: string) => Promise<void>;
  uploadExam: (formData: FormData) => Promise<Exam>;
  deleteExam: (id: string) => Promise<void>;
  analyzeExam: (examId: string) => Promise<void>;
  clearCurrentExam: () => void;
  clearError: () => void;
}

interface ExamsListResponseData {
  exams: Exam[];
}

interface ExamDetailResponseData {
  exam: Exam;
}

interface UploadExamResponseData {
  exam: Exam;
}

interface AnalyzeExamResponseData {
  examId: string;
  analysisResult: AnalysisResult;
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: [],
  currentExam: null,
  isLoading: false,
  isUploading: false,
  error: null,

  fetchExams: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await examApi.getList<ExamsListResponseData>(params);
      
      if (response.status === 'success' && response.data) {
        set({
          exams: response.data.exams as Exam[],
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
      const response = await examApi.getById<ExamDetailResponseData>(id);
      
      if (response.status === 'success' && response.data) {
        set({
          currentExam: response.data.exam as Exam,
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
      console.log('examStore: uploadExam called');
      set({ isUploading: true, error: null });
      console.log('examStore: sending request to backend...');
      const response = await examApi.upload<UploadExamResponseData>(formData);
      console.log('examStore: backend response received:', JSON.stringify(response, null, 2));
      
      if (response && response.status === 'success' && response.data?.exam) {
        const newExam = response.data.exam as Exam;
        console.log('examStore: upload success, updating state...');
        set((state: ExamState) => ({
          exams: [newExam, ...state.exams],
          currentExam: newExam,
          isUploading: false
        }));
        return newExam;
      }
      
      console.error('examStore: upload failed logic check:', response);
      throw new Error(response?.message || '上传失败');
      
    } catch (error: any) {
      console.error('examStore: upload error caught:', error);
      const errorMessage = error.response?.data?.message || error.message || '上传试卷失败';
      set({
        error: errorMessage,
        isUploading: false
      });
      throw new Error(errorMessage);
    }
  },

  deleteExam: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await examApi.delete(id);
      
      set((state: ExamState) => ({
        exams: state.exams.filter((exam: Exam) => exam.id !== id),
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
      const response = await analysisApi.analyze<AnalyzeExamResponseData>(examId);
      
      if (response.status === 'success' && response.data) {
        const state = get();
        const baseExam =
          state.currentExam?.id === examId
            ? state.currentExam
            : state.exams.find((exam: Exam) => exam.id === examId);

        if (!baseExam) {
          set({ isLoading: false });
          return;
        }
        
        const updatedExam: Exam = {
          ...baseExam,
          analysisResult: response.data.analysisResult,
          status: 'analyzed',
          obtainedScore: response.data.analysisResult.overallScore
        };
        
        set((state: ExamState) => ({
          currentExam: state.currentExam?.id === examId ? updatedExam : state.currentExam,
          exams: state.exams.map((exam: Exam) =>
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
