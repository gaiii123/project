import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>
            View detailed analytics and reports
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="analytics-outline" size={80} color="#0288d1" />
          </View>
          <Text style={styles.mainText}>Reports Dashboard</Text>
          <Text style={styles.descriptionText}>
            This section will contain detailed reports, analytics, and insights about donations, projects, and impact metrics.
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="bar-chart-outline" size={24} color="#0288d1" />
              <Text style={styles.featureText}>Financial Reports</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="pie-chart-outline" size={24} color="#0288d1" />
              <Text style={styles.featureText}>Impact Analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trending-up-outline" size={24} color="#0288d1" />
              <Text style={styles.featureText}>Growth Metrics</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="document-text-outline" size={24} color="#0288d1" />
              <Text style={styles.featureText}>Custom Reports</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginBottom: 24,
  },
  mainText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  featureList: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
