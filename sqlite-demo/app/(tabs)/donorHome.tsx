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

export default function DonorHomeScreen() {
  const router = useRouter();

  const featuredProjects = [
    {
      id: 1,
      title: 'Education for All',
      description: 'Provide school supplies and tuition for underprivileged children',
      progress: 75,
      target: 50000,
      raised: 37500,
      category: 'Education',
    },
    {
      id: 2,
      title: 'Healthcare Initiative',
      description: 'Medical camps and healthcare services for rural areas',
      progress: 45,
      target: 75000,
      raised: 33750,
      category: 'Healthcare',
    },
    {
      id: 3,
      title: 'Food Distribution',
      description: 'Weekly food distribution to families in need',
      progress: 90,
      target: 25000,
      raised: 22500,
      category: 'Food Aid',
    },
  ];

  const quickActions = [
    {
      title: 'Make a Donation',
      icon: 'heart',
      color: '#EF4444',
      route: '/donor/donate',
    },
    {
      title: 'Browse Projects',
      icon: 'search',
      color: '#10B981',
      route: '/donor/projects',
    },
    {
      title: 'My Donations',
      icon: 'list',
      color: '#F59E0B',
      route: '/donor/history',
    },
    {
      title: 'Impact Stories',
      icon: 'book',
      color: '#8B5CF6',
      route: '/donor/stories',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="heart" size={40} color="#EF4444" />
          <Text style={styles.title}>Donor Portal</Text>
          <Text style={styles.subtitle}>
            Make a difference with your contributions
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$2,500</Text>
          <Text style={styles.statLabel}>Total Donated</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Projects Supported</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Lives Impacted</Text>
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

      {/* Featured Projects */}
      <View style={styles.projectsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Projects</Text>
          <TouchableOpacity onPress={() => router.push('/donor/projects' as any)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredProjects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() => router.push(`/donor/project/${project.id}` as any)}
          >
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{project.category}</Text>
              </View>
            </View>
            <Text style={styles.projectDescription}>{project.description}</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${project.progress}%` }
                  ]} 
                />
              </View>
              <View style={styles.progressStats}>
                <Text style={styles.progressText}>
                  ${project.raised.toLocaleString()} raised
                </Text>
                <Text style={styles.progressPercentage}>{project.progress}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Impact */}
      <View style={styles.impactSection}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.impactCard}>
          <Ionicons name="trophy" size={32} color="#F59E0B" />
          <Text style={styles.impactTitle}>Making a Difference</Text>
          <Text style={styles.impactDescription}>
            Your donations have helped provide education to 15 children and 
            medical care to 8 families this month.
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
  projectsSection: {
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
  projectCard: {
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
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
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
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  impactSection: {
    padding: 16,
    paddingBottom: 32,
  },
  impactCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  impactDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});