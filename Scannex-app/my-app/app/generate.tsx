import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useRef, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

export default function Generate() {
  const [text, setText] = useState('');
  const [showQR, setShowQR] = useState(false);

  const viewShotRef = useRef<any>(null);

  // 🔽 SAVE IMAGE
  const saveQR = async () => {
    if (!viewShotRef.current) return;

    const { granted } = await MediaLibrary.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Allow storage permission');
      return;
    }

    // ⏱ VERY IMPORTANT
    setTimeout(async () => {
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved', 'QR code saved to gallery');
    }, 300);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate QR Code</Text>

      {/* INPUT */}
      <TextInput
        placeholder="Enter link, number or text"
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />

      {/* GENERATE BUTTON */}
      <Pressable
        style={styles.genBtn}
        onPress={() => {
          if (!text.trim()) {
            Alert.alert('Empty', 'Please enter some text');
            return;
          }
          setShowQR(true);
        }}
      >
        <Text style={styles.genText}>Generate</Text>
      </Pressable>

      {/* QR PREVIEW */}
      {showQR && (
        <>
          <ViewShot
            ref={viewShotRef}
            options={{
              format: 'png',
              quality: 1,
              result: 'tmpfile',
            }}
            style={styles.captureBox}
          >
            <View style={styles.qrBox}>
              <QRCode
                value={text}
                size={220}
                color="black"
                backgroundColor="white"
              />
            </View>
          </ViewShot>

          {/* SAVE BUTTON */}
          <Pressable style={styles.saveBtn} onPress={saveQR}>
            <Text style={styles.saveText}>Download PNG</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  genBtn: {
    backgroundColor: '#00ff99',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  genText: {
    color: '#000',
    fontWeight: '700',
  },

  captureBox: {
    backgroundColor: '#fff', // ❗ MUST
    padding: 20,
    marginTop: 30,
    alignSelf: 'center',
    borderRadius: 12,
  },

  qrBox: {
    backgroundColor: '#fff',
  },

  saveBtn: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveText: {
    fontWeight: '700',
    color: '#000',
  },
});