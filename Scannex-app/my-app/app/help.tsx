import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Help() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <Text style={styles.heading}>How to scan?</Text>
      <Text style={styles.text}>
        Open the scanner, tap the search button and point the camera at a barcode
        or QR code.
      </Text>

      <Text style={styles.heading}>Supported codes</Text>
      <Text style={styles.text}>
        QR, EAN-13, EAN-8, UPC-A, Code 128, Code 39, PDF417
      </Text>

      <Text style={styles.heading}>Scan not working?</Text>
      <Text style={styles.text}>
        Make sure camera permission is allowed and the barcode is clear.
      </Text>
      <Text style={styles.heading}>Contact</Text>
      <Text style={styles.text}>
        Email: zentyrodigital@gmail.com
      </Text>
      <Text style={styles.heading}>App Name</Text>
      <Text style={styles.text}>
        Scannex-Qr Code And Barcode Scanner
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { fontSize: 22, color: '#fff', marginBottom: 20, fontWeight: '600' },
  heading: { fontSize: 16, color: '#00ff99', marginTop: 20 },
  text: { color: '#ccc', marginTop: 8, lineHeight: 20 },
});
