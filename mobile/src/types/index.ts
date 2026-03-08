export interface User {
  id: string;
  name: string;
  email: string;
  grade: number;
  subjects: string[];
  learningGoals: LearningGoal[];
  role: 'student' | 'teacher' | 'parent';
  createdAt: string;
}

export interface LearningGoal {
  subject: string;
  target: string;
  deadline?: string;
}

export interface Exam {
  id: string;
  subject: string;
  grade: number;
  examType: ExamType;
  images: string[];
  title: string;
  totalScore: number;
  obtainedScore: number;
  status: ExamStatus;
  analysisResult?: AnalysisResult;
  thinkingAbility?: ThinkingAbility;
  questions: Question[];
  createdAt: string;
}

export type ExamType = 'unit_test' | 'midterm' | 'final' | 'homework' | 'practice';
export type ExamStatus = 'pending' | 'processing' | 'analyzed' | 'failed';

export interface Question {
  id: string;
  questionNumber: number;
  content: string;
  type: QuestionType;
  knowledgePoints: string[];
  difficulty: number;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  options?: QuestionOption[];
  explanation?: string;
  imageUrl?: string;
}

export type QuestionType = 'choice' | 'fill_blank' | 'short_answer' | 'essay' | 'calculation';

export interface QuestionOption {
  label: string;
  content: string;
}

export interface AnalysisResult {
  overallScore: number;
  accuracy: number;
  knowledgeMastery: Record<string, KnowledgeMastery>;
  weakPoints: string[];
  recommendations: string[];
}

export interface KnowledgeMastery {
  mastery: number;
  status: 'mastered' | 'partial' | 'weak';
  relatedQuestions: string[];
}

export interface ThinkingAbility {
  understanding: number;
  application: number;
  analysis: number;
  synthesis: number;
}

export interface KnowledgePoint {
  id: string;
  name: string;
  description: string;
  subject: string;
  grade: number;
  parentId?: string;
  prerequisites: string[];
  difficulty: number;
  keywords: string;
  examples: { question: string; answer: string }[];
  isActive: boolean;
}

export interface LearningPlan {
  id: string;
  userId: string;
  targetKnowledgePoints: TargetKnowledgePoint[];
  exercises: Exercise[];
  progress: number;
  estimatedTime: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
}

export interface TargetKnowledgePoint {
  pointId: string;
  pointName: string;
  priority: number;
  estimatedTime: number;
}

export interface Exercise {
  questionId: string;
  knowledgePoint: string;
  difficulty: number;
  completed: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
