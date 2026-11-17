import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, Alert, TextInput,
} from 'react-native';
import { useStorage } from '../../hooks/useStorage';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');
type TabType = 'overview' | 'categories' | 'goals';

function formatCurrency(amount: number, currency = 'PKR') {
  if (amount >= 1000000) return `${currency} ${(amount/1000000).toFixed(1)}M`;
  if (amount >= 1000)    return `${currency} ${(amount/1000).toFixed(0)}K`;
  return `${currency} ${amount.toLocaleString()}`;
}

export default function ReportsScreen() {
  const { transactions, categories, budgetGoals, addBudgetGoal, deleteBudgetGoal, settings } = useStorage();
  const [tab, setTab]             = useState<TabType>('overview');
  const [viewYear, setViewYear]   = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalCategory, setGoalCategory] = useState('');
  const [goalAmount, setGoalAmount]     = useState('');

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const last6Months = useMemo(() => {
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const txs = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
      });
      result.push({
        label:   monthNames[d.getMonth()],
        income:  txs.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0),
      });
    }
    return result;
  }, [transactions]);

  const maxVal = Math.max(...last6Months.map(m => Math.max(m.income, m.expense)), 1);

  const monthTxs = useMemo(() => transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  }), [transactions, viewYear, viewMonth]);

  const monthIncome  = monthTxs.filter(t => t.type === 'income').reduce((s,t)  => s+t.amount, 0);
  const monthExpense = monthTxs.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);

  const categoryBreakdown = useMemo(() => {
    const map: { [key: string]: { amount: number; type: string; count: number } } = {};
    monthTxs.forEach(t => {
      if (!map[t.category]) map[t.category] = { amount: 0, type: t.type, count: 0 };
      map[t.category].amount += t.amount;
      map[t.category].count  += 1;
    });
    return Object.entries(map).map(([cat, data]) => ({ cat, ...data })).sort((a,b) => b.amount - a.amount);
  }, [monthTxs]);

  const totalCatExpense = categoryBreakdown.filter(c => c.type==='expense').reduce((s,c) => s+c.amount, 0);
  const currentMonthKey = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}`;
  const goalsWithSpent  = budgetGoals.filter(g => g.month === currentMonthKey).map(goal => ({
    ...goal,
    spent: monthTxs.filter(t => t.category===goal.category && t.type==='expense').reduce((s,t) => s+t.amount, 0),
  }));

  const handleAddGoal = async () => {
    if (!goalCategory || !goalAmount || isNaN(Number(goalAmount))) {
      Alert.alert('Invalid', 'Enter category and valid amount.'); return;
    }
    await addBudgetGoal({ category: goalCategory, amount: Number(goalAmount), month: currentMonthKey });
    setGoalCategory(''); setGoalAmount(''); setShowAddGoal(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); }
    else setViewMonth(m => m+1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Reports</Text></View>

      <View style={styles.tabBar}>
        {(['overview','categories','goals'] as TabType[]).map(t => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab===t && styles.tabBtnActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabBtnText, tab===t && styles.tabBtnTextActive]}>
              {t==='overview' ? '📈 Overview' : t==='categories' ? '🏷️ Categories' : '🎯 Goals'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={prevMonth}><Text style={styles.monthArrow}>‹</Text></TouchableOpacity>
          <Text style={styles.monthLabel}>{monthNames[viewMonth]} {viewYear}</Text>
          <TouchableOpacity onPress={nextMonth}><Text style={styles.monthArrow}>›</Text></TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          {[
            { emoji:'💰', label:'Income',  value: monthIncome,  color: Colors.income,  border:`${Colors.income}40` },
            { emoji:'💸', label:'Expense', value: monthExpense, color: Colors.expense, border:`${Colors.expense}40` },
            { emoji:'⚖️', label:'Net', value: Math.abs(monthIncome-monthExpense),
              color: monthIncome-monthExpense>=0 ? Colors.income : Colors.expense, border: Colors.borderGold },
          ].map(item => (
            <View key={item.label} style={[styles.summaryCard, { borderColor: item.border }]}>
              <Text style={styles.summaryEmoji}>{item.emoji}</Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={[styles.summaryValue, { color: item.color }]}>{formatCurrency(item.value, settings.currency)}</Text>
            </View>
          ))}
        </View>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>6-Month Trend</Text>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}><View style={[styles.legendDot,{backgroundColor:Colors.income}]} /><Text style={styles.legendText}>Income</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot,{backgroundColor:Colors.expense}]} /><Text style={styles.legendText}>Expense</Text></View>
              </View>
              <View style={styles.barChart}>
                {last6Months.map((m,i) => (
                  <View key={i} style={styles.barGroup}>
                    <View style={styles.barPair}>
                      <View style={[styles.bar, { height: Math.max(4,(m.income/maxVal)*120), backgroundColor: Colors.income }]} />
                      <View style={[styles.bar, { height: Math.max(4,(m.expense/maxVal)*120), backgroundColor: Colors.expense }]} />
                    </View>
                    <Text style={styles.barLabel}>{m.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Savings Rate</Text>
              {monthIncome > 0 ? (
                <>
                  <View style={styles.savingsRateRow}>
                    <Text style={styles.savingsRateValue}>{(((monthIncome-monthExpense)/monthIncome)*100).toFixed(1)}%</Text>
                    <Text style={styles.savingsRateLabel}>of income saved</Text>
                  </View>
                  <View style={styles.savingsBarBg}>
                    <View style={[styles.savingsBarFill, { width: `${Math.max(0,Math.min(100,((monthIncome-monthExpense)/monthIncome)*100))}%` }]} />
                  </View>
                </>
              ) : <Text style={styles.noDataText}>No income data for this month</Text>}
            </View>
          </>
        )}

        {/* CATEGORIES */}
        {tab === 'categories' && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Expense by Category</Text>
            {categoryBreakdown.filter(c => c.type==='expense').length === 0
              ? <Text style={styles.noDataText}>No expense data</Text>
              : categoryBreakdown.filter(c => c.type==='expense').map(item => {
                const cat = categories.find(c => c.name === item.cat);
                const pct = totalCatExpense > 0 ? (item.amount/totalCatExpense)*100 : 0;
                return (
                  <View key={item.cat} style={styles.catRow}>
                    <View style={styles.catInfo}>
                      <Text style={styles.catEmoji}>{cat?.icon || '📌'}</Text>
                      <View><Text style={styles.catName}>{item.cat}</Text><Text style={styles.catCount}>{item.count} transactions</Text></View>
                    </View>
                    <View style={styles.catRight}>
                      <Text style={styles.catAmount}>{formatCurrency(item.amount, settings.currency)}</Text>
                      <Text style={styles.catPct}>{pct.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.catBarBg}>
                      <View style={[styles.catBarFill, { width:`${pct}%`, backgroundColor: cat?.color || Colors.gold }]} />
                    </View>
                  </View>
                );
              })
            }
          </View>
        )}

        {/* GOALS */}
        {tab === 'goals' && (
          <>
            <TouchableOpacity style={styles.addGoalBtn} onPress={() => setShowAddGoal(!showAddGoal)}>
              <Text style={styles.addGoalBtnText}>+ Add Budget Goal</Text>
            </TouchableOpacity>

            {showAddGoal && (
              <View style={styles.addGoalForm}>
                <Text style={styles.formLabel}>Select Category</Text>
                <View style={styles.goalCategoryGrid}>
                  {categories.filter(c => c.type==='expense'||c.type==='both').map(cat => (
                    <TouchableOpacity key={cat.id}
                      style={[styles.goalCatChip, goalCategory===cat.name && { backgroundColor:`${cat.color}25`, borderColor: cat.color }]}
                      onPress={() => setGoalCategory(cat.name)}
                    >
                      <Text>{cat.icon}</Text>
                      <Text style={[styles.goalCatChipText, goalCategory===cat.name && { color: cat.color }]}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.formLabel}>Budget Amount ({settings.currency})</Text>
                <TextInput style={styles.goalInput} placeholder="Enter amount" placeholderTextColor={Colors.textMuted} keyboardType="decimal-pad" value={goalAmount} onChangeText={setGoalAmount} />
                <View style={styles.goalFormBtns}>
                  <TouchableOpacity style={styles.goalCancelBtn} onPress={() => setShowAddGoal(false)}>
                    <Text style={styles.goalCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.goalSaveBtn} onPress={handleAddGoal}>
                    <Text style={styles.goalSaveBtnText}>Save Goal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {goalsWithSpent.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🎯</Text>
                <Text style={styles.emptyText}>No budget goals yet</Text>
                <Text style={styles.emptySubText}>Tap above to add your first goal</Text>
              </View>
            ) : (
              goalsWithSpent.map(goal => {
                const pct    = Math.min((goal.spent/goal.amount)*100, 100);
                const isOver = goal.spent > goal.amount;
                const cat    = categories.find(c => c.name === goal.category);
                return (
                  <TouchableOpacity key={goal.id} style={styles.goalCard}
                    onLongPress={() => Alert.alert('Delete Goal','Remove this goal?',[
                      { text:'Cancel', style:'cancel' },
                      { text:'Delete', style:'destructive', onPress: () => deleteBudgetGoal(goal.id) },
                    ])}
                  >
                    <View style={styles.goalHeader}>
                      <View style={styles.goalCatInfo}>
                        <Text style={styles.goalCatEmoji}>{cat?.icon||'📌'}</Text>
                        <Text style={styles.goalCatName}>{goal.category}</Text>
                      </View>
                      <Text style={[styles.goalStatus, { color: isOver ? Colors.expense : Colors.income }]}>
                        {isOver ? '⚠️ Over Budget' : '✅ On Track'}
                      </Text>
                    </View>
                    <View style={styles.goalBarBg}>
                      <View style={[styles.goalBarFill, { width:`${pct}%`, backgroundColor: isOver ? Colors.expense : Colors.gold }]} />
                    </View>
                    <View style={styles.goalFooter}>
                      <Text style={styles.goalSpent}>Spent: {formatCurrency(goal.spent, settings.currency)}</Text>
                      <Text style={styles.goalRemaining}>
                        {isOver ? `${formatCurrency(goal.spent-goal.amount,settings.currency)} over` : `${formatCurrency(goal.amount-goal.spent,settings.currency)} left`}
                      </Text>
                      <Text style={styles.goalBudget}>Budget: {formatCurrency(goal.amount, settings.currency)}</Text>
                    </View>
                    <Text style={styles.goalPctText}>{pct.toFixed(0)}% used</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },

  tabBar: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: 8, marginBottom: Spacing.sm },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.backgroundCard, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  tabBtnActive: { backgroundColor: `${Colors.gold}20`, borderColor: Colors.gold },
  tabBtnText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  tabBtnTextActive: { color: Colors.gold },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: Spacing.md },
  monthArrow: { fontSize: 28, color: Colors.gold },
  monthLabel: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, minWidth: 110, textAlign: 'center' },

  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  summaryCard: { flex: 1, backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg, padding: 10, alignItems: 'center', borderWidth: 1 },
  summaryEmoji: { fontSize: 18, marginBottom: 4 },
  summaryLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 2 },
  summaryValue: { fontSize: 12, fontWeight: '700' },

  chartCard: { backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  chartTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  chartLegend: { flexDirection: 'row', gap: 16, marginBottom: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: Colors.textMuted },

  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 150, paddingTop: 20 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 10, borderRadius: 4 },
  barLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },

  savingsRateRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  savingsRateValue: { fontSize: 36, fontWeight: '800', color: Colors.gold },
  savingsRateLabel: { fontSize: 14, color: Colors.textMuted },
  savingsBarBg: { height: 8, backgroundColor: Colors.backgroundElevated, borderRadius: 4, overflow: 'hidden' },
  savingsBarFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 4 },
  noDataText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', paddingVertical: 20 },

  catRow: { marginBottom: Spacing.md },
  catInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  catEmoji: { fontSize: 18 },
  catName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  catCount: { fontSize: 11, color: Colors.textMuted },
  catRight: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catAmount: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  catPct: { fontSize: 12, color: Colors.gold },
  catBarBg: { height: 6, backgroundColor: Colors.backgroundElevated, borderRadius: 3, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 3 },

  addGoalBtn: { backgroundColor:`${Colors.gold}20`, borderRadius:BorderRadius.lg, padding:Spacing.md, alignItems:'center', borderWidth:1, borderColor:Colors.borderGold, marginBottom:Spacing.md },
  addGoalBtnText: { fontSize:15, fontWeight:'700', color:Colors.gold },

  addGoalForm: { backgroundColor:Colors.backgroundCard, borderRadius:BorderRadius.xl, padding:Spacing.md, marginBottom:Spacing.md, borderWidth:1, borderColor:Colors.borderGold },
  formLabel: { fontSize:13, color:Colors.textMuted, fontWeight:'600', marginBottom:8, marginTop:8 },
  goalCategoryGrid: { flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:8 },
  goalCatChip: { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:6, backgroundColor:Colors.backgroundElevated, borderRadius:BorderRadius.full, borderWidth:1, borderColor:Colors.border },
  goalCatChipText: { fontSize:11, color:Colors.textMuted },
  goalInput: { backgroundColor:Colors.backgroundElevated, borderRadius:BorderRadius.lg, padding:Spacing.md, color:Colors.textPrimary, fontSize:15, borderWidth:1, borderColor:Colors.border, marginBottom:Spacing.md },
  goalFormBtns: { flexDirection:'row', gap:10 },
  goalCancelBtn: { flex:1, padding:12, backgroundColor:Colors.backgroundElevated, borderRadius:BorderRadius.lg, alignItems:'center' },
  goalCancelBtnText: { color:Colors.textMuted, fontWeight:'600' },
  goalSaveBtn: { flex:1, padding:12, backgroundColor:Colors.gold, borderRadius:BorderRadius.lg, alignItems:'center' },
  goalSaveBtnText: { color:Colors.background, fontWeight:'700' },

  goalCard: { backgroundColor:Colors.backgroundCard, borderRadius:BorderRadius.xl, padding:Spacing.md, marginBottom:Spacing.md, borderWidth:1, borderColor:Colors.border },
  goalHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  goalCatInfo: { flexDirection:'row', alignItems:'center', gap:8 },
  goalCatEmoji: { fontSize:22 },
  goalCatName: { fontSize:16, fontWeight:'700', color:Colors.textPrimary },
  goalStatus: { fontSize:12, fontWeight:'600' },
  goalBarBg: { height:8, backgroundColor:Colors.backgroundElevated, borderRadius:4, overflow:'hidden', marginBottom:8 },
  goalBarFill: { height:'100%', borderRadius:4 },
  goalFooter: { flexDirection:'row', justifyContent:'space-between' },
  goalSpent: { fontSize:11, color:Colors.textMuted },
  goalRemaining: { fontSize:11, color:Colors.textMuted, fontWeight:'600' },
  goalBudget: { fontSize:11, color:Colors.textMuted },
  goalPctText: { fontSize:12, color:Colors.gold, fontWeight:'600', textAlign:'center', marginTop:6 },

  emptyState: { alignItems:'center', paddingVertical:60 },
  emptyEmoji: { fontSize:48, marginBottom:12 },
  emptyText: { fontSize:16, fontWeight:'600', color:Colors.textPrimary, marginBottom:4 },
  emptySubText: { fontSize:13, color:Colors.textMuted },
});