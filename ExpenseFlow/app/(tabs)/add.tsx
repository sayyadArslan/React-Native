import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStorage, TransactionType } from '../../hooks/useStorage';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function AddScreen() {
  const router = useRouter();
  const { categories, addTransaction, settings } = useStorage();

  const [type, setType]                       = useState<TransactionType>('expense');
  const [amount, setAmount]                   = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [note, setNote]                       = useState('');
  const [date, setDate]                       = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving]                   = useState(false);

  const filteredCategories = categories.filter(c => c.type === type || c.type === 'both');

  const handleSave = useCallback(async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.'); return;
    }
    if (!selectedCategory) {
      Alert.alert('Select Category', 'Please select a category.'); return;
    }
    setSaving(true);
    try {
      await addTransaction({
        type, amount: Number(amount),
        category: selectedCategory,
        note: note.trim(),
        date: new Date(date).toISOString(),
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Could not save transaction.');
    } finally { setSaving(false); }
  }, [amount, selectedCategory, note, date, type, addTransaction, router]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? '...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          {(['expense', 'income'] as TransactionType[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, type === t && { backgroundColor: t === 'income' ? Colors.income : Colors.expense }]}
              onPress={() => { setType(t); setSelectedCategory(''); }}
            >
              <Text style={styles.typeBtnEmoji}>{t === 'income' ? '💰' : '💸'}</Text>
              <Text style={[styles.typeBtnText, type === t && { color: '#fff', fontWeight: '700' }]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.amountCurrency}>{settings.currency}</Text>
          <TextInput
            style={[styles.amountInput, { color: type === 'income' ? Colors.income : Colors.expense }]}
            placeholder="0.00" placeholderTextColor={Colors.textMuted}
            keyboardType="decimal-pad" value={amount} onChangeText={setAmount} autoFocus
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {filteredCategories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryItem, selectedCategory === cat.name && { backgroundColor: `${cat.color}25`, borderColor: cat.color }]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                <Text style={[styles.categoryName, selectedCategory === cat.name && { color: cat.color }]} numberOfLines={1}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput} placeholder="Add a note..."
            placeholderTextColor={Colors.textMuted}
            value={note} onChangeText={setNote} multiline maxLength={200}
          />
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date</Text>
          <TextInput
            style={styles.dateInput} value={date} onChangeText={setDate}
            placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Summary */}
        {amount && selectedCategory ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            {[
              { label: 'Type',     value: type.toUpperCase(), color: type === 'income' ? Colors.income : Colors.expense },
              { label: 'Amount',   value: `${settings.currency} ${Number(amount).toLocaleString()}`, color: Colors.textPrimary },
              { label: 'Category', value: selectedCategory, color: Colors.textPrimary },
            ].map(row => (
              <View key={row.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={[styles.summaryValue, { color: row.color }]}>{row.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ height: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.backgroundCard, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 14, color: Colors.textSecondary },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.gold, borderRadius: BorderRadius.full, ...Shadows.gold },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: Colors.background },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  typeToggle: { flexDirection: 'row', backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: 4, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: BorderRadius.md, gap: 6 },
  typeBtnEmoji: { fontSize: 16 },
  typeBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textMuted },

  amountCard: { backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.borderGold, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  amountCurrency: { fontSize: 22, color: Colors.textMuted, fontWeight: '600', marginTop: 8 },
  amountInput: { fontSize: 52, fontWeight: '800', letterSpacing: -1, minWidth: 100 },

  section: { marginBottom: Spacing.lg },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: Colors.textMuted, marginBottom: 10 },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border },
  categoryEmoji: { fontSize: 14 },
  categoryName:  { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  noteInput: { backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: Spacing.md, color: Colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: Colors.border, minHeight: 80, textAlignVertical: 'top' },
  dateInput: { backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: Spacing.md, color: Colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: Colors.border },

  summaryCard:  { backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderGold },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: Colors.gold, marginBottom: Spacing.sm },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 13, color: Colors.textMuted },
  summaryValue: { fontSize: 13, fontWeight: '600' },
});