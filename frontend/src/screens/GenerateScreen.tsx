import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useUserStore } from '../store/userStore';
import { useWorkoutStore } from '../store/workoutStore';
import { Goal, Duration, Location, Equipment, Restriction } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Generate'>;

export default function GenerateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { ticketBalance } = useUserStore();
  const { setGenerateParams, generate, isGenerating, error } = useWorkoutStore();

  const [goal, setGoal] = useState<Goal>('strength');
  const [duration, setDuration] = useState<Duration>(30);
  const [location, setLocation] = useState<Location>('home');
  const [equipment, setEquipment] = useState<Equipment>('none');
  const [restrictions, setRestrictions] = useState<Restriction[]>(['none']);
  const [frequency, setFrequency] = useState<number>(3);

  const handleGenerate = async () => {
    if (ticketBalance < 1) { Alert.alert('チケット不足', 'チケットを購入してください'); return; }
    setGenerateParams({ goal, duration, location, equipment, restrictions, frequency });
    const success = await generate();
    if (success) { navigation.navigate('Result', {}); }
    else if (error) { Alert.alert('エラー', error); }
  };

  const toggleRestriction = (r: Restriction) => {
    if (r === 'none') { setRestrictions(['none']); }
    else {
      const newRestrictions = restrictions.filter((x) => x !== 'none');
      if (newRestrictions.includes(r)) {
        const filtered = newRestrictions.filter((x) => x !== r);
        setRestrictions(filtered.length > 0 ? filtered : ['none']);
      } else { setRestrictions([...newRestrictions, r]); }
    }
  };

  const goalOptions: { value: Goal; label: string; icon: string }[] = [
    { value: 'strength', label: '筋力アップ', icon: '💪' },
    { value: 'weightLoss', label: '減量', icon: '🔥' },
    { value: 'endurance', label: '持久力', icon: '🏃' },
    { value: 'performance', label: 'パフォーマンス', icon: '🏆' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.ticketBanner}>
        <Text style={styles.ticketText}>🎫 残り {ticketBalance} チケット</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 目的</Text>
        <View style={styles.optionGrid}>
          {goalOptions.map((opt) => (
            <TouchableOpacity key={opt.value} style={[styles.optionCard, goal === opt.value && styles.optionCardSelected]} onPress={() => setGoal(opt.value)}>
              <Text style={styles.optionIcon}>{opt.icon}</Text>
              <Text style={[styles.optionLabel, goal === opt.value && styles.optionLabelSelected]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏱️ 時間</Text>
        <View style={styles.optionRow}>
          {([15, 30, 45, 60] as Duration[]).map((d) => (
            <TouchableOpacity key={d} style={[styles.timeButton, duration === d && styles.timeButtonSelected]} onPress={() => setDuration(d)}>
              <Text style={[styles.timeButtonText, duration === d && styles.timeButtonTextSelected]}>{d}分</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 場所</Text>
        <View style={styles.optionRow}>
          {[{ value: 'home' as Location, label: '自宅', icon: '🏠' }, { value: 'gym' as Location, label: 'ジム', icon: '🏋️' }].map((opt) => (
            <TouchableOpacity key={opt.value} style={[styles.locationButton, location === opt.value && styles.locationButtonSelected]} onPress={() => setLocation(opt.value)}>
              <Text style={styles.locationIcon}>{opt.icon}</Text>
              <Text style={[styles.locationLabel, location === opt.value && styles.locationLabelSelected]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏋️ 器具</Text>
        <View style={styles.chipContainer}>
          {[{ value: 'none' as Equipment, label: 'なし' }, { value: 'dumbbells' as Equipment, label: 'ダンベル' }, { value: 'machines' as Equipment, label: 'マシン' }, { value: 'barbell' as Equipment, label: 'バーベル' }].map((opt) => (
            <TouchableOpacity key={opt.value} style={[styles.chip, equipment === opt.value && styles.chipSelected]} onPress={() => setEquipment(opt.value)}>
              <Text style={[styles.chipText, equipment === opt.value && styles.chipTextSelected]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ 痛み・制約</Text>
        <View style={styles.chipContainer}>
          {[{ value: 'none' as Restriction, label: 'なし', icon: '✅' }, { value: 'knee' as Restriction, label: '膝', icon: '🦵' }, { value: 'back' as Restriction, label: '腰', icon: '🔙' }, { value: 'shoulder' as Restriction, label: '肩', icon: '💪' }].map((opt) => (
            <TouchableOpacity key={opt.value} style={[styles.chip, restrictions.includes(opt.value) && styles.chipSelected]} onPress={() => toggleRestriction(opt.value)}>
              <Text style={[styles.chipText, restrictions.includes(opt.value) && styles.chipTextSelected]}>{opt.icon} {opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 週の頻度</Text>
        <View style={styles.frequencyRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((f) => (
            <TouchableOpacity key={f} style={[styles.frequencyButton, frequency === f && styles.frequencyButtonSelected]} onPress={() => setFrequency(f)}>
              <Text style={[styles.frequencyText, frequency === f && styles.frequencyTextSelected]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.frequencyLabel}>週{frequency}回</Text>
      </View>

      <TouchableOpacity style={[styles.generateButton, (isGenerating || ticketBalance < 1) && styles.generateButtonDisabled]} onPress={handleGenerate} disabled={isGenerating || ticketBalance < 1}>
        <Text style={styles.generateButtonText}>{isGenerating ? '🔄 生成中...' : '🤖 AIでメニューを生成'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  ticketBanner: { backgroundColor: '#1a1a2e', padding: 16 },
  ticketText: { fontSize: 16, fontWeight: '600', color: '#6366f1' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionCard: { width: '48%', backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2d2d44' },
  optionCardSelected: { borderColor: '#6366f1', backgroundColor: '#1a1a3e' },
  optionIcon: { fontSize: 28, marginBottom: 8 },
  optionLabel: { fontSize: 13, color: '#9ca3af', textAlign: 'center' },
  optionLabelSelected: { color: '#fff', fontWeight: '600' },
  optionRow: { flexDirection: 'row', gap: 10 },
  timeButton: { flex: 1, backgroundColor: '#1a1a2e', paddingVertical: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#2d2d44' },
  timeButtonSelected: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  timeButtonText: { fontSize: 16, fontWeight: '600', color: '#9ca3af' },
  timeButtonTextSelected: { color: '#fff' },
  locationButton: { flex: 1, backgroundColor: '#1a1a2e', paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2d2d44' },
  locationButtonSelected: { borderColor: '#6366f1', backgroundColor: '#1a1a3e' },
  locationIcon: { fontSize: 24, marginBottom: 4 },
  locationLabel: { fontSize: 14, color: '#9ca3af' },
  locationLabelSelected: { color: '#fff', fontWeight: '600' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#1a1a2e', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#2d2d44' },
  chipSelected: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  chipText: { color: '#9ca3af', fontSize: 14 },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  frequencyRow: { flexDirection: 'row', gap: 8 },
  frequencyButton: { flex: 1, backgroundColor: '#1a1a2e', paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#2d2d44' },
  frequencyButtonSelected: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  frequencyText: { fontSize: 16, fontWeight: '600', color: '#9ca3af' },
  frequencyTextSelected: { color: '#fff' },
  frequencyLabel: { textAlign: 'center', marginTop: 8, fontSize: 14, color: '#6b7280' },
  generateButton: { margin: 16, backgroundColor: '#6366f1', padding: 18, borderRadius: 12, alignItems: 'center' },
  generateButtonDisabled: { opacity: 0.5 },
  generateButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

