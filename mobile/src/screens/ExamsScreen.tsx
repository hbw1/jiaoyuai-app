import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useExamStore } from '../stores/examStore';
import { COLORS } from '../constants';

export default function ExamsScreen() {
  const { exams, fetchExams, isLoading } = useExamStore();

  useEffect(() => {
    fetchExams();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return COLORS.success;
      case 'processing': return COLORS.warning;
      case 'failed': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'analyzed': return '已分析';
      case 'processing': return '分析中';
      case 'failed': return '分析失败';
      default: return '待分析';
    }
  };

  const renderItem = ({ item }: { item: typeof exams[0] }) => (
    <TouchableOpacity style={styles.examCard}>
      <View style={styles.examHeader}>
        <Text style={styles.examTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.examMeta}>
        <Text style={styles.examMetaText}>
          {item.subject} · {item.grade}年级
        </Text>
        <Text style={styles.examMetaText}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {item.status === 'analyzed' && item.analysisResult && (
        <View style={styles.examStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.analysisResult.accuracy}%</Text>
            <Text style={styles.statLabel}>正确率</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.analysisResult.weakPoints.length}</Text>
            <Text style={styles.statLabel}>薄弱点</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.obtainedScore}/{item.totalScore}</Text>
            <Text style={styles.statLabel}>得分</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exams}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchExams()}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>暂无试卷</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  list: {
    padding: 20,
    paddingTop: 10
  },
  examCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500'
  },
  examMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  examMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  examStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary
  }
});
