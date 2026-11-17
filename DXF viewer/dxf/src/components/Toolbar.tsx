import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onFit: () => void;
  onReset: () => void;
  onFullScreen: () => void;
}

export default function Toolbar({ onZoomIn, onZoomOut, onRotate, onFit, onReset, onFullScreen }: Props) {
  const Btn = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.icon}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bar}>
      <Btn label="➕" onPress={onZoomIn} />
      <Btn label="➖" onPress={onZoomOut} />
      <Btn label="🔄" onPress={onRotate} />
      <Btn label="🎯" onPress={onFit} />
      <Btn label="🏠" onPress={onReset} />
      <Btn label="⛶" onPress={onFullScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: theme.surface,
    borderRadius: 30,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  btn: { padding: 8 },
  icon: { fontSize: 20 },
});