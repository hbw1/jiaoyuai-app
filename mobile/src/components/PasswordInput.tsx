import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../constants';

interface PasswordInputProps extends TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function PasswordInput({ placeholder, value, onChangeText, style, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder || '密码'}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowPassword((current) => !current)} activeOpacity={0.7}>
        <Text style={styles.toggleText}>{showPassword ? '隐藏' : '显示'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative'
  },
  input: {
    flex: 1,
    minHeight: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingRight: 74,
    fontSize: 16,
    backgroundColor: COLORS.surfaceStrong,
    color: COLORS.text
  },
  toggleButton: {
    position: 'absolute',
    right: 8,
    height: 56,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  toggleText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700'
  }
});
