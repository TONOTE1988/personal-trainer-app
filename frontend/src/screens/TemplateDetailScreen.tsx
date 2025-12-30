import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { getTemplateById } from '../data/templates';
import { Level, Exercise, WorkoutMenu } from '../types';
import { apiClient } from '../api/client';
import { useUserStore } from '../store/userStore';

type RouteProps = RouteProp<RootStackParamList, 'TemplateDetail'>;

export default function TemplateDetailScreen() {
  const route = useRoute<RouteProps>();
  const { templateId } = route.params;
  const template = getTemplateById(templateId);
  const { userId } = useUserStore();
  const [selectedLevel, setSelectedLevel] = useState<Level>('intermediate');
  const [isSaving, setIsSaving] = useState(false);

  if (!template) {
    return <View style={styles.container}><Text style={styles.errorText}>テンプレートが見つかりません</Text></View>;
  }

  const menu: WorkoutMenu = template.menu[selectedLevel];
  const levelLabels: Record<Level, string> = { beginner: '初心者', intermediate: '中級者', advanced: '上級者' };

  const handleSave = async () => {
    if (!userId) { Alert.alert('エラー', 'ログインが必要です'); return; }
    setIsSaving(true);
    try {
      await apiClient.saveTemplate(template.id, template.title, menu);
      Alert.alert('保存完了', 'テンプレートを履歴に保存しました');
    } catch { Alert.alert('エラー', '保存に失敗しました'); }
    finally { setIsSaving(false); }
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
      <View style={styles.header}>
        <Text style={styles.title}>{template.title}</Text>
        <Text style={styles.description}>{menu.description}</Text>
      </View>

      <View style={styles.levelSelector}>
        {(['beginner', 'intermediate', 'advanced'] as Level[]).map((level) => (
          <TouchableOpacity key={level} style={[styles.levelButton, selectedLevel === level && styles.levelButtonSelected]} onPress={() => setSelectedLevel(level)}>
            <Text style={[styles.levelButtonText, selectedLevel === level && styles.levelButtonTextSelected]}>{levelLabels[level]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}><Text style={styles.sectionTitle}>🔥 ウォームアップ</Text>{menu.warmup.map(renderExercise)}</View>
      <View style={styles.section}><Text style={styles.sectionTitle}>💪 メイン</Text>{menu.main.map(renderExercise)}</View>
      <View style={styles.section}><Text style={styles.sectionTitle}>🧘 クールダウン</Text>{menu.cooldown.map(renderExercise)}</View>

      <TouchableOpacity style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSave} disabled={isSaving}>
        <Text style={styles.saveButtonText}>{isSaving ? '保存中...' : '📚 履歴に保存'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  description: { fontSize: 14, color: '#9ca3af' },
  levelSelector: { flexDirection: 'row', padding: 16, gap: 8 },
  levelButton: { flex: 1, paddingVertical: 10, borderRadius: 20, backgroundColor: '#1a1a2e', alignItems: 'center', borderWidth: 1, borderColor: '#2d2d44' },
  levelButtonSelected: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  levelButtonText: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  levelButtonTextSelected: { color: '#fff' },
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
  saveButton: { margin: 16, backgroundColor: '#6366f1', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorText: { color: '#f87171', fontSize: 16, textAlign: 'center', marginTop: 40 },
});

