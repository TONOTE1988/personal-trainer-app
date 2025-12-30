import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { workoutTemplates, categoryInfo } from '../data/templates';
import { WorkoutTemplate, Level } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TemplatesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedLevel, setSelectedLevel] = useState<Level>('intermediate');

  const levelLabels: Record<Level, string> = { beginner: '初心者', intermediate: '中級者', advanced: '上級者' };

  const renderItem = ({ item }: { item: WorkoutTemplate }) => (
    <TouchableOpacity style={styles.templateCard} onPress={() => navigation.navigate('TemplateDetail', { templateId: item.id })}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateTitle}>{item.title}</Text>
        <View style={styles.templateBadge}><Text style={styles.templateBadgeText}>{item.duration}分</Text></View>
      </View>
      <Text style={styles.templateDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.levelSelector}>
        {(['beginner', 'intermediate', 'advanced'] as Level[]).map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.levelButton, selectedLevel === level && styles.levelButtonSelected]}
            onPress={() => setSelectedLevel(level)}
          >
            <Text style={[styles.levelButtonText, selectedLevel === level && styles.levelButtonTextSelected]}>{levelLabels[level]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={workoutTemplates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  levelSelector: { flexDirection: 'row', padding: 16, gap: 8 },
  levelButton: { flex: 1, paddingVertical: 10, borderRadius: 20, backgroundColor: '#1a1a2e', alignItems: 'center', borderWidth: 1, borderColor: '#2d2d44' },
  levelButtonSelected: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  levelButtonText: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  levelButtonTextSelected: { color: '#fff' },
  list: { padding: 16 },
  templateCard: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2d2d44' },
  templateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  templateTitle: { fontSize: 16, fontWeight: '600', color: '#fff', flex: 1, marginRight: 12 },
  templateBadge: { backgroundColor: '#6366f1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  templateBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  templateDescription: { fontSize: 13, color: '#9ca3af' },
});

