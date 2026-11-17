import React, { useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import FilePickerButton from '../components/FilePickerButton';
import SearchFiles from '../components/SearchFiles';
import FileInfoPanel from '../components/FileInfoPanel';
import LayerPanel from '../components/LayerPanel';
import Toolbar from '../components/Toolbar';
import DxfCanvas from '../components/DxfCanvas';
import MiniNavigator from '../components/MiniNavigator';

import { parseDxf, DxfResult } from '../utils/dxfLoader';
import { addRecentFile, RecentFile } from '../utils/recentFiles';
import { theme } from '../constants/theme';

export default function Index() {
  const [dxfData, setDxfData] = useState<DxfResult | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number; modified: string } | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [fullScreen, setFullScreen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [fitSignal, setFitSignal] = useState(0);
  const [viewport, setViewport] = useState({ scale: 1, tx: 0, ty: 0, size: { width: 1, height: 1 } });

  const loadFile = async (uri: string, name: string, size: number) => {
    const text = await FileSystem.readAsStringAsync(uri);
    const parsed = parseDxf(text);
    setDxfData(parsed);
    setHiddenLayers(new Set());

    const info = await FileSystem.getInfoAsync(uri);
    const modified = info.exists && info.modificationTime
      ? new Date(info.modificationTime * 1000).toLocaleString()
      : new Date().toLocaleString();

    setFileMeta({ name, size, modified });

    const recent: RecentFile = { name, uri, size, date: modified };
    await addRecentFile(recent);
  };

  const handlePicked = (uri: string, name: string, size: number) => {
    loadFile(uri, name, size);
  };

  const handleSelectRecent = (file: RecentFile) => {
    loadFile(file.uri, file.name, file.size);
  };

  const toggleLayer = (layer: string) => {
    setHiddenLayers((prev) => {
      const next = new Set(prev);
      next.has(layer) ? next.delete(layer) : next.add(layer);
      return next;
    });
  };

  const showAllLayers = () => setHiddenLayers(new Set());

  const onViewportChange = useCallback((scale: number, tx: number, ty: number, size: { width: number; height: number }) => {
    setViewport({ scale, tx, ty, size });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background} />

        {!dxfData && (
          <>
            <Text style={styles.heading}>DXF File Viewer</Text>
            <FilePickerButton onPicked={handlePicked} />
            <SearchFiles onSelect={handleSelectRecent} />
          </>
        )}

        {dxfData && (
          <View style={{ flex: 1 }}>
            <DxfCanvas
              data={dxfData}
              hiddenLayers={hiddenLayers}
              onViewportChange={onViewportChange}
              resetSignal={resetSignal}
              fitSignal={fitSignal}
            />

            <MiniNavigator
              shapes={dxfData.shapes}
              bbox={dxfData.bbox}
              scale={viewport.scale}
              translateX={viewport.tx}
              translateY={viewport.ty}
              canvasSize={viewport.size}
            />

            {!fullScreen && fileMeta && (
              <FileInfoPanel
                name={fileMeta.name}
                size={fileMeta.size}
                version={dxfData.version}
                modified={fileMeta.modified}
              />
            )}

            {!fullScreen && (
              <LayerPanel
                layers={dxfData.layers}
                hiddenLayers={hiddenLayers}
                onToggleLayer={toggleLayer}
                onShowAll={showAllLayers}
              />
            )}

            <Toolbar
              onZoomIn={() => {}}
              onZoomOut={() => {}}
              onRotate={() => {}}
              onFit={() => setFitSignal((s) => s + 1)}
              onReset={() => setResetSignal((s) => s + 1)}
              onFullScreen={() => setFullScreen((f) => !f)}
            />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  heading: {
    color: theme.lime,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 40,
  },
});