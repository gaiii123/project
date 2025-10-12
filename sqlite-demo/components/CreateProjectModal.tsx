// components/CreateProjectModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { apiService } from '../services/api';

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  visible,
  onClose,
  onProjectCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    target_amount: '',
    timeline: '',
    location: '',
    target_beneficiaries: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    'Education',
    'Healthcare',
    'Food & Nutrition',
    'Clean Water',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Other'
  ];

  const timelines = [
    '1 Month',
    '3 Months',
    '6 Months',
    '1 Year',
    'Ongoing'
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.target_amount) {
      newErrors.target_amount = 'Target amount is required';
    } else if (isNaN(Number(formData.target_amount)) || Number(formData.target_amount) <= 0) {
      newErrors.target_amount = 'Please enter a valid amount';
    }

    if (!formData.timeline) {
      newErrors.timeline = 'Timeline is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // Create the project description with all details
      const fullDescription = `
Category: ${formData.category}
Timeline: ${formData.timeline}
${formData.location ? `Location: ${formData.location}` : ''}
${formData.target_beneficiaries ? `Target Beneficiaries: ${formData.target_beneficiaries}` : ''}

Description:
${formData.description}
      `.trim();

      const projectData = {
        name: formData.name.trim(),
        description: fullDescription,
        target_amount: Number(formData.target_amount)
      };

      const response = await apiService.createProject(projectData);

      if (response.success) {
        // Show success toast
        Toast.show({
          type: 'success',
          text1: 'Success!',
          text2: 'Project created successfully',
          position: 'top',
          visibilityTime: 3000,
        });

        // Reset form and close modal
        resetForm();
        onProjectCreated();
        onClose();
      } else {
        Alert.alert('Error', response.message || 'Failed to create project');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      target_amount: '',
      timeline: '',
      location: '',
      target_beneficiaries: '',
      description: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Create New Project</Text>
              <Text style={styles.modalSubtitle}>Fill in the details for your humanitarian initiative</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Project Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Project Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter project name"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Category <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        formData.category === cat && styles.categoryButtonSelected
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, category: cat });
                        if (errors.category) setErrors({ ...errors, category: '' });
                      }}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        formData.category === cat && styles.categoryButtonTextSelected
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Target Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Target Amount <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.target_amount && styles.inputError]}
                placeholder="e.g., $50,000"
                value={formData.target_amount}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setFormData({ ...formData, target_amount: text });
                  if (errors.target_amount) setErrors({ ...errors, target_amount: '' });
                }}
              />
              {errors.target_amount && <Text style={styles.errorText}>{errors.target_amount}</Text>}
            </View>

            {/* Timeline */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Timeline <Text style={styles.required}>*</Text>
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {timelines.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.categoryButton,
                      formData.timeline === time && styles.categoryButtonSelected
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, timeline: time });
                      if (errors.timeline) setErrors({ ...errors, timeline: '' });
                    }}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      formData.timeline === time && styles.categoryButtonTextSelected
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.timeline && <Text style={styles.errorText}>{errors.timeline}</Text>}
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Project location"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
              />
            </View>

            {/* Target Beneficiaries */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Beneficiaries</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 500 families"
                value={formData.target_beneficiaries}
                onChangeText={(text) => setFormData({ ...formData, target_beneficiaries: text })}
              />
            </View>

            {/* Project Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Project Description <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textArea, errors.description && styles.inputError]}
                placeholder="Describe the project goals and impact..."
                value={formData.description}
                onChangeText={(text) => {
                  setFormData({ ...formData, description: text });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[styles.createButton, loading && styles.createButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.createButtonText}>Create Project</Text>
              )}
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#666'
  },
  closeButton: {
    padding: 4
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  required: {
    color: '#f44336'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fafafa'
  },
  inputError: {
    borderColor: '#f44336'
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
    minHeight: 120
  },
  pickerContainer: {
    marginBottom: 5
  },
  categoryScroll: {
    flexDirection: 'row'
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
    backgroundColor: '#fafafa'
  },
  categoryButtonSelected: {
    backgroundColor: '#4fc3f7',
    borderColor: '#4fc3f7'
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  categoryButtonTextSelected: {
    color: 'white',
    fontWeight: '600'
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4
  },
  createButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  createButtonDisabled: {
    opacity: 0.6
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CreateProjectModal;
