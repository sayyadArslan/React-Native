import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  name: string;
  size: number;
  version: string;
  modified: string;
}

export default function FileInfoPanel({ name, size, version, modified }: Props) {
  const row = (label: string, value: string) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.box}>
      {row('File Name', name)}
      {row('File Size', `${(size / 1024).toFixed(1)} KB`)}
      {row('Version', version)}
      {row('Last Modified', modified)}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: theme.surface,
    margin: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: { color: theme.textMuted, fontSize: 13 },
  value: { color: theme.lime, fontSize: 13, fontWeight: '600' },
});