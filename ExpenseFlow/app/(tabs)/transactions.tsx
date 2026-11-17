import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStorage, Transaction } from '../../hooks/useStorage';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';

type FilterType = 'all' | 'income' | 'expense';
type SortType   = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

function formatCurrency(amount: number, currency = 'PKR') {
  return `${currency} ${amount.toLocaleString()}`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions, categories, deleteTransaction, settings } = useStorage();
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState<FilterType>('all');
  const [sort, setSort]               = useState<SortType>('date_desc');
  const [showFilters, setShowFilters] = useState(false);

  const getCategoryInfo = (catName: string) =>
    categories.find(c => c.name === catName) || { icon: '📌', color: Colors.textMuted };

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filter !== 'all') list = list.filter(t => t.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.category.toLowerCase().includes(q) ||
        t.note.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      );
    }
    list.sort((a, b) => {
      switch (sort) {
        case 'date_desc':   return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':    return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount_desc': return b.amount - a.amount;
        case 'amount_asc':  return a.amount - b.amount;
        default: return 0;
      }
    });
    return list;
  }, [transactions, filter, search, sort]);

  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const handleDelete = (tx: Transaction) => {
    Alert.alert('Delete Transaction', `Delete this ${tx.type}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(tx.id) },
    ]);
  };

  const grouped = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    filtered.forEach(tx => {
      const key = tx.date.split('T')[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return Object.entries(groups).sort(([a], [b]) =>
      sort === 'date_asc' ? a.localeCompare(b) : b.localeCompare(a)
    );
  }, [filtered, sort]);

  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity style={[styles.filterChip, active && styles.filterChipActive]} onPress={onPress}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.filterToggleBtn} onPress={() => setShowFilters(!showFilters)}>
          <Text style={styles.filterToggleText}>⚡ Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor={Colors.textMuted} value={search} onChangeText={setSearch} />
        {search ? <TouchableOpacity onPress={() => setSearch('')}><Text style={styles.clearSearch}>✕</Text></TouchableOpacity> : null}
      </View>

      {showFilters && (
        <View style={styles.filterPanel}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Type:</Text>
            {(['all','income','expense'] as FilterType[]).map(f => (
              <Chip key={f} label={f.charAt(0).toUpperCase()+f.slice(1)} active={filter===f} onPress={() => setFilter(f)} />
            ))}
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Sort:</Text>
            {[{v:'date_desc',l:'Newest'},{v:'date_asc',l:'Oldest'},{v:'amount_desc',l:'High ₹'},{v:'amount_asc',l:'Low ₹'}].map(o => (
              <Chip key={o.v} label={o.l} active={sort===o.v} onPress={() => setSort(o.v as SortType)} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.summaryBar}>
        <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Showing</Text><Text style={styles.summaryStatValue}>{filtered.length} txns</Text></View>
        <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Income</Text><Text style={[styles.summaryStatValue,{color:Colors.income}]}>+{formatCurrency(totalIncome,settings.currency)}</Text></View>
        <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Expense</Text><Text style={[styles.summaryStatValue,{color:Colors.expense}]}>-{formatCurrency(totalExpense,settings.currency)}</Text></View>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={([date]) => date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubText}>Try changing your filters</Text>
          </View>
        )}
        renderItem={({ item: [dateKey, txs] }) => (
          <View style={styles.dateGroup}>
            <View style={styles.dateLabelRow}>
              <Text style={styles.dateLabel}>{formatDate(dateKey)}</Text>
              <Text style={styles.dateLabelTotal}>
                {formatCurrency(txs.reduce((s,t) => t.type==='income' ? s+t.amount : s-t.amount, 0), settings.currency)}
              </Text>
            </View>
            {txs.map(tx => {
              const cat = getCategoryInfo(tx.category);
              return (
                <TouchableOpacity key={tx.id} style={styles.txCard} onLongPress={() => handleDelete(tx)} activeOpacity={0.8}>
                  <View style={[styles.txIcon, { backgroundColor: `${cat.color}20` }]}>
                    <Text style={styles.txIconEmoji}>{cat.icon}</Text>
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txCategory}>{tx.category}</Text>
                    <Text style={styles.txNote} numberOfLines={1}>{tx.note || 'No note'}</Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmount, { color: tx.type==='income' ? Colors.income : Colors.expense }]}>
                      {tx.type==='income' ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                    </Text>
                    <Text style={styles.txType}>{tx.type}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/add')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  filterToggleBtn: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.borderGold },
  filterToggleText: { fontSize: 13, color: Colors.gold, fontWeight: '600' },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundCard, marginHorizontal: Spacing.md, borderRadius: BorderRadius.lg, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  searchIcon:  { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: 14, paddingVertical: 10 },
  clearSearch: { fontSize: 12, color: Colors.textMuted, padding: 4 },

  filterPanel: { backgroundColor: Colors.backgroundCard, marginHorizontal: Spacing.md, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  filterRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  filterLabel: { fontSize: 12, color: Colors.textMuted, width: 40 },
  filterChip:  { paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.full, backgroundColor: Colors.backgroundElevated, borderWidth: 1, borderColor: Colors.border },
  filterChipActive:     { backgroundColor: `${Colors.gold}20`, borderColor: Colors.gold },
  filterChipText:       { fontSize: 12, color: Colors.textMuted },
  filterChipTextActive: { color: Colors.gold, fontWeight: '600' },

  summaryBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: 8, backgroundColor: Colors.backgroundCard, marginHorizontal: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  summaryStat:      { alignItems: 'center' },
  summaryStatLabel: { fontSize: 10, color: Colors.textMuted },
  summaryStatValue: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },

  listContent: { paddingHorizontal: Spacing.md, paddingBottom: 100 },
  dateGroup:    { marginBottom: Spacing.md },
  dateLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dateLabel:      { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  dateLabelTotal: { fontSize: 12, color: Colors.textMuted },

  txCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: 6, borderWidth: 1, borderColor: Colors.border },
  txIcon:      { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txIconEmoji: { fontSize: 20 },
  txInfo:      { flex: 1 },
  txCategory:  { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  txNote:      { fontSize: 12, color: Colors.textMuted },
  txRight:     { alignItems: 'flex-end' },
  txAmount:    { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  txType:      { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase' },

  emptyState:   { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji:   { fontSize: 48, marginBottom: 12 },
  emptyText:    { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  emptySubText: { fontSize: 13, color: Colors.textMuted },

  fab: { position: 'absolute', bottom: 30, right: 24, width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  fabText: { fontSize: 28, color: Colors.background, lineHeight: 32, fontWeight: '300' },
});