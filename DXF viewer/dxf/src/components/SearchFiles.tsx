import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getRecentFiles, RecentFile } from '../utils/recentFiles';
import { theme } from '../constants/theme';

interface Props {
  onSelect: (file: RecentFile) => void;
}

export default function SearchFiles({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [files, setFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    getRecentFiles().then(setFiles);
  }, []);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="🔍 Search files..."
        placeholderTextColor={theme.textMuted}
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
            <Text style={styles.itemText}>📄 {item.name}</Text>
            <Text style={styles.itemSub}>{(item.size / 1024).toFixed(1)} KB</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No files found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginTop: 16, flex: 1 },
  input: {
    backgroundColor: theme.surface,
    color: theme.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  itemText: { color: theme.text, fontSize: 14 },
  itemSub: { color: theme.textMuted, fontSize: 12, marginTop: 2 },
  empty: { color: theme.textMuted, textAlign: 'center', marginTop: 20 },
});