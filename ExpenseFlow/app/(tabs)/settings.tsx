import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, TextInput, Share, Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStorage, DEFAULT_CATEGORIES } from '../../hooks/useStorage';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const CURRENCIES    = ['PKR','USD','EUR','GBP','INR','AED','SAR'];
const CATEGORY_ICONS = ['🍔','🚗','🛍️','💡','🏥','🎮','📚','🏠','💼','💻','📈','💹','🎁','📌','✈️','👗','💊','🎵','🏋️','🐾','🍕','☕','🏦','📱','🎬','🌿','💐','🎂','⚽','📦'];
const CATEGORY_COLORS = ['#EF5350','#FF9800','#E91E63','#9C27B0','#2196F3','#00BCD4','#3F51B5','#795548','#4CAF50','#8BC34A','#CDDC39','#D4AF37','#FF5722','#607D8B','#F44336'];
const openPrivacy = () => {
  router.push('/privacy-policy');
};
export default function SettingsScreen() {
  const { categories, settings, transactions, updateSettings, addCategory, deleteCategory, exportBackup, importBackup, clearAllData } = useStorage();

  const [activeSection, setActiveSection]   = useState<string | null>(null);
  const [newCatName, setNewCatName]         = useState('');
  const [newCatIcon, setNewCatIcon]         = useState('📌');
  const [newCatColor, setNewCatColor]       = useState('#D4AF37');
  const [newCatType, setNewCatType]         = useState<'expense'|'income'|'both'>('expense');
  const [restoreText, setRestoreText]       = useState('');

  const toggle = (section: string) => setActiveSection(activeSection === section ? null : section);

  const handleExport = async () => {
    try {
      const data = await exportBackup();
      await Share.share({ message: data, title: 'ExpenseFlow Backup' });
    } catch { Alert.alert('Error', 'Could not export.'); }
  };

  const handleImport = async () => {
    if (!restoreText.trim()) { Alert.alert('Empty','Paste backup JSON first.'); return; }
    Alert.alert('Restore Backup','This will overwrite your current data. Continue?',[
      { text:'Cancel', style:'cancel' },
      { text:'Restore', style:'destructive', onPress: async () => {
        const ok = await importBackup(restoreText);
        Alert.alert(ok ? 'Success' : 'Error', ok ? 'Data restored!' : 'Invalid backup file.');
        if (ok) setRestoreText('');
      }},
    ]);
  };

  const handleClearData = () => {
    Alert.alert('⚠️ Clear All Data','Permanently delete ALL transactions and goals?',[
      { text:'Cancel', style:'cancel' },
      { text:'Clear All', style:'destructive', onPress: clearAllData },
    ]);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) { Alert.alert('Error','Enter a category name.'); return; }
    await addCategory({ name: newCatName.trim(), icon: newCatIcon, color: newCatColor, type: newCatType });
    setNewCatName(''); setNewCatIcon('📌'); setNewCatColor('#D4AF37');
    Alert.alert('Success','Category added!');
  };

  const SectionHeader = ({ title, section, emoji }: { title:string; section:string; emoji:string }) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={() => toggle(section)} activeOpacity={0.7}>
      <View style={styles.sectionHeaderLeft}>
        <Text style={styles.sectionEmoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionArrow}>{activeSection === section ? '▲' : '▼'}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize ExpenseFlow</Text>
      </View>

      {/* App Info Card */}
      <View style={styles.appInfoCard}>
        <Text style={styles.appInfoEmoji}>💎</Text>
        <View>
          <Text style={styles.appInfoName}>ExpenseFlow</Text>
          <Text style={styles.appInfoTagline}>Track. Manage. Grow.</Text>
        </View>
        <View style={styles.appInfoStats}>
          <Text style={styles.appInfoStat}>{transactions.length}</Text>
          <Text style={styles.appInfoStatLabel}>Transactions</Text>
        </View>
      </View>

      {/* General */}
      <SectionHeader title="General" section="general" emoji="⚙️" />
      {activeSection === 'general' && (
        <View style={styles.sectionBody}>
          <Text style={styles.fieldLabel}>Currency</Text>
          <View style={styles.chipRow}>
            {CURRENCIES.map(c => (
              <TouchableOpacity key={c} style={[styles.chip, settings.currency===c && styles.chipActive]} onPress={() => updateSettings({ currency: c })}>
                <Text style={[styles.chipText, settings.currency===c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        
          
        </View>
      )}

      {/* Categories */}
      <SectionHeader title="Categories" section="categories" emoji="🏷️" />
      {activeSection === 'categories' && (
        <View style={styles.sectionBody}>
          <Text style={styles.fieldLabel}>Add New Category</Text>
          <TextInput style={styles.textInput} placeholder="Category name" placeholderTextColor={Colors.textMuted} value={newCatName} onChangeText={setNewCatName} />
          <Text style={styles.fieldLabel}>Icon</Text>
          <View style={styles.iconGrid}>
            {CATEGORY_ICONS.map(icon => (
              <TouchableOpacity key={icon} style={[styles.iconBtn, newCatIcon===icon && styles.iconBtnActive]} onPress={() => setNewCatIcon(icon)}>
                <Text style={styles.iconBtnText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.fieldLabel}>Color</Text>
          <View style={styles.colorGrid}>
            {CATEGORY_COLORS.map(color => (
              <TouchableOpacity key={color} style={[styles.colorBtn, { backgroundColor: color }, newCatColor===color && styles.colorBtnActive]} onPress={() => setNewCatColor(color)} />
            ))}
          </View>
          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.chipRow}>
            {(['expense','income','both'] as const).map(t => (
              <TouchableOpacity key={t} style={[styles.chip, newCatType===t && styles.chipActive]} onPress={() => setNewCatType(t)}>
                <Text style={[styles.chipText, newCatType===t && styles.chipTextActive]}>{t.charAt(0).toUpperCase()+t.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleAddCategory}>
            <Text style={styles.primaryBtnText}>+ Add Category</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={styles.fieldLabel}>All Categories ({categories.length})</Text>
          {categories.map(cat => (
            <View key={cat.id} style={styles.catItem}>
              <View style={[styles.catIconBadge, { backgroundColor:`${cat.color}20` }]}>
                <Text style={styles.catIconEmoji}>{cat.icon}</Text>
              </View>
              <View style={styles.catItemInfo}>
                <Text style={styles.catItemName}>{cat.name}</Text>
                <Text style={[styles.catItemType, { color: cat.color }]}>{cat.type}</Text>
              </View>
              <TouchableOpacity style={styles.deleteCatBtn} onPress={() =>
                Alert.alert('Delete Category',`Delete "${cat.name}"?`,[
                  { text:'Cancel', style:'cancel' },
                  { text:'Delete', style:'destructive', onPress: () => deleteCategory(cat.id) },
                ])
              }>
                <Text style={styles.deleteCatBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.dangerBtn} onPress={() =>
            Alert.alert('Reset Categories','Reset to default categories?',[
              { text:'Cancel', style:'cancel' },
              { text:'Reset', style:'destructive', onPress: async () => {
                await AsyncStorage.setItem('ef_categories', JSON.stringify(DEFAULT_CATEGORIES));
                Alert.alert('Done','Categories reset. Restart app.');
              }},
            ])
          }>
            <Text style={styles.dangerBtnText}>↺ Reset to Defaults</Text>
          </TouchableOpacity>
        </View>
      )}
    
      {/* Backup */}
      <SectionHeader title="Backup & Restore" section="backup" emoji="☁️" />
      {activeSection === 'backup' && (
        <View style={styles.sectionBody}>
          <Text style={styles.backupInfo}>Export your data as JSON. You can restore it anytime by pasting below.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleExport}>
            <Text style={styles.primaryBtnText}>📤 Export Backup</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={styles.fieldLabel}>Paste Backup JSON to Restore</Text>
          <TextInput style={[styles.textInput, { height:100, textAlignVertical:'top' }]}
            placeholder='{"transactions":[...],...}' placeholderTextColor={Colors.textMuted}
            value={restoreText} onChangeText={setRestoreText} multiline />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleImport}>
            <Text style={styles.primaryBtnText}>📥 Restore Backup</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Danger */}
      <SectionHeader title="Danger Zone" section="danger" emoji="⚠️" />
      {activeSection === 'danger' && (
        <View style={styles.sectionBody}>
          <Text style={styles.dangerInfo}>These actions cannot be undone. Export a backup first.</Text>
          <TouchableOpacity style={styles.dangerBtnLarge} onPress={handleClearData}>
            <Text style={styles.dangerBtnLargeText}>🗑️ Clear All Transactions</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.primaryBtn} onPress={openPrivacy}>
      <Text style={styles.primaryBtnText}>🔒 Privacy Policy</Text>
    </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>ExpenseFlow v1.0</Text>
        <Text style={styles.footerSubText}>Track. Manage. Grow. 💎</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content:   { paddingBottom: 80 },
  header: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md },
  headerTitle:    { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },

  appInfoCard: { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:Colors.backgroundCard, marginHorizontal:Spacing.md, borderRadius:BorderRadius.xl, padding:Spacing.md, marginBottom:Spacing.md, borderWidth:1, borderColor:Colors.borderGold, ...Shadows.gold },
  appInfoEmoji:   { fontSize: 32 },
  appInfoName:    { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  appInfoTagline: { fontSize: 11, color: Colors.gold },
  appInfoStats:   { marginLeft: 'auto', alignItems: 'center' },
  appInfoStat:      { fontSize: 22, fontWeight: '800', color: Colors.gold },
  appInfoStatLabel: { fontSize: 10, color: Colors.textMuted },

  sectionHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:Spacing.md, paddingVertical:14, backgroundColor:Colors.backgroundCard, marginHorizontal:Spacing.md, marginBottom:2, borderRadius:BorderRadius.lg, borderWidth:1, borderColor:Colors.border, marginTop:8 },
  sectionHeaderLeft: { flexDirection:'row', alignItems:'center', gap:10 },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  sectionArrow: { fontSize: 10, color: Colors.textMuted },

  sectionBody: { backgroundColor:Colors.backgroundCard, marginHorizontal:Spacing.md, borderRadius:BorderRadius.lg, padding:Spacing.md, borderWidth:1, borderColor:Colors.border, borderTopWidth:0, borderTopLeftRadius:0, borderTopRightRadius:0 },

  fieldLabel: { fontSize:12, color:Colors.textMuted, fontWeight:'600', marginBottom:8, marginTop:8 },
  chipRow: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:4 },
  chip:       { paddingHorizontal:14, paddingVertical:6, borderRadius:BorderRadius.full, backgroundColor:Colors.backgroundElevated, borderWidth:1, borderColor:Colors.border },
  chipActive: { backgroundColor:`${Colors.gold}20`, borderColor:Colors.gold },
  chipText:       { fontSize:13, color:Colors.textMuted, fontWeight:'500' },
  chipTextActive: { color:Colors.gold, fontWeight:'700' },

  toggleRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:10, borderTopWidth:1, borderTopColor:Colors.divider, marginTop:8 },
  toggleLabel: { fontSize:14, color:Colors.textPrimary, fontWeight:'600' },
  toggleSub:   { fontSize:11, color:Colors.textMuted, marginTop:2 },

  textInput: { backgroundColor:Colors.backgroundElevated, borderRadius:BorderRadius.lg, padding:Spacing.md, color:Colors.textPrimary, fontSize:14, borderWidth:1, borderColor:Colors.border, marginBottom:8 },
  iconGrid: { flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:8 },
  iconBtn:       { width:40, height:40, borderRadius:BorderRadius.md, backgroundColor:Colors.backgroundElevated, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:Colors.border },
  iconBtnActive: { borderColor:Colors.gold, backgroundColor:`${Colors.gold}20` },
  iconBtnText:   { fontSize:18 },
  colorGrid: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:8 },
  colorBtn:       { width:28, height:28, borderRadius:14, borderWidth:2, borderColor:'transparent' },
  colorBtnActive: { borderColor:Colors.textPrimary },

  primaryBtn:     { backgroundColor:Colors.gold, borderRadius:BorderRadius.lg, padding:14, alignItems:'center', marginTop:8, ...Shadows.gold },
  primaryBtnText: { fontSize:15, fontWeight:'700', color:Colors.background },
  divider: { height:1, backgroundColor:Colors.divider, marginVertical:Spacing.md },

  catItem: { flexDirection:'row', alignItems:'center', paddingVertical:8, borderBottomWidth:1, borderBottomColor:Colors.divider, gap:10 },
  catIconBadge: { width:36, height:36, borderRadius:18, alignItems:'center', justifyContent:'center' },
  catIconEmoji: { fontSize:16 },
  catItemInfo:  { flex:1 },
  catItemName:  { fontSize:14, fontWeight:'600', color:Colors.textPrimary },
  catItemType:  { fontSize:11, textTransform:'capitalize', fontWeight:'500' },
  deleteCatBtn:     { padding:6 },
  deleteCatBtnText: { fontSize:16 },

  dangerBtn:     { padding:12, borderRadius:BorderRadius.lg, alignItems:'center', backgroundColor:`${Colors.expense}15`, borderWidth:1, borderColor:`${Colors.expense}40`, marginTop:10 },
  dangerBtnText: { color:Colors.expense, fontWeight:'600', fontSize:13 },
  backupInfo: { fontSize:13, color:Colors.textMuted, lineHeight:18, marginBottom:12 },
  dangerInfo: { fontSize:13, color:Colors.expense, lineHeight:18, marginBottom:12 },
  dangerBtnLarge:     { padding:16, borderRadius:BorderRadius.lg, alignItems:'center', backgroundColor:`${Colors.expense}15`, borderWidth:1, borderColor:`${Colors.expense}40` },
  dangerBtnLargeText: { color:Colors.expense, fontWeight:'700', fontSize:15 },

  footer:        { alignItems:'center', paddingVertical:Spacing.xl },
  footerText:    { fontSize:13, color:Colors.textMuted, fontWeight:'600' },
  footerSubText: { fontSize:11, color:Colors.gold, marginTop:2 },
});