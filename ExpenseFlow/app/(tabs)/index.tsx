import React, { useState, useCallback } from 'react';

import { router } from 'expo-router';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, Dimensions,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useStorage } from '../../hooks/useStorage';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

function formatCurrency(amount: number, currency = 'PKR') {
  if (amount >= 1000000) return `${currency} ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000)    return `${currency} ${(amount / 1000).toFixed(1)}K`;
  return `${currency} ${amount.toLocaleString()}`;
}

function formatDate(iso: string) {
  const d    = new Date(iso);
  const now  = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000)  return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
}

export default function HomeScreen() {
  const router = useRouter();
    const {
    transactions,
    categories,
    budgetGoals,
    settings,
    getTotalBalance,
    getMonthSummary,
    reload,
  } = useStorage();
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const now          = new Date();
  const monthSummary = getMonthSummary(now.getFullYear(), now.getMonth());
  const { income, expense, balance } = getTotalBalance();
  const recent       = transactions.slice(0, 5);
    useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );
  const getCategoryInfo = (catName: string) =>
    categories.find(c => c.name === catName) || { icon: '📌', color: Colors.textMuted };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const thisMonthGoals = budgetGoals.filter(g => {
    const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return g.month === m;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
          tintColor={Colors.gold} colors={[Colors.gold]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.appName}>ExpenseFlow</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/(tabs)/settings')}>
          <Text style={styles.avatarText}>💎</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <TouchableOpacity style={styles.balanceCard} onPress={() => setShowBalance(!showBalance)} activeOpacity={0.9}>
        <View style={styles.balanceCardGlow} />
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          {showBalance ? formatCurrency(balance, settings.currency) : '••••••••'}
        </Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatIcon}>↑</Text>
            <View>
              <Text style={styles.balanceStatLabel}>Income</Text>
              <Text style={[styles.balanceStatValue, { color: Colors.income }]}>
                {showBalance ? formatCurrency(income, settings.currency) : '•••'}
              </Text>
            </View>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatIcon}>↓</Text>
            <View>
              <Text style={styles.balanceStatLabel}>Expense</Text>
              <Text style={[styles.balanceStatValue, { color: Colors.expense }]}>
                {showBalance ? formatCurrency(expense, settings.currency) : '•••'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* This Month */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>This Month</Text>
        <Text style={styles.sectionSubtitle}>
          {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
      </View>
      <View style={styles.monthRow}>
        {[
          { emoji: '💰', label: 'Income',  value: monthSummary.income,  color: Colors.income,  border: `${Colors.income}40` },
          { emoji: '💸', label: 'Expense', value: monthSummary.expense, color: Colors.expense, border: `${Colors.expense}40` },
          { emoji: '⚖️', label: 'Net',     value: Math.abs(monthSummary.balance),
            color: monthSummary.balance >= 0 ? Colors.income : Colors.expense,
            border: Colors.borderGold },
        ].map(item => (
          <View key={item.label} style={[styles.monthCard, { borderColor: item.border }]}>
            <Text style={styles.monthCardEmoji}>{item.emoji}</Text>
            <Text style={styles.monthCardLabel}>{item.label}</Text>
            <Text style={[styles.monthCardValue, { color: item.color }]}>
              {formatCurrency(item.value, settings.currency)}
            </Text>
          </View>
        ))}
      </View>

      {/* Budget Goals */}
      {thisMonthGoals.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget Goals</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/reports')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {thisMonthGoals.slice(0, 2).map(goal => {
            const pct   = Math.min((goal.spent / goal.amount) * 100, 100);
            const isOver = goal.spent > goal.amount;
            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalRow}>
                  <Text style={styles.goalCategory}>{goal.category}</Text>
                  <Text style={[styles.goalPct, { color: isOver ? Colors.expense : Colors.gold }]}>
                    {pct.toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.goalBarBg}>
                  <View style={[styles.goalBarFill, {
                    width: `${pct}%`,
                    backgroundColor: isOver ? Colors.expense : Colors.gold,
                  }]} />
                </View>
                <View style={styles.goalRow}>
                  <Text style={styles.goalSpent}>Spent: {formatCurrency(goal.spent, settings.currency)}</Text>
                  <Text style={styles.goalBudget}>Budget: {formatCurrency(goal.amount, settings.currency)}</Text>
                </View>
              </View>
            );
          })}
        </>
      )}

      {/* Recent Transactions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
          <Text style={styles.seeAll}>See All →</Text>
        </TouchableOpacity>
      </View>

      {recent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💫</Text>
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubText}>Tap + to add your first transaction</Text>
        </View>
      ) : (
        recent.map(tx => {
          const cat = getCategoryInfo(tx.category);
          return (
            <TouchableOpacity key={tx.id} style={styles.txCard} activeOpacity={0.8}>
              <View style={[styles.txIcon, { backgroundColor: `${cat.color}20` }]}>
                <Text style={styles.txIconEmoji}>{cat.icon}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txCategory}>{tx.category}</Text>
                <Text style={styles.txNote} numberOfLines={1}>{tx.note || 'No note'}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: tx.type === 'income' ? Colors.income : Colors.expense }]}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                </Text>
                <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.quickActions}>
        {[
          { emoji: '💰', label: 'Add Income',  action: () => router.push('/(tabs)/add') },
          { emoji: '💸', label: 'Add Expense', action: () => router.push('/(tabs)/add') },
          { emoji: '📊', label: 'Reports',     action: () => router.push('/(tabs)/reports') },
          { emoji: '🎯', label: 'Goals',       action: () => router.push('/(tabs)/reports') },
        ].map(item => (
          <TouchableOpacity key={item.label} style={styles.quickBtn} onPress={item.action}>
            <Text style={styles.quickBtnEmoji}>{item.emoji}</Text>
            <Text style={styles.quickBtnLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content:   { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { fontSize: 13, color: Colors.textMuted, marginBottom: 2 },
  appName:  { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  avatarBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1, borderColor: Colors.borderGold,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22 },

  balanceCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl, padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.borderGold,
    overflow: 'hidden', ...Shadows.gold,
  },
  balanceCardGlow: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: `${Colors.gold}10`,
  },
  balanceLabel:  { fontSize: 13, color: Colors.textMuted, marginBottom: 6 },
  balanceAmount: { fontSize: 36, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.md, letterSpacing: -1 },
  balanceRow:    { flexDirection: 'row', alignItems: 'center' },
  balanceStat:   { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  balanceStatIcon:  { fontSize: 20, color: Colors.gold },
  balanceStatLabel: { fontSize: 11, color: Colors.textMuted },
  balanceStatValue: { fontSize: 15, fontWeight: '700' },
  balanceDivider: { width: 1, height: 36, backgroundColor: Colors.border, marginHorizontal: Spacing.md },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.md },
  sectionTitle:    { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  sectionSubtitle: { fontSize: 12, color: Colors.textMuted },
  seeAll: { fontSize: 13, color: Colors.gold, fontWeight: '600' },

  monthRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  monthCard: { flex: 1, backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: 10, borderWidth: 1, alignItems: 'center' },
  monthCardEmoji: { fontSize: 18, marginBottom: 4 },
  monthCardLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 2 },
  monthCardValue: { fontSize: 13, fontWeight: '700' },

  goalCard: { backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  goalRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  goalCategory: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  goalPct:      { fontSize: 14, fontWeight: '700' },
  goalBarBg:    { height: 6, backgroundColor: Colors.backgroundElevated, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  goalBarFill:  { height: '100%', borderRadius: 3 },
  goalSpent:    { fontSize: 11, color: Colors.textMuted },
  goalBudget:   { fontSize: 11, color: Colors.textMuted },

  txCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  txIcon:      { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txIconEmoji: { fontSize: 20 },
  txInfo:      { flex: 1 },
  txCategory:  { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  txNote:      { fontSize: 12, color: Colors.textMuted },
  txRight:     { alignItems: 'flex-end' },
  txAmount:    { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  txDate:      { fontSize: 11, color: Colors.textMuted },

  emptyState:   { alignItems: 'center', paddingVertical: Spacing.xxl, backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  emptyEmoji:   { fontSize: 40, marginBottom: 12 },
  emptyText:    { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  emptySubText: { fontSize: 13, color: Colors.textMuted },

  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickBtn: {
    flex: 1, minWidth: (width - Spacing.md * 2 - 30) / 2,
    backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  quickBtnEmoji: { fontSize: 24 },
  quickBtnLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },
});