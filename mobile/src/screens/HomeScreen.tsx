import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { useExamStore } from '../stores/examStore';
import { COLORS, SUBJECTS } from '../constants';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Upload: undefined;
  Exams: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const { exams, fetchExams } = useExamStore();

  useEffect(() => {
    fetchExams({ limit: 5 });
  }, []);

  const recentExams = exams.slice(0, 3);
  const analyzedCount = exams.filter(e => e.status === 'analyzed').length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>你好，{user?.name || '同学'} 👋</Text>
        <Text style={styles.subtitle}>今天想学习什么？</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{exams.length}</Text>
          <Text style={styles.statLabel}>上传试卷</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{analyzedCount}</Text>
          <Text style={styles.statLabel}>已分析</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user?.grade || 1}</Text>
          <Text style={styles.statLabel}>年级</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>选择学科</Text>
        <View style={styles.subjectsGrid}>
          {SUBJECTS.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[styles.subjectCard, { borderColor: subject.color }]}
              onPress={() => navigation.navigate('Upload')}
            >
              <Text style={styles.subjectIcon}>{subject.icon}</Text>
              <Text style={styles.subjectName}>{subject.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {recentExams.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最近试卷</Text>
          {recentExams.map((exam) => (
            <TouchableOpacity
              key={exam.id}
              style={styles.examCard}
              onPress={() => navigation.navigate('Exams')}
            >
              <View style={styles.examInfo}>
                <Text style={styles.examTitle}>{exam.title}</Text>
                <Text style={styles.examMeta}>
                  {exam.subject} · {new Date(exam.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                exam.status === 'analyzed' && styles.statusAnalyzed,
                exam.status === 'pending' && styles.statusPending
              ]}>
                <Text style={styles.statusText}>
                  {exam.status === 'analyzed' ? '已分析' : '待分析'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.uploadButtonText}>上传新试卷</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    padding: 20,
    paddingTop: 10
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  section: {
    padding: 20,
    paddingTop: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  subjectCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  subjectIcon: {
    fontSize: 28,
    marginBottom: 4
  },
  subjectName: {
    fontSize: 12,
    color: COLORS.text
  },
  examCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  examInfo: {
    flex: 1
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text
  },
  examMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.border
  },
  statusAnalyzed: {
    backgroundColor: '#D1FAE5'
  },
  statusPending: {
    backgroundColor: '#FEF3C7'
  },
  statusText: {
    fontSize: 12,
    color: COLORS.text
  },
  uploadButton: {
    margin: 20,
    marginTop: 0,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
