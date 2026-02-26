import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import useScanStore from '../hooks/useScanStore';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const FRAME = width * 0.7;

export default function Index() {
  const router = useRouter();
  const addScan = useScanStore((s) => s.addScan);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanEnabled, setScanEnabled] = useState(false);
  const [flash, setFlash] = useState<'on' | 'off'>('off');

  // Reset scanner when screen focuses
  useFocusEffect(
    useCallback(() => {
      setScanEnabled(false);
    }, [])
  );

  // 🔐 Permission Screen
  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera permission required</Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  // 📦 Handle scan result (SAFE & STABLE)
  const onScan = (data: string, type: string) => {
    if (!scanEnabled) return; // ⛔ prevent multiple scans

    setScanEnabled(false);

    addScan({
      id: Date.now().toString(),
      value: data,
      type,
    });

    router.push({
      pathname: '/result',
      params: { data, type },
    });
  };

  return (
    <View style={styles.container}>
      {/* CAMERA */}
      <CameraView
        style={StyleSheet.absoluteFill}
        enableTorch={flash === 'on'}
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr',
            'ean13',
            'ean8',
            'upc_a',
            'code128',
            'code39',
            'pdf417',
          ],
        }}
        onBarcodeScanned={
          scanEnabled
            ? ({ data, type }) => onScan(data, type)
            : undefined
        }
      />

      {/* SCAN FRAME */}
      <View style={styles.overlay}>
        <View style={styles.frame} />
        <Text style={styles.hint}>
          {scanEnabled ? 'Scanning...' : 'Tap Search to Scan'}
        </Text>
      </View>

      {/* BOTTOM CONTROLS */}
      <View style={styles.bottom}>
        {/* Flash */}
        <Pressable
          style={styles.iconBtn}
          onPress={() => setFlash(flash === 'on' ? 'off' : 'on')}
        >
          <Text style={styles.iconText}>
            {flash === 'on' ? '⚡' : '⚡︎'}
          </Text>
        </Pressable>

        {/* Scan Button */}
        <Pressable
          style={styles.scanBtn}
          onPress={() => setScanEnabled(true)}
        >
          <Image
            source={require('../assets/images/search.png')}
            style={styles.searchImg}
          />
        </Pressable>

        {/* Spacer */}
        <View style={{ width: 52 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  center: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: '#fff',
    marginBottom: 20,
  },

  btn: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  frame: {
    width: FRAME,
    height: FRAME,
    borderWidth: 8,
    borderColor: 'lime',
    borderRadius: 18,
  },

  hint: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
  },

  bottom: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  iconBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconText: {
    fontSize: 22,
  },

  scanBtn: {
    borderWidth: 4,
    borderColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});