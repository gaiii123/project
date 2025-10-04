// app/(tabs)/donor.tsx
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { Donation, Project } from "../services/types";
import LoadingSpinner from "../../components/loadingSpinner";
import ErrorMessage from "../../components/errorMessage";

export default function DonorScreen() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    donor_name: "",
    donor_email: "",
    amount: "",
    purpose: "",
    currency: "USD"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [donationsResponse, projectsResponse] = await Promise.all([
        apiService.getDonations(),
        apiService.getProjects()
      ]);

      setDonations(donationsResponse.data);
      setProjects(projectsResponse.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.donor_name.trim() || !form.donor_email.trim() || !form.amount) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      setSubmitting(true);
      await apiService.createDonation({
        donor_name: form.donor_name.trim(),
        donor_email: form.donor_email.trim(),
        amount: amount,
        currency: form.currency,
        purpose: form.purpose.trim() || undefined
      });

      Alert.alert("Success", "Thank you for your donation!");
      setForm({ donor_name: "", donor_email: "", amount: "", purpose: "", currency: "USD" });
      loadData(); // Refresh the list
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to process donation");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'failed': return '#f44336';
      default: return '#ff9800';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading donation information..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Make a Donation</Text>
      <Text style={styles.description}>
        Your contribution makes a real difference in lives.
      </Text>

      {/* Donation Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Donation Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Your Name *"
          value={form.donor_name}
          onChangeText={(text) => setForm({...form, donor_name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email *"
          value={form.donor_email}
          onChangeText={(text) => setForm({...form, donor_email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.amountContainer}>
          <TextInput
            style={[styles.input, styles.amountInput]}
            placeholder="Amount *"
            value={form.amount}
            onChangeText={(text) => setForm({...form, amount: text})}
            keyboardType="decimal-pad"
          />
          <View style={styles.currencySelector}>
            <Text style={styles.currencyText}>{form.currency}</Text>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Purpose (optional)"
          value={form.purpose}
          onChangeText={(text) => setForm({...form, purpose: text})}
        />
        
        <TouchableOpacity 
          style={[styles.button, submitting && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Processing...' : 'Make Donation'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Projects */}
      <View style={styles.projectsSection}>
        <Text style={styles.sectionTitle}>Active Projects</Text>
        
        {projects.map((project) => (
          <View key={project.id} style={styles.projectCard}>
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
                ${project.collected_amount.toLocaleString()} of ${project.target_amount.toLocaleString()} raised
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Donation History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Donation History</Text>
        
        {error && (
          <ErrorMessage message={error} onRetry={loadData} />
        )}

        {donations.length === 0 ? (
          <Text style={styles.noDataText}>No donations made yet.</Text>
        ) : (
          donations.map((donation) => (
            <View key={donation.id} style={styles.donationItem}>
              <View style={styles.donationHeader}>
                <Text style={styles.donationAmount}>
                  ${donation.amount.toLocaleString()} {donation.currency}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(donation.status) }]}>
                  <Text style={styles.statusText}>{donation.status.toUpperCase()}</Text>
                </View>
              </View>
              {donation.purpose && (
                <Text style={styles.donationPurpose}>For: {donation.purpose}</Text>
              )}
              <Text style={styles.donationDate}>
                {new Date(donation.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
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
  formSection: {
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectsSection: {
    marginBottom: 30
  },
  historySection: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: '#333'
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 8,
    backgroundColor: "white",
    fontSize: 16
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountInput: {
    flex: 1,
    marginRight: 10
  },
  currencySelector: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  currencyText: {
    fontWeight: 'bold',
    color: '#333'
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  buttonDisabled: {
    backgroundColor: '#b0bec5'
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
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
    marginBottom: 5
  },
  projectDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10
  },
  progressContainer: {
    marginTop: 5
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
    color: '#666',
    textAlign: 'center'
  },
  donationItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  donationAmount: {
    fontWeight: "bold",
    fontSize: 16,
    color: '#333'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  donationPurpose: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5
  },
  donationDate: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic'
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20
  }
});