// app/(tabs)/admin.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { Beneficiary, Donation, Project, ImpactSummary } from "../services/types";
import LoadingSpinner from "../../components/loadingSpinner";
import ErrorMessage from "../../components/errorMessage";

export default function AdminScreen() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [impactSummary, setImpactSummary] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [beneficiariesResponse, donationsResponse, projectsResponse, impactResponse] = await Promise.all([
        apiService.getBeneficiaries(),
        apiService.getDonations(),
        apiService.getProjects(),
        apiService.getImpactSummary()
      ]);

      setBeneficiaries(beneficiariesResponse.data);
      setDonations(donationsResponse.data);
      setProjects(projectsResponse.data);
      setImpactSummary(impactResponse.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateBeneficiaryStatus = async (id: number, status: string) => {
    try {
      await apiService.updateBeneficiaryStatus(id, status);
      Alert.alert("Success", "Beneficiary status updated successfully");
      loadAdminData(); // Refresh data
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'completed': return '#2196f3';
      default: return '#ff9800';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadAdminData}
      />
    );
  }

  const pendingBeneficiaries = beneficiaries.filter(b => b.status === 'pending');
  const pendingDonations = donations.filter(d => d.status === 'pending');

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]} 
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'beneficiaries' && styles.activeTab]} 
          onPress={() => setActiveTab('beneficiaries')}
        >
          <Text style={[styles.tabText, activeTab === 'beneficiaries' && styles.activeTabText]}>
            Beneficiaries ({pendingBeneficiaries.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'donations' && styles.activeTab]} 
          onPress={() => setActiveTab('donations')}
        >
          <Text style={[styles.tabText, activeTab === 'donations' && styles.activeTabText]}>
            Donations ({pendingDonations.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'projects' && styles.activeTab]} 
          onPress={() => setActiveTab('projects')}
        >
          <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>
            Projects
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && (
          <View>
            <Text style={styles.sectionTitle}>Admin Overview</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{beneficiaries.length}</Text>
                <Text style={styles.statLabel}>Total Beneficiaries</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{donations.length}</Text>
                <Text style={styles.statLabel}>Total Donations</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{projects.length}</Text>
                <Text style={styles.statLabel}>Active Projects</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{pendingBeneficiaries.length}</Text>
                <Text style={styles.statLabel}>Pending Applications</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.subSectionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Add Project</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Generate Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'beneficiaries' && (
          <View>
            <Text style={styles.sectionTitle}>Beneficiary Management</Text>
            
            {pendingBeneficiaries.length === 0 ? (
              <Text style={styles.noDataText}>No pending applications.</Text>
            ) : (
              pendingBeneficiaries.map((beneficiary) => (
                <View key={beneficiary.id} style={styles.managementItem}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{beneficiary.name}</Text>
                    <Text style={styles.itemEmail}>{beneficiary.email}</Text>
                  </View>
                  <Text style={styles.itemNeeds}>{beneficiary.needs_description}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.statusButton, styles.approveButton]}
                      onPress={() => updateBeneficiaryStatus(beneficiary.id, 'approved')}
                    >
                      <Text style={styles.statusButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.statusButton, styles.rejectButton]}
                      onPress={() => updateBeneficiaryStatus(beneficiary.id, 'rejected')}
                    >
                      <Text style={styles.statusButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'donations' && (
          <View>
            <Text style={styles.sectionTitle}>Donation Management</Text>
            
            {pendingDonations.length === 0 ? (
              <Text style={styles.noDataText}>No pending donations.</Text>
            ) : (
              pendingDonations.map((donation) => (
                <View key={donation.id} style={styles.managementItem}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{donation.donor_name}</Text>
                    <Text style={styles.itemAmount}>${donation.amount} {donation.currency}</Text>
                  </View>
                  <Text style={styles.itemEmail}>{donation.donor_email}</Text>
                  {donation.purpose && (
                    <Text style={styles.itemNeeds}>Purpose: {donation.purpose}</Text>
                  )}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.statusButton, styles.approveButton]}>
                      <Text style={styles.statusButtonText}>Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.statusButton, styles.rejectButton]}>
                      <Text style={styles.statusButtonText}>Fail</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'projects' && (
          <View>
            <Text style={styles.sectionTitle}>Project Management</Text>
            
            {projects.map((project) => (
              <View key={project.id} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${Math.min((project.collected_amount / project.target_amount) * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    ${project.collected_amount.toLocaleString()} / ${project.target_amount.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                  <Text style={styles.statusText}>{project.status.toUpperCase()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fdff'
  },
  tabContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5'
  },
  activeTab: {
    backgroundColor: '#4fc3f7'
  },
  tabText: {
    color: '#666',
    fontWeight: '500'
  },
  activeTabText: {
    color: 'white'
  },
  content: {
    flex: 1,
    padding: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25
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
    marginBottom: 25
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionButton: {
    backgroundColor: '#4fc3f7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  managementItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
  },
  itemEmail: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5
  },
  itemAmount: {
    fontWeight: 'bold',
    color: '#4caf50'
  },
  itemNeeds: {
    color: '#333',
    fontSize: 14,
    marginBottom: 10
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  approveButton: {
    backgroundColor: '#4caf50'
  },
  rejectButton: {
    backgroundColor: '#f44336'
  },
  statusButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  projectItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5
  },
  projectDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10
  },
  progressContainer: {
    marginBottom: 10
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4
  },
  progressText: {
    fontSize: 12,
    color: '#666'
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20
  }
});