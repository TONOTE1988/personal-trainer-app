import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useWorkoutStore } from '../store/workoutStore';
import { useUserStore } from '../store/userStore';
import { Exercise } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

export default function ResultScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentWorkout, clearCurrentWorkout, saveToHistory } = useWorkoutStore();
  const { ticketBalance } = useUserStore();

  if (!currentWorkout || !currentWorkout.content) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>生成結果がありません</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menu = currentWorkout.content;

  const handleSave = () => {
    saveToHistory(currentWorkout);
    Alert.alert('保存完了', 'ワークアウトを履歴に保存しました', [{ text: 'OK', onPress: () => { clearCurrentWorkout(); navigation.navigate('MainTabs'); } }]);
  };

  const renderExercise = (exercise: Exercise, index: number) => (
    <View key={index} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseNumber}>{index + 1}</Text>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
      </View>
      <View style={styles.exerciseDetails}>
        <View style={styles.exerciseDetail}><Text style={styles.detailLabel}>セット</Text><Text style={styles.detailValue}>{exercise.sets}</Text></View>
        <View style={styles.exerciseDetail}><Text style={styles.detailLabel}>回数</Text><Text style={styles.detailValue}>{exercise.reps}</Text></View>
        <View style={styles.exerciseDetail}><Text style={styles.detailLabel}>休憩</Text><Text style={styles.detailValue}>{exercise.rest}</Text></View>
      </View>
      {exercise.notes && <Text style={styles.exerciseNotes}>💡 {exercise.notes}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.successBanner}>
        <Text style={styles.successIcon}>✅</Text>
        <View><Text style={styles.successTitle}>メニューを生成しました！</Text><Text style={styles.successSubtitle}>残りチケット: {ticketBalance}</Text></View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{menu.title}</Text>
        <Text style={styles.description}>{menu.description}</Text>
      </View>

      {menu.warnings.length > 0 && (
        <View style={styles.warningsContainer}>{menu.warnings.map((warning, index) => <Text key={index} style={styles.warningText}>{warning}</Text>)}</View>
      )}

      <View style={styles.section}><Text style={styles.sectionTitle}>🔥 ウォームアップ</Text>{menu.warmup.map(renderExercise)}</View>
      <View style={styles.section}><Text style={styles.sectionTitle}>💪 メイン</Text>{menu.main.map(renderExercise)}</View>
      <View style={styles.section}><Text style={styles.sectionTitle}>🧘 クールダウン</Text>{menu.cooldown.map(renderExercise)}</View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.saveButtonText}>📚 履歴に保存</Text></TouchableOpacity>
        <TouchableOpacity style={styles.newButton} onPress={() => { clearCurrentWorkout(); navigation.goBack(); }}><Text style={styles.newButtonText}>🔄 別のメニューを生成</Text></TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' },
  emptyText: { color: '#9ca3af', fontSize: 16, marginBottom: 20 },
  backButton: { backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: '#fff', fontWeight: '600' },
  successBanner: { backgroundColor: '#064e3b', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  successIcon: { fontSize: 32 },
  successTitle: { fontSize: 16, fontWeight: '600', color: '#10b981' },
  successSubtitle: { fontSize: 14, color: '#6ee7b7' },
  header: { padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  description: { fontSize: 14, color: '#9ca3af' },
  warningsContainer: { margin: 16, padding: 16, backgroundColor: '#1a1a2e', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  warningText: { color: '#fbbf24', fontSize: 13, marginBottom: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 12 },
  exerciseCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2d2d44' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  exerciseNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#6366f1', color: '#fff', textAlign: 'center', lineHeight: 28, fontSize: 14, fontWeight: '600', marginRight: 12 },
  exerciseName: { fontSize: 16, fontWeight: '600', color: '#fff', flex: 1 },
  exerciseDetails: { flexDirection: 'row', gap: 16 },
  exerciseDetail: { alignItems: 'center', minWidth: 60 },
  detailLabel: { fontSize: 11, color: '#6b7280', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#fff' },
  exerciseNotes: { marginTop: 12, fontSize: 13, color: '#9ca3af', fontStyle: 'italic' },
  actionButtons: { padding: 16, gap: 12 },
  saveButton: { backgroundColor: '#6366f1', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  newButton: { backgroundColor: '#1a1a2e', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#6366f1' },
  newButtonText: { color: '#6366f1', fontSize: 16, fontWeight: '600' },
});

