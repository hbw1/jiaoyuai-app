import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import { COLORS, GRADES } from '../constants';
import PasswordInput from '../components/PasswordInput';
import { getGradeLabel } from '../utils/ui';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [grade, setGrade] = useState(1);

  const authStore = useAuthStore as any;
  const register = authStore((state: any) => state.register);
  const isLoading = authStore((state: any) => state.isLoading);
  const error = authStore((state: any) => state.error);
  const clearError = authStore((state: any) => state.clearError);

  useEffect(() => () => clearError(), []);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('提示', '两次密码输入不一致');
      return;
    }

    if (password.length < 6) {
      Alert.alert('提示', '密码至少6位');
      return;
    }

    try {
      await register(name, email, password, grade);
      Alert.alert('成功', '注册成功！', [
        { text: '确定', onPress: () => navigation.replace('Home') }
      ]);
    } catch (err) {
      Alert.alert('注册失败', error || '请稍后重试');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>30 秒完成入门</Text>
        <Text style={styles.title}>创建你的学习档案</Text>
        <Text style={styles.subtitle}>先选年级，后续分析会更贴近真实试卷难度和知识点分布。</Text>
      </View>

      <View style={styles.formCard}>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="姓名"
          placeholderTextColor={COLORS.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="邮箱"
          placeholderTextColor={COLORS.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PasswordInput
          placeholder="密码（至少6位）"
          placeholderTextColor={COLORS.textSecondary}
          value={password}
          onChangeText={setPassword}
        />
        <PasswordInput
          placeholder="确认密码"
          placeholderTextColor={COLORS.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.gradeHeader}>
          <Text style={styles.label}>选择年级</Text>
          <Text style={styles.gradeHint}>{getGradeLabel(grade)}</Text>
        </View>
        <View style={styles.gradeContainer}>
          {GRADES.slice(0, 9).map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.gradeButton, grade === item.value && styles.gradeButtonActive]}
              onPress={() => setGrade(item.value)}
            >
              <Text style={[styles.gradeText, grade === item.value && styles.gradeTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>创建账号并进入首页</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>已有账号？立即登录</Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingTop: 28,
    paddingBottom: 32
  },
  intro: {
    marginBottom: 18
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.primaryDeep,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 20,
    gap: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6
  },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: COLORS.surfaceStrong,
    color: COLORS.text
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '700'
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  gradeHint: {
    color: COLORS.textSecondary,
    fontSize: 13
  },
  gradeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  gradeButton: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceStrong
  },
  gradeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  gradeText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600'
  },
  gradeTextActive: {
    color: COLORS.white,
    fontWeight: '700'
  },
  button: {
    minHeight: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800'
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 6
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700'
  },
  errorContainer: {
    backgroundColor: '#F7DDD8',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    flex: 1
  }
});
