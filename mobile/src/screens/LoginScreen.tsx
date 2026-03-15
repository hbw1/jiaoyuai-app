import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import { COLORS } from '../constants';
import PasswordInput from '../components/PasswordInput';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authStore = useAuthStore as any;
  const login = authStore((state: any) => state.login);
  const isLoading = authStore((state: any) => state.isLoading);
  const error = authStore((state: any) => state.error);
  const clearError = authStore((state: any) => state.clearError);

  useEffect(() => () => clearError(), []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('提示', '请输入邮箱和密码');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.panel}>
        <View style={styles.logo}>
          <Ionicons name="school-outline" size={26} color={COLORS.primaryDeep} />
        </View>
        <Text style={styles.title}>登录</Text>
        <Text style={styles.subtitle}>输入账号后直接进入首页。流程只保留必要步骤。</Text>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="邮箱"
          placeholderTextColor={COLORS.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <PasswordInput
          placeholder="密码"
          placeholderTextColor={COLORS.textSecondary}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.buttonText}>登录并进入</Text>
              <Ionicons color={COLORS.white} name="arrow-forward" size={18} />
            </>
          )}
        </Pressable>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>没有账号？创建一个新账号</Text>
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
    paddingTop: 72,
    paddingBottom: 32,
    justifyContent: 'center',
    flexGrow: 1
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 22,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginBottom: 18
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
  button: {
    minHeight: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    flexDirection: 'row',
    gap: 10
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
    backgroundColor: '#FEE2E2',
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
