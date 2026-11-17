import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '../constants/theme';

interface Props {
  onPicked: (uri: string, name: string, size: number) => void;
}

export default function FilePickerButton({ onPicked }: Props) {
  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['*/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;
    const asset = result.assets[0];

    if (!asset.name.toLowerCase().endsWith('.dxf')) {
      alert('Please select a valid .dxf file');
      return;
    }

    onPicked(asset.uri, asset.name, asset.size || 0);
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handlePick}>
      <Text style={styles.text}>📂 Open DXF File</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.lime,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
  },
  text: { color: theme.lime, fontSize: 16, fontWeight: '600' },
});