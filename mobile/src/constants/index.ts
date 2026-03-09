export const API_URL = 'http://localhost:3000/api';

export const COLORS = {
  primary: '#4F46E5',
  secondary: '#7C3AED',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB'
};

export const SUBJECTS = [
  { id: 'math', name: '数学', icon: '🔢', color: '#4F46E5' },
  { id: 'chinese', name: '语文', icon: '📖', color: '#7C3AED' },
  { id: 'english', name: '英语', icon: '🔤', color: '#10B981' },
  { id: 'physics', name: '物理', icon: '⚡', color: '#F59E0B' },
  { id: 'chemistry', name: '化学', icon: '🧪', color: '#EF4444' },
  { id: 'biology', name: '生物', icon: '🧬', color: '#06B6D4' }
];

export const GRADES = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i < 6 ? '小学' : i < 9 ? '初中' : '高中'}${i < 6 ? i + 1 : i - 5}${i < 6 ? '年级' : '年级'}`
}));

export const EXAM_TYPES = [
  { value: 'unit_test', label: '单元测试' },
  { value: 'midterm', label: '期中考试' },
  { value: 'final', label: '期末考试' },
  { value: 'homework', label: '课后作业' },
  { value: 'practice', label: '练习题' }
];

export const MASTERY_STATUS = {
  mastered: { label: '已掌握', color: '#10B981' },
  partial: { label: '部分掌握', color: '#F59E0B' },
  weak: { label: '未掌握', color: '#EF4444' }
};
