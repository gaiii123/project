// app/(tabs)/tracker.tsx
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { ImpactRecord, Project } from "../services/types";
import LoadingSpinner from "../../components/loadingSpinner";
import ErrorMessage from "../../components/errorMessage";

export default function TrackerScreen() {
  const [impactRecords, setImpactRecords] = useState<ImpactRecord[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrackerData();
  }, []);

  const loadTrackerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [impactResponse, projectsResponse] = await Promise.all([
        apiService.getImpactRecords(),
        apiService.getProjectProgress()
      ]);

      setImpactRecords(impactResponse.data);
      setProjects(projectsResponse.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load impact data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading impact tracker..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadTrackerData}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Impact Tracker</Text>
      <Text style={styles.description}>
        See how donations are making a real difference in communities.
      </Text>

      {/* Project Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Progress</Text>
        
        {projects.map((project) => (
          <View key={project.id} style={styles.projectCard}>
            <Text style={styles.projectName}>{project.name}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  ${project.collected_amount.toLocaleString()} raised
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round((project.collected_amount / project.target_amount) * 100)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min((project.collected_amount / project.target_amount) * 100, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.targetText}>
                Target: ${project.target_amount.toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Impact Stories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Impact Stories</Text>
        
        {impactRecords.length === 0 ? (
          <Text style={styles.noDataText}>No impact records yet.</Text>
        ) : (
          impactRecords.map((record) => (
            <View key={record.id} style={styles.impactCard}>
              <Text style={styles.impactDescription}>{record.impact_description}</Text>
              
              <View style={styles.impactMeta}>
                {record.project_name && (
                  <Text style={styles.metaItem}>Project: {record.project_name}</Text>
                )}
                {record.beneficiary_name && (
                  <Text style={styles.metaItem}>Beneficiary: {record.beneficiary_name}</Text>
                )}
                {record.donor_name && (
                  <Text style={styles.metaItem}>Donor: {record.donor_name}</Text>
                )}
                {record.amount_used && (
                  <Text style={styles.metaItem}>Amount Used: ${record.amount_used}</Text>
                )}
              </View>
              
              <Text style={styles.statusUpdate}>{record.status_update}</Text>
              <Text style={styles.impactDate}>
                {new Date(record.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Impact Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Overall Impact</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{projects.length}</Text>
            <Text style={styles.summaryLabel}>Active Projects</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {impactRecords.filter(r => r.beneficiary_name).length}
            </Text>
            <Text style={styles.summaryLabel}>Lives Impacted</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              ${impactRecords.reduce((sum, record) => sum + (record.amount_used || 0), 0).toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Funds Deployed</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{impactRecords.length}</Text>
            <Text style={styles.summaryLabel}>Impact Records</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f8fdff'
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 8, 
    textAlign: "center",
    color: '#333'
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: '#666',
    marginBottom: 25
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: '#333'
  },
  projectCard: {
    backgroundColor: "white",
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
    fontWeight: "bold",
    fontSize: 16,
    color: '#333',
    marginBottom: 10
  },
  progressContainer: {
    marginTop: 5
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  progressText: {
    fontSize: 14,
    color: '#666'
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50'
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
  targetText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right'
  },
  impactCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4fc3f7",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  impactDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20
  },
  impactMeta: {
    marginBottom: 10
  },
  metaItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2
  },
  statusUpdate: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
    marginBottom: 5,
    fontStyle: 'italic'
  },
  impactDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right'
  },
  summarySection: {
    marginBottom: 20
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  summaryItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4fc3f7',
    marginBottom: 5
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20
  }
});