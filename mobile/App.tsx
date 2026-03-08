import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ExamsScreen from './src/screens/ExamsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: '登录' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '注册' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AI教育', headerBackVisible: false }} />
          <Stack.Screen name="Upload" component={UploadScreen} options={{ title: '上传试卷' }} />
          <Stack.Screen name="Exams" component={ExamsScreen} options={{ title: '我的试卷' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '个人中心' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
