// app/(tabs)/home.tsx
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { DonationStats, ImpactSummary } from '../services/types';
import LoadingSpinner from '../../components/loadingSpinner';
import ErrorMessage from '../../components/errorMessage';

export default function HomeScreen() {
  const router = useRouter();
  const [donationStats, setDonationStats] = useState<DonationStats | null>(null);
  const [impactSummary, setImpactSummary] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, impactResponse] = await Promise.all([
        apiService.getDonationStats(),
        apiService.getImpactSummary()
      ]);

      setDonationStats(statsResponse.data);
      setImpactSummary(impactResponse.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.title}>Welcome to ImpactTrace 🌍</Text>
        <Text style={styles.subtitle}>
          Track donations, manage projects, and help communities in real-time.
        </Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Impact Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${donationStats?.totalAmount.toLocaleString() || '0'}</Text>
            <Text style={styles.statLabel}>Total Donations</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{impactSummary?.beneficiaries_helped || '0'}</Text>
            <Text style={styles.statLabel}>Beneficiaries Helped</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{impactSummary?.active_projects || '0'}</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{donationStats?.totalDonations || '0'}</Text>
            <Text style={styles.statLabel}>Total Donors</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="NGO Admin Portal" 
            onPress={() => router.push('/(tabs)/admin')} 
            color="#4fc3f7"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Make a Donation" 
            onPress={() => router.push('/(tabs)/donor')} 
            color="#4caf50"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Apply for Aid" 
            onPress={() => router.push('/(tabs)/admin')} 
            color="#ff9800"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Track Impact" 
            onPress={() => router.push('/(tabs)/tracker')} 
            color="#9c27b0"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Together,  making a difference in communities worldwide.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fdff' 
  },
  heroSection: { 
    padding: 25, 
    backgroundColor: '#4fc3f7', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 16, 
    color: 'white', 
    textAlign: 'center',
    opacity: 0.9
  },
  statsSection: { 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15,
    color: '#333'
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  statCard: { 
    width: '48%', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center'
  },
  statNumber: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#4fc3f7',
    marginBottom: 5
  },
  statLabel: { 
    fontSize: 12, 
    color: '#666', 
    textAlign: 'center'
  },
  actionsSection: { 
    padding: 20 
  },
  buttonContainer: { 
    marginVertical: 6 
  },
  footer: { 
    padding: 20, 
    alignItems: 'center',
    marginTop: 10
  },
  footerText: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center',
    fontStyle: 'italic'
  },
});