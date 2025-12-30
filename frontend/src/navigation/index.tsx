import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import TemplateDetailScreen from '../screens/TemplateDetailScreen';
import GenerateScreen from '../screens/GenerateScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  TemplateDetail: { templateId: string };
  Generate: undefined;
  Result: { workoutId?: string };
};

export type TabParamList = {
  Home: undefined;
  Templates: undefined;
  History: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = { Home: '🏠', Templates: '📋', History: '📚', Settings: '⚙️' };
  return <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{icons[name] || '•'}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#6366f1',
        tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#2d2d44', height: 60 },
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'ホーム' }} />
      <Tab.Screen name="Templates" component={TemplatesScreen} options={{ title: 'テンプレート' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: '履歴' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: '設定' }} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#0f0f1a' },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="TemplateDetail" component={TemplateDetailScreen} options={{ title: 'テンプレート詳細' }} />
        <Stack.Screen name="Generate" component={GenerateScreen} options={{ title: 'AIメニュー生成' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: '生成結果' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

