import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import { useExamStore } from '../stores/examStore';
import { COLORS } from '../constants';
import { formatPercent, getGradeLabel, getStatusMeta, getSubjectMeta } from '../utils/ui';

export default function HomeScreen() {
  const authStore = useAuthStore as any;
  const user = authStore((state: any) => state.user);
  const { exams, fetchExams } = useExamStore();
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      fetchExams({ limit: 20 });
    }, [fetchExams])
  );

  const recentTasks = exams.slice(0, 3);
  const pendingCount = exams.filter((exam) => exam.status === 'pending' || exam.status === 'failed').length;
  const analyzedExams = exams.filter((exam) => exam.status === 'analyzed');
  const latestAnalyzedExam = analyzedExams[0];
  const headlineWeakPoint = latestAnalyzedExam?.analysisResult?.weakPoints?.[0];
  const averageAccuracy = analyzedExams.length
    ? Math.round(
        analyzedExams.reduce((sum, exam) => sum + (exam.analysisResult?.accuracy || 0), 0) / analyzedExams.length
      )
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.eyebrow}>试卷任务中心</Text>
            <Text style={styles.title}>你好，{user?.name || '同学'}</Text>
            <Text style={styles.subtitle}>用手机拍照上传，按状态继续处理，不需要在一堆页面里找入口。</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
            <Ionicons color={COLORS.white} name="person-outline" size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.heroAction} onPress={() => navigation.navigate('Upload')}>
          <View style={styles.heroActionIcon}>
            <Ionicons color={COLORS.primaryDeep} name="camera-outline" size={22} />
          </View>
          <View style={styles.heroActionBody}>
            <Text style={styles.heroActionTitle}>拍照上传试卷</Text>
            <Text style={styles.heroActionCopy}>直接进入上传页，完成后自动跳转到试卷详情。</Text>
          </View>
          <Ionicons color={COLORS.primaryDeep} name="arrow-forward" size={20} />
        </TouchableOpacity>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{pendingCount}</Text>
            <Text style={styles.metricLabel}>待处理任务</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analyzedExams.length}</Text>
            <Text style={styles.metricLabel}>已完成分析</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{averageAccuracy}%</Text>
            <Text style={styles.metricLabel}>平均正确率</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>继续处理</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Exams')}>
            <Text style={styles.sectionLink}>查看全部</Text>
          </TouchableOpacity>
        </View>
        {recentTasks.length ? (
          recentTasks.map((exam) => {
            const statusMeta = getStatusMeta(exam.status);
            const subjectMeta = getSubjectMeta(exam.subject);

            return (
              <TouchableOpacity
                key={exam.id}
                style={styles.taskCard}
                onPress={() => navigation.navigate('ExamDetail', { examId: exam.id })}
              >
                <View style={[styles.taskAccent, { backgroundColor: subjectMeta.color }]} />
                <View style={styles.taskBody}>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle}>{exam.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusMeta.backgroundColor }]}>
                      <Text style={[styles.statusText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.taskMeta}>
                    {subjectMeta.name} · {getGradeLabel(exam.grade)}
                  </Text>
                  <Text style={styles.taskMeta}>
                    {exam.status === 'analyzed'
                      ? `得分率 ${formatPercent(exam.totalScore ? exam.obtainedScore / exam.totalScore : 0)}`
                      : '进入详情页后可以开始分析'}
                  </Text>
                </View>
                <Ionicons color={COLORS.textSecondary} name="chevron-forward" size={18} />
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons color={COLORS.primary} name="document-text-outline" size={22} />
            <Text style={styles.emptyTitle}>还没有试卷任务</Text>
            <Text style={styles.emptyCopy}>先上传一份试卷，系统才会开始建立你的分析记录。</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>学习摘要</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>当前最值得优先处理的点</Text>
          <Text style={styles.summaryHeadline}>{headlineWeakPoint || '先完成一份试卷分析'}</Text>
          <Text style={styles.summaryCopy}>
            {headlineWeakPoint
              ? `最近一次分析显示“${headlineWeakPoint}”是优先复习内容，建议先完成对应专项练习。`
              : '上传并分析第一份试卷后，这里会自动出现薄弱点和下一步建议。'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>手机端怎么用</Text>
        <View style={styles.guideCard}>
          <View style={styles.guideRow}>
            <View style={styles.guideIndex}>
              <Text style={styles.guideIndexText}>1</Text>
            </View>
            <Text style={styles.guideText}>先拍照上传，不要在首页做太多选择。</Text>
          </View>
          <View style={styles.guideRow}>
            <View style={styles.guideIndex}>
              <Text style={styles.guideIndexText}>2</Text>
            </View>
            <Text style={styles.guideText}>上传成功后直接进入详情页，再手动点击“开始分析”。</Text>
          </View>
          <View style={styles.guideRow}>
            <View style={styles.guideIndex}>
              <Text style={styles.guideIndexText}>3</Text>
            </View>
            <Text style={styles.guideText}>试卷页按状态分组，方便在手机上继续上次没做完的任务。</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    paddingBottom: 28
  },
  hero: {
    backgroundColor: COLORS.secondary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  heroTextBlock: {
    flex: 1,
    paddingRight: 12
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BBD3FF',
    marginBottom: 8,
    letterSpacing: 1
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#D7E7FF'
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroAction: {
    marginTop: 22,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  heroActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroActionBody: {
    flex: 1
  },
  heroActionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4
  },
  heroActionCopy: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4
  },
  metricLabel: {
    fontSize: 12,
    color: '#D7E7FF'
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary
  },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  taskAccent: {
    width: 8,
    alignSelf: 'stretch',
    borderRadius: 999
  },
  taskBody: {
    flex: 1
  },
  taskHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 6
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.text
  },
  taskMeta: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginTop: 2
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
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center'
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text
  },
  emptyCopy: {
    marginTop: 6,
    textAlign: 'center',
    color: COLORS.textSecondary,
    lineHeight: 20
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8
  },
  summaryHeadline: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10
  },
  summaryCopy: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary
  },
  guideCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18,
    gap: 14
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  guideIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center'
  },
  guideIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDeep
  },
  guideText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary
  }
});
