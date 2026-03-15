import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { useExamStore } from '../stores/examStore';
import { formatPercent, getExamTypeLabel, getGradeLabel, getImageUrl, getStatusMeta, getSubjectMeta } from '../utils/ui';

export default function ExamDetailScreen({ route }: any) {
  const { examId } = route.params;
  const { exams, currentExam, fetchExamById, analyzeExam, isLoading } = useExamStore();
  const exam = currentExam?.id === examId ? currentExam : exams.find((item) => item.id === examId);

  useEffect(() => {
    fetchExamById(examId);
  }, [examId]);

  if (!exam) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>未找到试卷信息</Text>
      </View>
    );
  }

  const statusMeta = getStatusMeta(exam.status);
  const subjectMeta = getSubjectMeta(exam.subject);
  const scoreRate = exam.totalScore ? exam.obtainedScore / exam.totalScore : 0;
  const canAnalyze = exam.status !== 'analyzed';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={[styles.subjectPill, { backgroundColor: subjectMeta.color }]}>
            <Text style={styles.subjectPillText}>{subjectMeta.name}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: statusMeta.backgroundColor }]}>
            <Text style={[styles.statusPillText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
          </View>
        </View>
        <Text style={styles.title}>{exam.title}</Text>
        <Text style={styles.subtitle}>{getGradeLabel(exam.grade)} · {getExamTypeLabel(exam.examType)}</Text>

        <View style={styles.actionPanel}>
          <View style={styles.actionCopyBlock}>
            <Text style={styles.actionLabel}>下一步</Text>
            <Text style={styles.actionHeadline}>
              {canAnalyze ? '先开始分析，再看结果摘要。' : '这份试卷已经分析完成。'}
            </Text>
            <Text style={styles.actionCopy}>
              {canAnalyze
                ? '上传只负责保存试卷，分析需要你手动触发，这样在手机上流程更清楚。'
                : '下面直接看正确率、薄弱点和学习建议。'}
            </Text>
          </View>
          {canAnalyze ? (
            <TouchableOpacity
              style={[styles.actionButton, (isLoading || exam.status === 'processing') && styles.actionButtonDisabled]}
              onPress={() => analyzeExam(exam.id)}
              disabled={isLoading || exam.status === 'processing'}
            >
              {isLoading && exam.status === 'processing' ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons color={COLORS.white} name={exam.status === 'failed' ? 'refresh' : 'sparkles'} size={18} />
                  <Text style={styles.actionButtonText}>{exam.status === 'failed' ? '重新分析' : '开始分析'}</Text>
                </>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{formatPercent(scoreRate)}</Text>
          <Text style={styles.metricLabel}>得分率</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{exam.images?.length || 0}</Text>
          <Text style={styles.metricLabel}>图片页数</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{exam.questions?.length || 0}</Text>
          <Text style={styles.metricLabel}>题目数</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>试卷图片</Text>
        <Text style={styles.cardSubtitle}>先确认上传内容是完整的，再决定要不要重新拍摄或重新分析。</Text>
        {exam.images?.map((image, index) => (
          <View key={image + index} style={styles.imageWrap}>
            <Image source={{ uri: getImageUrl(image) || image }} style={styles.image} resizeMode="cover" />
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>基础信息</Text>
        <View style={styles.infoRow}>
          <Ionicons color={COLORS.primaryDeep} name="school-outline" size={18} />
          <Text style={styles.infoText}>{getGradeLabel(exam.grade)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons color={COLORS.primaryDeep} name="calendar-outline" size={18} />
          <Text style={styles.infoText}>{new Date(exam.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons color={COLORS.primaryDeep} name="bookmark-outline" size={18} />
          <Text style={styles.infoText}>{getExamTypeLabel(exam.examType)}</Text>
        </View>
      </View>

      {exam.analysisResult ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>分析摘要</Text>
          <View style={styles.summaryPanel}>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{formatPercent(exam.analysisResult.accuracy)}</Text>
              <Text style={styles.summaryLabel}>正确率</Text>
            </View>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{exam.analysisResult.weakPoints.length}</Text>
              <Text style={styles.summaryLabel}>薄弱点</Text>
            </View>
          </View>

          <Text style={styles.subTitle}>优先复习</Text>
          <View style={styles.tagRow}>
            {exam.analysisResult.weakPoints.length ? (
              exam.analysisResult.weakPoints.map((point, index) => (
                <View key={point + index} style={styles.tag}>
                  <Text style={styles.tagText}>{point}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyInline}>这次没有识别出明显薄弱点。</Text>
            )}
          </View>

          <Text style={styles.subTitle}>建议动作</Text>
          {exam.analysisResult.recommendations?.map((item, index) => (
            <View key={item + index} style={styles.recommendationRow}>
              <Ionicons color={COLORS.primary} name="checkmark-circle" size={18} />
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>分析结果</Text>
          <Text style={styles.pendingText}>这份试卷还没有结果。先点上面的主按钮开始分析，完成后这里会自动展示摘要。</Text>
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
    padding: 16,
    paddingBottom: 28,
    gap: 14
  },
  hero: {
    backgroundColor: COLORS.secondary,
    borderRadius: 28,
    padding: 20
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  subjectPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999
  },
  subjectPillText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700'
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#D7E7FF'
  },
  actionPanel: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    padding: 16
  },
  actionCopyBlock: {
    marginBottom: 14
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BBD3FF',
    marginBottom: 6
  },
  actionHeadline: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8
  },
  actionCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: '#D7E7FF'
  },
  actionButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  actionButtonDisabled: {
    opacity: 0.6
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700'
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary
  },
  metricLabel: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textSecondary
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginBottom: 12
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: COLORS.backgroundAlt
  },
  image: {
    width: '100%',
    height: '100%'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text
  },
  summaryPanel: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18
  },
  summaryMetric: {
    flex: 1,
    backgroundColor: COLORS.surfaceStrong,
    borderRadius: 18,
    padding: 16
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  tag: {
    backgroundColor: COLORS.surfaceStrong,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  tagText: {
    color: COLORS.primaryDeep,
    fontSize: 12,
    fontWeight: '700'
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10
  },
  recommendationText: {
    flex: 1,
    color: COLORS.textSecondary,
    lineHeight: 20
  },
  pendingText: {
    color: COLORS.textSecondary,
    lineHeight: 20
  },
  emptyInline: {
    color: COLORS.textSecondary,
    lineHeight: 20
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background
  },
  emptyText: {
    color: COLORS.textSecondary
  }
});
