    import React from 'react';
    import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    } from 'react-native';
    import { useRouter } from 'expo-router';
    import { Ionicons } from '@expo/vector-icons';

    export default function AdminHomeScreen() {
    const router = useRouter();

    const adminFeatures = [
        {
        title: 'Manage Beneficiaries',
        description: 'Review and approve beneficiary applications',
        icon: 'people',
        color: '#4F46E5',
        route: '/admin/beneficiaries',
        },
        {
        title: 'Donation Management',
        description: 'Oversee donations and fund allocation',
        icon: 'cash',
        color: '#10B981',
        route: '/admin/donations',
        },
        {
        title: 'Project Oversight',
        description: 'Manage and track project progress',
        icon: 'business',
        color: '#F59E0B',
        route: '/admin/projects',
        },
        {
        title: 'Analytics & Reports',
        description: 'View platform analytics and generate reports',
        icon: 'stats-chart',
        color: '#EF4444',
        route: '/admin/analytics',
        },
        {
        title: 'User Management',
        description: 'Manage platform users and permissions',
        icon: 'settings',
        color: '#8B5CF6',
        route: '/admin/users',
        },
        {
        title: 'Impact Tracking',
        description: 'Monitor and report on social impact',
        icon: 'trending-up',
        color: '#06B6D4',
        route: '/admin/impact',
        },
    ];

    const handleFeaturePress = (feature: any) => {
        Alert.alert(
        'Admin Feature',
        `Navigate to ${feature.title}`,
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open', onPress: () => router.push(feature.route as any) },
        ]
        );
    };

    return (
        <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <View style={styles.headerContent}>
            <Ionicons name="shield-checkmark" size={40} color="#4F46E5" />
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>
                Manage NGO operations and oversee platform activities
            </Text>
            </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Pending Applications</Text>
            </View>
            <View style={styles.statCard}>
            <Text style={styles.statNumber}>$12,540</Text>
            <Text style={styles.statLabel}>Total Donations</Text>
            </View>
            <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
            </View>
        </View>

        {/* Admin Features Grid */}
        <View style={styles.featuresGrid}>
            <Text style={styles.sectionTitle}>Management Tools</Text>
            {adminFeatures.map((feature, index) => (
            <TouchableOpacity
                key={index}
                style={styles.featureCard}
                onPress={() => handleFeaturePress(feature)}
            >
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Ionicons name={feature.icon as any} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
            <View style={styles.activityItem}>
                <Ionicons name="person-add" size={20} color="#10B981" />
                <Text style={styles.activityText}>New beneficiary application received</Text>
                <Text style={styles.activityTime}>2 min ago</Text>
            </View>
            <View style={styles.activityItem}>
                <Ionicons name="cash" size={20} color="#F59E0B" />
                <Text style={styles.activityText}>Donation of $500 received</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
            <View style={styles.activityItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4F46E5" />
                <Text style={styles.activityText}>Project - Education for All completed</Text>
                <Text style={styles.activityTime}>3 hours ago</Text>
            </View>
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
        color: '#4F46E5',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    featuresGrid: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    featureCard: {
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
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    activitySection: {
        padding: 16,
    },
    activityList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    activityText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        marginLeft: 12,
    },
    activityTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    });