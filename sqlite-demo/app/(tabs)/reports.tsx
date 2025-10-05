import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReportCard = ({ 
  title, 
  description, 
  onDownload 
}: { 
  title: string; 
  description: string; 
  onDownload: () => void;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={onDownload}
        activeOpacity={0.7}
      >
        <Ionicons name="download-outline" size={18} color="#fff" />
        <Text style={styles.downloadButtonText}>Download PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function ReportsScreen() {
  const handleDownloadMonthlySummary = () => {
    console.log('Downloading Monthly Summary Report...');
    // TODO: Implement PDF generation and download
  };

  const handleDownloadDonorImpact = () => {
    console.log('Downloading Donor Impact Report...');
    // TODO: Implement PDF generation and download
  };

  const handleDownloadFinancialSummary = () => {
    console.log('Downloading Financial Summary...');
    // TODO: Implement PDF generation and download
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Generate Reports</Text>
        </View>

        <View style={styles.reportsContainer}>
          <ReportCard
            title="Monthly Summary Report"
            description="Comprehensive overview of donations, projects, and impact for the current month"
            onDownload={handleDownloadMonthlySummary}
          />

          <ReportCard
            title="Donor Impact Report"
            description="Detailed report showing how donations have been utilized and their impact"
            onDownload={handleDownloadDonorImpact}
          />

          <ReportCard
            title="Financial Summary"
            description="Financial breakdown of all donations and expenditures"
            onDownload={handleDownloadFinancialSummary}
          />
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  reportsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  cardContent: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
