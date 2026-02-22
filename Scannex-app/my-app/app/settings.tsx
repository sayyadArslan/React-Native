import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import useScanStore from '../hooks/useScanStore';

export default function Settings() {
  const router = useRouter();
  const clearHistory = useScanStore((s) => s.clearHistory);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Pressable style={styles.item} onPress={() => router.push('/help')}>
        <Text style={styles.text}>Help & Support</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => router.push('/privacy')}>
        <Text style={styles.text}>Privacy Policy</Text>
      </Pressable>

      <Pressable style={styles.danger} onPress={clearHistory}>
        <Text style={styles.dangerText}>Clear Scan History</Text>
      </Pressable>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { fontSize: 22, color: '#fff', marginBottom: 20, fontWeight: '600' },

  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  text: { color: '#fff', fontSize: 16 },

  danger: {
    marginTop: 30,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#330000',
  },
  dangerText: { color: '#ff5555', textAlign: 'center', fontWeight: '600' },

  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#666',
  },
});
