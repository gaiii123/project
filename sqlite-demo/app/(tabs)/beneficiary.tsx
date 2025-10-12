// app/(tabs)/beneficiary.tsx
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from "react-native";
import { useState, useEffect } from "react";
import { apiService } from '../../services/api';
import { Beneficiary } from '../../services/types';
import LoadingSpinner from "../../components/loadingSpinner";
import ErrorMessage from "../../components/errorMessage";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BeneficiaryScreen() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    needs_description: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (showOnlyMine && userEmail) {
        response = await apiService.getBeneficiariesByEmail(userEmail);
      } else {
        response = await apiService.getBeneficiaries();
      }
      
      setBeneficiaries(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      loadBeneficiaries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnlyMine, userEmail]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserEmail(user.email || "");
        setForm(prev => ({ ...prev, email: user.email || "", name: user.name || "" }));
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.needs_description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await apiService.createBeneficiary({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        needs_description: form.needs_description.trim()
      });

      Alert.alert("Success", "Application submitted successfully!");
      setForm({ name: "", email: "", phone: "", address: "", needs_description: "" });
      loadBeneficiaries(); // Refresh the list
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
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
    return <LoadingSpinner text="Loading applications..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Beneficiary Application</Text>
      <Text style={styles.description}>
        Apply for aid and track your application status. We&apos;re here to help.
      </Text>
      
      {/* Application Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Apply for Assistance</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={form.name}
          onChangeText={(text) => setForm({...form, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address *"
          value={form.email}
          onChangeText={(text) => setForm({...form, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={form.phone}
          onChangeText={(text) => setForm({...form, phone: text})}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={form.address}
          onChangeText={(text) => setForm({...form, address: text})}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your needs and situation *"
          value={form.needs_description}
          onChangeText={(text) => setForm({...form, needs_description: text})}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity 
          style={[styles.button, submitting && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Applications List */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Applications</Text>
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>My Applications Only</Text>
            <Switch
              value={showOnlyMine}
              onValueChange={setShowOnlyMine}
              trackColor={{ false: '#767577', true: '#4fc3f7' }}
              thumbColor={showOnlyMine ? '#2196f3' : '#f4f3f4'}
            />
          </View>
        </View>
        
        {error && (
          <ErrorMessage message={error} onRetry={loadBeneficiaries} />
        )}

        {beneficiaries.length === 0 ? (
          <Text style={styles.noDataText}>
            {showOnlyMine ? 'You have not submitted any applications yet.' : 'No applications found.'}
          </Text>
        ) : (
          beneficiaries.map((beneficiary) => (
            <View key={beneficiary.id} style={styles.beneficiaryItem}>
              <View style={styles.beneficiaryHeader}>
                <Text style={styles.beneficiaryName}>{beneficiary.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(beneficiary.status) }]}>
                  <Text style={styles.statusText}>{beneficiary.status.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.beneficiaryEmail}>{beneficiary.email}</Text>
              <Text style={styles.beneficiaryNeeds}>{beneficiary.needs_description}</Text>
              <Text style={styles.beneficiaryDate}>
                Applied: {new Date(beneficiary.created_at).toLocaleDateString()}
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
  listSection: {
    marginBottom: 20
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  filterText: {
    fontSize: 14,
    color: '#666'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  textArea: { 
    height: 100, 
    textAlignVertical: "top" 
  },
  button: {
    backgroundColor: "#4fc3f7",
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
  beneficiaryItem: {
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
  beneficiaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  beneficiaryName: {
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
  beneficiaryEmail: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5
  },
  beneficiaryNeeds: {
    color: '#333',
    fontSize: 14,
    marginBottom: 8
  },
  beneficiaryDate: {
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
