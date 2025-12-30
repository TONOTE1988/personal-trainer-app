import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useUserStore } from '../store/userStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { userId, ticketBalance, isLoading, initialize, purchaseTickets } = useUserStore();

  useEffect(() => { initialize(); }, []);

  if (isLoading && !userId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>初期化中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>💪 パーソナルトレーナー</Text>
        <Text style={styles.subtitle}>あなたに最適なワークアウトを</Text>
      </View>

      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketLabel}>🎫 チケット残高</Text>
          <Text style={styles.ticketBalance}>{ticketBalance}</Text>
        </View>
        <TouchableOpacity style={styles.purchaseButton} onPress={() => purchaseTickets('tickets_10', 10)}>
          <Text style={styles.purchaseButtonText}>+ 10チケット購入（スタブ）</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>何をしますか？</Text>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Generate')}>
          <View style={styles.actionIcon}><Text style={styles.actionEmoji}>🤖</Text></View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>AIでメニュー生成</Text>
            <Text style={styles.actionDescription}>カスタムメニューを作成</Text>
            <Text style={styles.actionCost}>1チケット消費</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.getParent()?.navigate('Templates')}>
          <View style={styles.actionIcon}><Text style={styles.actionEmoji}>📋</Text></View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>テンプレートを見る</Text>
            <Text style={styles.actionDescription}>無料テンプレートから選ぶ</Text>
            <Text style={styles.actionFree}>無料</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>⚠️ このアプリは医療アドバイスではありません。痛みが出たら中止してください。</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' },
  loadingText: { color: '#9ca3af', marginTop: 12 },
  header: { padding: 24, paddingTop: 16 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#9ca3af', marginTop: 4 },
  ticketCard: { margin: 16, padding: 20, backgroundColor: '#1a1a2e', borderRadius: 16, borderWidth: 1, borderColor: '#6366f1' },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  ticketLabel: { fontSize: 16, color: '#9ca3af' },
  ticketBalance: { fontSize: 32, fontWeight: 'bold', color: '#6366f1' },
  purchaseButton: { backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center' },
  purchaseButtonText: { color: '#fff', fontWeight: '600' },
  actionsContainer: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 16 },
  actionCard: { flexDirection: 'row', backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2d2d44' },
  actionIcon: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#2d2d44', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  actionEmoji: { fontSize: 28 },
  actionContent: { flex: 1, justifyContent: 'center' },
  actionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  actionDescription: { fontSize: 13, color: '#9ca3af', marginBottom: 4 },
  actionCost: { fontSize: 12, color: '#f59e0b', fontWeight: '500' },
  actionFree: { fontSize: 12, color: '#10b981', fontWeight: '500' },
  disclaimer: { margin: 16, padding: 16, backgroundColor: '#1a1a2e', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  disclaimerText: { color: '#9ca3af', fontSize: 12 },
});

