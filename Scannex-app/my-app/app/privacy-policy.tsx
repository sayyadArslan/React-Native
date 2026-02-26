import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.text}>
        This application respects your privacy.
      </Text>

      <Text style={styles.heading}>Camera Usage</Text>
      <Text style={styles.text}>
        Camera is used only for scanning barcodes and QR codes.
        No images or videos are stored or shared.
      </Text>

      <Text style={styles.heading}>Data Collection</Text>
      <Text style={styles.text}>
        Scanned data is stored locally on your device only.
        We do not collect or transmit any personal data.
      </Text>

      <Text style={styles.heading}>Third-party Services</Text>
      <Text style={styles.text}>
        This app does not use third-party analytics or tracking services.
      </Text>

      <Text style={styles.heading}>Contact</Text>
      <Text style={styles.text}>
        If you have any questions, contact us at zentyrodigital@gmail.com
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
