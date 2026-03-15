import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from './src/stores/authStore';
import { COLORS } from './src/constants';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ExamsScreen from './src/screens/ExamsScreen';
import ExamDetailScreen from './src/screens/ExamDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: COLORS.surface
        },
        headerTitleStyle: {
          color: COLORS.text,
          fontWeight: '700'
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700'
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Upload: focused ? 'scan-circle' : 'scan-circle-outline',
            Exams: focused ? 'documents' : 'documents-outline',
            Profile: focused ? 'person-circle' : 'person-circle-outline'
          };

          return <Ionicons color={color} name={iconMap[route.name]} size={size} />;
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, title: '首页', tabBarLabel: '首页' }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{ title: '上传试卷', tabBarLabel: '上传' }}
      />
      <Tab.Screen
        name="Exams"
        component={ExamsScreen}
        options={{ title: '试卷库', tabBarLabel: '试卷' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '我的', tabBarLabel: '我的' }}
      />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700' }
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: '创建账号' }} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const authStore = useAuthStore as any;
  const isAuthenticated = authStore((state: any) => state.isAuthenticated);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: false,
          colors: {
            primary: COLORS.primary,
            background: COLORS.background,
            card: COLORS.surface,
            text: COLORS.text,
            border: COLORS.border,
            notification: COLORS.warning
          }
        }}
      >
        <StatusBar style="dark" />
        <RootStack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: COLORS.surface },
            headerTitleStyle: { color: COLORS.text, fontWeight: '700' },
            headerTintColor: COLORS.text
          }}
        >
          {isAuthenticated ? (
            <>
              <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
              <RootStack.Screen name="ExamDetail" component={ExamDetailScreen} options={{ title: '试卷详情' }} />
            </>
          ) : (
            <RootStack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
