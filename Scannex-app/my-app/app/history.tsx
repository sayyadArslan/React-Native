import { View, Text, FlatList, StyleSheet } from 'react-native';
import useScanStore from '../hooks/useScanStore';

export default function HistoryScreen() {
  const { history } = useScanStore();

  const isToday = (time: number) => {
    const today = new Date();
    const date = new Date(time);
    return today.toDateString() === date.toDateString();
  };

  const isYesterday = (time: number) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = new Date(time);
    return yesterday.toDateString() === date.toDateString();
  };

  const grouped = {
    Today: history.filter(h => isToday(h.createdAt)),
    Yesterday: history.filter(h => isYesterday(h.createdAt)),
    Older: history.filter(
      h => !isToday(h.createdAt) && !isYesterday(h.createdAt)
    ),
  };

  return (
    <View style={styles.container}>
      {Object.entries(grouped).map(([title, items]) =>
        items.length === 0 ? null : (
          <View key={title}>
            <Text style={styles.heading}>{title}</Text>

            {items.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.type}>{item.type}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))}
          </View>
        )
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  type: {
    color: '#aaa',
    fontSize: 12,
  },
  value: {
    color: '#fff',
    fontSize: 15,
  },
});
