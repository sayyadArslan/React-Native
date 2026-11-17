import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🔒 Privacy Policy</Text>
        <Text style={styles.subtitle}>ExpenseFlow - Your Data is Safe</Text>
      </View>

      {/* CARD 1 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📌 Data Storage</Text>
        <Text style={styles.text}>
          All your financial data is stored locally on your device using AsyncStorage.
          We do not use any external database or cloud storage.
        </Text>
      </View>

      {/* CARD 2 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔐 Data Protection</Text>
        <Text style={styles.text}>
          ❌ We do NOT collect personal data{'\n'}
          ❌ We do NOT send data to servers{'\n'}
          ❌ We do NOT track user activity{'\n'}
          ❌ We do NOT share data with third parties
        </Text>
      </View>

      {/* CARD 3 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💾 User Control</Text>
        <Text style={styles.text}>
          You have full control of your data. You can export or delete all data anytime from settings.
        </Text>
      </View>
       <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact</Text>
        <Text style={styles.text}>
          If you have any questions,contact us at m.arslan2sherazi786@gmail.com
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footerCard}>
        <Text style={styles.footerText}>
          Last updated: October 2026
        </Text>
        <Text style={styles.footerSubText}>
          ExpenseFlow • Track. Manage. Grow. 💎
        </Text>
      </View>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background || '#0B0B0F',
    padding: 16,
    
  },

  header: {
    marginBottom: 20,
    marginTop:50,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors?.textPrimary || '#fff',
  },

  subtitle: {
    fontSize: 12,
    marginTop: 4,
    color: Colors?.textMuted || '#aaa',
  },

  card: {
    backgroundColor: Colors?.backgroundCard || '#15151C',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors?.border || '#222',
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    color: Colors?.gold || '#D4AF37',
  },

  text: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors?.textMuted || '#bbb',
  },

  footerCard: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Colors?.border || '#222',
  },

  footerText: {
    fontSize: 12,
    color: Colors?.textMuted || '#888',
  },

  footerSubText: {
    fontSize: 12,
    marginTop: 4,
    color: Colors?.gold || '#D4AF37',
    fontWeight: '600',
  },
});