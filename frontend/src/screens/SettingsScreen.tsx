import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useUserStore } from '../store/userStore';

export default function SettingsScreen() {
  const { userId, ticketBalance, purchaseTickets } = useUserStore();

  const handlePurchase = async (productId: string, amount: number) => {
    Alert.alert('チケット購入（スタブ）', `${amount}チケットを購入しますか？\n\n※ テスト用のダミー購入です。`, [
      { text: 'キャンセル', style: 'cancel' },
      { text: '購入', onPress: async () => {
        const success = await purchaseTickets(productId, amount);
        if (success) { Alert.alert('完了', `${amount}チケットを付与しました`); }
      }},
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アカウント</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>ユーザーID</Text><Text style={styles.infoValue}>{userId?.slice(0, 8)}...</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>チケット残高</Text><Text style={styles.ticketValue}>{ticketBalance} 🎫</Text></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>チケット購入（テスト用）</Text>
        <View style={styles.purchaseOptions}>
          <TouchableOpacity style={styles.purchaseCard} onPress={() => handlePurchase('tickets_10', 10)}>
            <Text style={styles.purchaseAmount}>10</Text><Text style={styles.purchaseLabel}>チケット</Text><Text style={styles.purchasePrice}>¥500</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.purchaseCard} onPress={() => handlePurchase('tickets_30', 30)}>
            <Text style={styles.purchaseAmount}>30</Text><Text style={styles.purchaseLabel}>チケット</Text><Text style={styles.purchasePrice}>¥1,200</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.purchaseCard} onPress={() => handlePurchase('tickets_100', 100)}>
            <Text style={styles.purchaseAmount}>100</Text><Text style={styles.purchaseLabel}>チケット</Text><Text style={styles.purchasePrice}>¥3,000</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>免責事項</Text>
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>このアプリは医療アドバイスではありません。痛みが出たら中止し、専門家に相談してください。</Text>
        </View>
      </View>

      <View style={styles.footer}><Text style={styles.footerText}>Personal Trainer App v1.0.0</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 12 },
  infoCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  infoLabel: { fontSize: 14, color: '#9ca3af' },
  infoValue: { fontSize: 14, color: '#fff', fontFamily: 'monospace' },
  ticketValue: { fontSize: 18, fontWeight: '600', color: '#6366f1' },
  purchaseOptions: { flexDirection: 'row', gap: 12 },
  purchaseCard: { flex: 1, backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2d2d44' },
  purchaseAmount: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  purchaseLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 8 },
  purchasePrice: { fontSize: 14, fontWeight: '600', color: '#6366f1' },
  disclaimerCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  disclaimerText: { fontSize: 13, color: '#9ca3af', lineHeight: 22 },
  footer: { padding: 32, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#4b5563' },
});

