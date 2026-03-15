import Constants from 'expo-constants';

const devHost =
  Constants.expoConfig?.hostUri?.split(':')[0] ||
  (Constants as any).manifest2?.extra?.expoClient?.hostUri?.split(':')[0] ||
  'localhost';

const configuredApiUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  (Constants as any).manifest2?.extra?.expoClient?.apiUrl;

export const API_URL = configuredApiUrl || `http://${devHost}:3001/api`;

export const API_BASE_URL = API_URL.replace(/\/api$/, '');

export const COLORS = {
  primary: '#4C8DFF',
  primaryDeep: '#1D4ED8',
  secondary: '#0F274A',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#EEF6FF',
  backgroundAlt: '#DCEAFE',
  surface: '#F8FBFF',
  surfaceStrong: '#E6F0FF',
  text: '#10233F',
  textSecondary: '#5E7697',
  border: '#C7DBF7',
  white: '#FFFFFF',
  shadow: '#0F274A'
};

export const SUBJECTS = [
  { id: 'math', name: '数学', icon: '△', color: '#4C8DFF' },
  { id: 'chinese', name: '语文', icon: '文', color: '#2563EB' },
  { id: 'english', name: '英语', icon: 'Ab', color: '#0EA5E9' },
  { id: 'physics', name: '物理', icon: 'Fx', color: '#1D4ED8' },
  { id: 'chemistry', name: '化学', icon: 'H2', color: '#38BDF8' },
  { id: 'biology', name: '生物', icon: 'DNA', color: '#0284C7' }
];

export const GRADES = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i < 6 ? '小学' : i < 9 ? '初中' : '高中'}${i < 6 ? i + 1 : i - 5}年级`
}));

export const EXAM_TYPES = [
  { value: 'unit_test', label: '单元测试' },
  { value: 'midterm', label: '期中考试' },
  { value: 'final', label: '期末考试' },
  { value: 'homework', label: '课后作业' },
  { value: 'practice', label: '练习题' }
];

export const MASTERY_STATUS = {
  mastered: { label: '已掌握', color: COLORS.success },
  partial: { label: '部分掌握', color: COLORS.warning },
  weak: { label: '未掌握', color: COLORS.error }
};
