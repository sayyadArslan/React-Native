import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  layers: string[];
  hiddenLayers: Set<string>;
  onToggleLayer: (layer: string) => void;
  onShowAll: () => void;
}

export default function LayerPanel({ layers, hiddenLayers, onToggleLayer, onShowAll }: Props) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Layers</Text>
        <TouchableOpacity onPress={onShowAll}>
          <Text style={styles.showAll}>Show All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ maxHeight: 180 }}>
        {layers.map((layer) => {
          const hidden = hiddenLayers.has(layer);
          return (
            <TouchableOpacity
              key={layer}
              style={styles.row}
              onPress={() => onToggleLayer(layer)}
            >
              <Text style={styles.eye}>{hidden ? '🚫' : '👁'}</Text>
              <Text style={[styles.layerName, hidden && styles.layerHidden]}>
                {layer}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.surface,
    margin: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: theme.text, fontWeight: '700' },
  showAll: { color: theme.lime, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  eye: { marginRight: 8 },
  layerName: { color: theme.text, fontSize: 13 },
  layerHidden: { color: theme.textMuted, textDecorationLine: 'line-through' },
});