import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BeneficiaryHomeScreen() {
  const router = useRouter();

  const applicationStatus = {
    status: 'approved',
    title: 'Education Support Application',
    date: '2024-01-15',
    amount: '$1,200',
    nextSteps: 'Funds will be disbursed within 3-5 business days',
  };

  const quickActions = [
    {
      title: 'Apply for Aid',
      icon: 'document-text',
      color: '#A855F7',
      route: '/beneficiary/apply',
    },
    {
      title: 'My Applications',
      icon: 'list',
      color: '#10B981',
      route: '/beneficiary/applications',
    },
    {
      title: 'Resources',
      icon: 'book',
      color: '#F59E0B',
      route: '/beneficiary/resources',
    },
    {
      title: 'Support',
      icon: 'help-buoy',
      color: '#EF4444',
      route: '/beneficiary/support',
    },
  ];

  const availablePrograms = [
    {
      id: 1,
      title: 'Educational Assistance',
      description: 'Support for school fees, books, and supplies',
      icon: 'school',
      category: 'Education',
    },
    {
      id: 2,
      title: 'Medical Aid Program',
      description: 'Financial assistance for medical treatments',
      icon: 'medical',
      category: 'Healthcare',
    },
    {
      id: 3,
      title: 'Food Security',
      description: 'Monthly food packages and nutrition support',
      icon: 'nutrition',
      category: 'Food Aid',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="person" size={40} color="#A855F7" />
          <Text style={styles.title}>Beneficiary Portal</Text>
          <Text style={styles.subtitle}>
            Get the support you need to thrive
          </Text>
        </View>
      </View>

      {/* Application Status */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Application Status</Text>
        <View style={[
          styles.statusCard,
          applicationStatus.status === 'approved' && styles.statusApproved,
          applicationStatus.status === 'pending' && styles.statusPending,
          applicationStatus.status === 'rejected' && styles.statusRejected,
        ]}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={
                applicationStatus.status === 'approved' ? 'checkmark-circle' :
                applicationStatus.status === 'pending' ? 'time' : 'close-circle'
              } 
              size={24} 
              color={
                applicationStatus.status === 'approved' ? '#10B981' :
                applicationStatus.status === 'pending' ? '#F59E0B' : '#EF4444'
              } 
            />
            <Text style={styles.statusTitle}>
              {applicationStatus.status.charAt(0).toUpperCase() + applicationStatus.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.applicationTitle}>{applicationStatus.title}</Text>
          <View style={styles.applicationDetails}>
            <Text style={styles.detailText}>Applied: {applicationStatus.date}</Text>
            <Text style={styles.detailText}>Amount: {applicationStatus.amount}</Text>
          </View>
          <Text style={styles.nextSteps}>{applicationStatus.nextSteps}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Available Programs */}
      <View style={styles.programsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Programs</Text>
          <TouchableOpacity onPress={() => router.push('/beneficiary/programs' as any)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {availablePrograms.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={styles.programCard}
            onPress={() => router.push(`/beneficiary/apply?program=${program.id}` as any)}
          >
            <View style={styles.programIcon}>
              <Ionicons name={program.icon as any} size={24} color="#A855F7" />
            </View>
            <View style={styles.programContent}>
              <Text style={styles.programTitle}>{program.title}</Text>
              <Text style={styles.programDescription}>{program.description}</Text>
              <View style={styles.programCategory}>
                <Text style={styles.categoryText}>{program.category}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Support Resources */}
      <View style={styles.resourcesSection}>
        <Text style={styles.sectionTitle}>Support Resources</Text>
        <View style={styles.resourceCard}>
          <Ionicons name="call" size={24} color="#A855F7" />
          <View style={styles.resourceContent}>
            <Text style={styles.resourceTitle}>24/7 Support Hotline</Text>
            <Text style={styles.resourceDescription}>
              Call us anytime for assistance with your application
            </Text>
                        <Text style={styles.resourceContact}>1-800-HELP-NOW</Text>
          </View>
        </View>
        
        <View style={styles.resourceCard}>
          <Ionicons name="mail" size={24} color="#A855F7" />
          <View style={styles.resourceContent}>
            <Text style={styles.resourceTitle}>Email Support</Text>
            <Text style={styles.resourceDescription}>
              Get help via email for non-urgent inquiries
            </Text>
            <Text style={styles.resourceContact}>support@impacttrace.org</Text>
          </View>
        </View>
      </View>

      {/* Success Stories */}
      <View style={styles.storiesSection}>
        <Text style={styles.sectionTitle}>Success Stories</Text>
        <View style={styles.storyCard}>
          <Ionicons name="heart" size={24} color="#EF4444" />
          <Text style={styles.storyTitle}>Maria Journey</Text>
          <Text style={styles.storyDescription}>
            With the educational support I received, I was able to complete my 
            nursing degree and now work at the local hospital. Thank you for 
            believing in me!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  statusSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusApproved: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  statusPending: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  statusRejected: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  applicationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  nextSteps: {
    fontSize: 14,
    color: '#10B981',
    fontStyle: 'italic',
  },
  actionsSection: {
    padding: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  programsSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#A855F7',
    fontWeight: '600',
  },
  programCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  programIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FAF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  programContent: {
    flex: 1,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  programCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  resourcesSection: {
    padding: 16,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resourceContent: {
    flex: 1,
    marginLeft: 16,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  resourceContact: {
    fontSize: 14,
    color: '#A855F7',
    fontWeight: '600',
  },
  storiesSection: {
    padding: 16,
    paddingBottom: 32,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});