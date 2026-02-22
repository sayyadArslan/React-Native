import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Alert } from 'react-native';

export default function Result() {
  const { data, type } = useLocalSearchParams();
  const router = useRouter();

  const openLink = () => {
    if (typeof data === 'string' && data.startsWith('http')) {
      Linking.openURL(data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>RESULT</Text>
      <Text style={styles.value}>{data}</Text>
      <Text style={styles.type}>{type}</Text>

      {typeof data === 'string' && data.startsWith('http') && (
        <Pressable style={styles.btn} onPress={openLink}>
          <Text style={styles.btnText}>Open link</Text>
        </Pressable>
      )}

      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>Scan Again</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 18,
    marginVertical: 12,
    color: '#000',
  },
  type: {
    color: '#444',
  },
  btn: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  back: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    borderRadius: 8,
  },
  backText: {
    textAlign: 'center',
    color: '#000',
  },
  

});
