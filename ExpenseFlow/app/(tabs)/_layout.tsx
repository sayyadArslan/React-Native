import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../../constants/theme';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
      {focused && <View style={styles.tabDot} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="transactions"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💸" label="Txns" focused={focused} /> }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Reports" focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Settings" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.backgroundCard,
    borderTopColor: Colors.borderGold,
    borderTopWidth: 1,
    height: 100,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    minWidth: 60,
  },
  tabItemActive: { backgroundColor: `${Colors.gold}15` },
  tabEmoji: { fontSize: 20 },
  tabLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 2, fontWeight: '500' },
  tabLabelActive: { color: Colors.gold, fontWeight: '700' },
  tabDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: Colors.gold,
    position: 'absolute', bottom: -2,
  },
  addButton: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 10,
  },
  addButtonText: {
    fontSize: 28, color: Colors.background,
    fontWeight: '300', lineHeight: 32,
  },
});