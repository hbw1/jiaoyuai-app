import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useExamStore } from '../stores/examStore';
import { COLORS } from '../constants';
import { Exam } from '../types';
import { formatPercent, getExamTypeLabel, getGradeLabel, getImageUrl, getStatusMeta, getSubjectMeta } from '../utils/ui';

type RootStackParamList = {
  ExamDetail: { examId: string };
};

export default function ExamsScreen() {
  const { exams, fetchExams, isLoading, analyzeExam } = useExamStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const availableGrades = useMemo(
    () => Array.from(new Set(exams.map((exam) => exam.grade))).sort((a, b) => a - b),
    [exams]
  );

  const availableSubjects = useMemo(() => {
    if (selectedGrade == null) {
      return [];
    }

    return Array.from(
      new Set(exams.filter((exam) => exam.grade === selectedGrade).map((exam) => exam.subject))
    ).sort((a, b) => getSubjectMeta(a).name.localeCompare(getSubjectMeta(b).name, 'zh-Hans-CN'));
  }, [exams, selectedGrade]);

  const filteredExams = useMemo(() => {
    if (selectedGrade == null || selectedSubject == null) {
      return [];
    }

    return exams
      .filter((exam) => exam.grade === selectedGrade && exam.subject === selectedSubject)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [exams, selectedGrade, selectedSubject]);

  const selectedSubjectMeta = selectedSubject ? getSubjectMeta(selectedSubject) : null;

  useEffect(() => {
    if (!availableGrades.length) {
      if (selectedGrade !== null || selectedSubject !== null) {
        setSelectedGrade(null);
        setSelectedSubject(null);
      }
      return;
    }

    const nextGrade = selectedGrade != null && availableGrades.includes(selectedGrade)
      ? selectedGrade
      : availableGrades[0];

    if (nextGrade !== selectedGrade) {
      setSelectedGrade(nextGrade);
      return;
    }

    if (!availableSubjects.length) {
      if (selectedSubject !== null) {
        setSelectedSubject(null);
      }
      return;
    }

    if (selectedSubject == null || !availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [availableGrades, availableSubjects, selectedGrade, selectedSubject]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchExams()} colors={[COLORS.primary]} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>试卷库</Text>
        <Text style={styles.headerCopy}>先选年级，再选科目。下面只显示你当前想看的那一组卷子。</Text>
      </View>

      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>年级</Text>
        <View style={styles.chipsWrap}>
          {availableGrades.map((grade) => (
            <TouchableOpacity
              key={grade}
              style={[styles.chip, selectedGrade === grade && styles.chipActive]}
              onPress={() => {
                setSelectedGrade(grade);
                setSelectedSubject(null);
              }}
            >
              <Text style={[styles.chipText, selectedGrade === grade && styles.chipTextActive]}>
                {getGradeLabel(grade)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterTitle}>科目</Text>
        <View style={styles.chipsWrap}>
          {selectedGrade == null ? (
            <Text style={styles.helperText}>先选择年级，再选择科目。</Text>
          ) : availableSubjects.length ? (
            availableSubjects.map((subjectId) => {
              const meta = getSubjectMeta(subjectId);

              return (
                <TouchableOpacity
                  key={subjectId}
                  style={[
                    styles.subjectChip,
                    selectedSubject === subjectId && { backgroundColor: meta.color, borderColor: meta.color }
                  ]}
                  onPress={() => setSelectedSubject(subjectId)}
                >
                  <Text style={[styles.subjectChipIcon, selectedSubject === subjectId && styles.subjectChipTextActive]}>
                    {meta.icon}
                  </Text>
                  <Text style={[styles.subjectChipText, selectedSubject === subjectId && styles.subjectChipTextActive]}>
                    {meta.name}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.helperText}>这个年级暂时没有科目数据。</Text>
          )}
        </View>
      </View>

      {selectedGrade != null && selectedSubjectMeta ? (
        <View style={styles.resultHeader}>
          <View style={[styles.subjectBanner, { backgroundColor: selectedSubjectMeta.color }]}>
            <Text style={styles.subjectBannerIcon}>{selectedSubjectMeta.icon}</Text>
            <Text style={styles.subjectBannerText}>{getGradeLabel(selectedGrade)} · {selectedSubjectMeta.name}</Text>
          </View>
          <Text style={styles.resultCount}>{filteredExams.length} 份试卷</Text>
        </View>
      ) : null}

      {selectedGrade == null || selectedSubject == null ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>先选择筛选条件</Text>
          <Text style={styles.emptyCopy}>顶部选好年级和科目后，这里才会显示对应试卷，避免默认把所有卷子堆在一起。</Text>
        </View>
      ) : filteredExams.length ? (
        filteredExams.map((item) => {
          const imageUrl = getImageUrl(item.images?.[0]);
          const statusMeta = getStatusMeta(item.status);

          return (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity style={styles.cardTop} onPress={() => navigation.navigate('ExamDetail', { examId: item.id })}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.cardImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons color={COLORS.textSecondary} name="image-outline" size={20} />
                  </View>
                )}

                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusMeta.backgroundColor }]}>
                      <Text style={[styles.statusText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardMeta}>{getExamTypeLabel(item.examType)}</Text>
                  <Text style={styles.cardMeta}>
                    {item.status === 'analyzed'
                      ? `得分率 ${formatPercent(item.totalScore ? item.obtainedScore / item.totalScore : 0)}`
                      : item.status === 'processing'
                        ? '分析进行中，稍后可在详情页查看'
                        : '上传已完成，下一步可以开始分析'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.ghostButton} onPress={() => navigation.navigate('ExamDetail', { examId: item.id })}>
                  <Text style={styles.ghostButtonText}>查看详情</Text>
                </TouchableOpacity>
                {item.status !== 'analyzed' && (
                  <TouchableOpacity
                    style={[styles.primaryButton, (isLoading || item.status === 'processing') && styles.buttonDisabled]}
                    onPress={() => analyzeExam(item.id)}
                    disabled={isLoading || item.status === 'processing'}
                  >
                    <Ionicons color={COLORS.white} name={item.status === 'failed' ? 'refresh' : 'sparkles'} size={16} />
                    <Text style={styles.primaryButtonText}>{item.status === 'failed' ? '重新分析' : '开始分析'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>这一组还没有试卷</Text>
          <Text style={styles.emptyCopy}>你可以先上传对应年级和科目的试卷，之后这里会自动出现。</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    padding: 20,
    paddingBottom: 28
  },
  header: {
    marginBottom: 18
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8
  },
  headerCopy: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary
  },
  filterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceStrong,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text
  },
  chipTextActive: {
    color: COLORS.white
  },
  subjectChip: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceStrong,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  subjectChipIcon: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDeep
  },
  subjectChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text
  },
  subjectChipTextActive: {
    color: COLORS.white
  },
  helperText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  subjectBanner: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  subjectBannerIcon: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800'
  },
  subjectBannerText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800'
  },
  resultCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDeep
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12
  },
  cardTop: {
    flexDirection: 'row',
    gap: 14
  },
  cardImage: {
    width: 70,
    height: 94,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundAlt
  },
  placeholderImage: {
    width: 70,
    height: 94,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardBody: {
    flex: 1
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 8
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.text
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700'
  },
  cardMeta: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginTop: 3
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14
  },
  ghostButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ghostButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDeep
  },
  primaryButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white
  },
  buttonDisabled: {
    opacity: 0.6
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 20
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6
  },
  emptyCopy: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary
  }
});
