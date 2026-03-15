import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { COLORS, SUBJECTS, GRADES } from '../constants';

export default function ProfileScreen() {
  const authStore = useAuthStore as any;
  const user = authStore((state: any) => state.user);
  const logout = authStore((state: any) => state.logout);
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await logout();

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
      return;
    }

    const rootNavigation = navigation.getParent?.();
    rootNavigation?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      })
    );
  };

  const gradeLabel = GRADES.find((grade) => grade.value === user?.grade)?.label || `${user?.grade || 1}年级`;
  const subjectLabel =
    user?.subjects?.map((subjectId: string) => SUBJECTS.find((subject) => subject.id === subjectId)?.name).filter(Boolean).join('、') ||
    '未设置';
  const roleLabel =
    user?.role === 'student' ? '学生' : user?.role === 'teacher' ? '教师' : user?.role === 'parent' ? '家长' : '未设置';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || '未命名用户'}</Text>
        <Text style={styles.email}>{user?.email || '暂无邮箱'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>账号信息</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>年级</Text>
          <Text style={styles.infoValue}>{gradeLabel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>身份</Text>
          <Text style={styles.infoValue}>{roleLabel}</Text>
        </View>
        <View style={styles.infoRowLast}>
          <Text style={styles.infoLabel}>关注学科</Text>
          <Text style={styles.infoValue}>{subjectLabel}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>使用方式</Text>
        <View style={styles.tipRow}>
          <Ionicons color={COLORS.primary} name="phone-portrait-outline" size={18} />
          <Text style={styles.tipText}>手机端先上传，再进入详情页手动分析，流程最清晰。</Text>
        </View>
        <View style={styles.tipRow}>
          <Ionicons color={COLORS.primary} name="albums-outline" size={18} />
          <Text style={styles.tipText}>试卷页按状态继续处理，不需要来回切换页面。</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
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
    paddingTop: 24,
    paddingBottom: 28
  },
  hero: {
    backgroundColor: COLORS.secondary,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.white
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6
  },
  email: {
    fontSize: 14,
    color: '#D7E7FF'
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12
  },
  infoRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    gap: 12
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary
  },
  logoutButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800'
  }
});
