import { API_BASE_URL, COLORS, EXAM_TYPES, GRADES, SUBJECTS } from '../constants';

export function getSubjectMeta(subjectId?: string) {
  return SUBJECTS.find((subject) => subject.id === subjectId) || SUBJECTS[0];
}

export function getGradeLabel(grade?: number) {
  return GRADES.find((item) => item.value === grade)?.label || `${grade || 1}年级`;
}

export function getExamTypeLabel(examType?: string) {
  return EXAM_TYPES.find((item) => item.value === examType)?.label || '练习题';
}

export function getStatusMeta(status?: string) {
  switch (status) {
    case 'analyzed':
      return {
        label: '已分析',
        color: COLORS.success,
        backgroundColor: '#DDF6EC'
      };
    case 'processing':
      return {
        label: '分析中',
        color: COLORS.warning,
        backgroundColor: '#FEF3C7'
      };
    case 'failed':
      return {
        label: '分析失败',
        color: COLORS.error,
        backgroundColor: '#FEE2E2'
      };
    default:
      return {
        label: '待分析',
        color: COLORS.textSecondary,
        backgroundColor: '#E0ECFF'
      };
  }
}

export function getImageUrl(path?: string) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${API_BASE_URL}/${path}`;
}

export function formatPercent(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0%';
  }

  const normalized = value > 1 ? value : value * 100;
  return `${Math.round(normalized)}%`;
}
