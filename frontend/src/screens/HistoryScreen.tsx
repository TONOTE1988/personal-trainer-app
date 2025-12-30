import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useWorkoutStore } from '../store/workoutStore';
import { Workout } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { history, historyTotal, isLoadingHistory, loadHistory, loadWorkoutDetail, deleteWorkout } = useWorkoutStore();

  useEffect(() => { loadHistory(); }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handlePress = async (workout: Workout) => {
    await loadWorkoutDetail(workout.id);
    navigation.navigate('Result', { workoutId: workout.id });
  };

  const handleDelete = (workout: Workout) => {
    Alert.alert('削除確認', `「${workout.title}」を削除しますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      { text: '削除', style: 'destructive', onPress: () => deleteWorkout(workout.id) },
    ]);
  };

  const renderItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity style={styles.historyCard} onPress={() => handlePress(item)} onLongPress={() => handleDelete(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.typeTag}><Text style={styles.typeText}>{item.type === 'generated' ? '🤖 AI生成' : '📋 テンプレート'}</Text></View>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyTitle}>履歴がありません</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Generate')}>
        <Text style={styles.emptyButtonText}>🤖 AIでメニュー生成</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>保存したメニュー</Text><Text style={styles.headerCount}>{historyTotal}件</Text></View>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoadingHistory} onRefresh={() => loadHistory(0)} tintColor="#6366f1" />}
        ListEmptyComponent={!isLoadingHistory ? renderEmpty : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2d2d44' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  headerCount: { fontSize: 14, color: '#6366f1', fontWeight: '500' },
  listContent: { padding: 16, flexGrow: 1 },
  historyCard: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2d2d44' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeTag: { backgroundColor: '#2d2d44', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 12, color: '#9ca3af' },
  dateText: { fontSize: 12, color: '#6b7280' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#fff', marginBottom: 24 },
  emptyButton: { backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  emptyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

