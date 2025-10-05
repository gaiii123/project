// app/(tabs)/beneficiary-home.tsx
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import LoadingSpinner from '../../components/loadingSpinner';
import ErrorMessage from '../../components/errorMessage';
import Sidebar from '../../components/SideBar';
import { getCurrentUser, UserData } from '../../Utils/auth';
import { router } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

// Application category data type
interface ApplicationCategory {
  name: string;
  count: number;
  amount: number;
  color: string;
}

// Quick action type
interface QuickAction {
  id: string;
  title: string;
  icon: any;
  color: string;
  route: string;
}

export default function BeneficiaryHomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [totalDonationsReceived, setTotalDonationsReceived] = useState(0);
  const [applicationCategories, setApplicationCategories] = useState<ApplicationCategory[]>([]);

  // Quick actions for beneficiaries
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Request Donation',
      icon: 'add-circle',
      color: '#4caf50',
      route: '/beneficiary',
    },
    {
      id: '2',
      title: 'Track Requests',
      icon: 'location',
      color: '#2196f3',
      route: '/beneficiary',
    },
    {
      id: '3',
      title: 'Donation History',
      icon: 'time',
      color: '#ff9800',
      route: '/reports',
    },
    {
      id: '4',
      title: 'My Profile',
      icon: 'person',
      color: '#9c27b0',
      route: '/home',
    },
  ];

  const loadBeneficiaryData = async () => {
    // TODO: Replace with actual API call to get beneficiary-specific data
    // const response = await apiService.getBeneficiaryDashboard(userData?.email);
    
    // Sample data - replace with actual API data
    setTotalDonationsReceived(15750);
    
    setApplicationCategories([
      { name: 'Food', count: 5, amount: 6500, color: '#4caf50' },
      { name: 'Medicine', count: 3, amount: 4200, color: '#2196f3' },
      { name: 'Education', count: 4, amount: 3050, color: '#ff9800' },
      { name: 'Emergency', count: 2, amount: 2000, color: '#f44336' },
    ]);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await getCurrentUser();
      setUserData(user);

      // In production, fetch actual data from API
      // For now, using sample data
      await loadBeneficiaryData();
      
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuickAction = (action: QuickAction) => {
    if (action.route) {
      router.push(action.route as any);
    }
  };

  // Prepare data for pie chart
  const pieChartData = applicationCategories.map(category => ({
    name: category.name,
    amount: category.amount,
    color: category.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
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
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setSidebarVisible(true)}
          >
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>{userData?.name || 'Beneficiary'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Donations Card */}
          <View style={styles.totalCard}>
            <View style={styles.totalCardHeader}>
              <Ionicons name="wallet" size={32} color="#4caf50" />
              <View style={styles.totalCardContent}>
                <Text style={styles.totalCardLabel}>Total Donations Received</Text>
                <Text style={styles.totalCardAmount}>
                  ${totalDonationsReceived.toLocaleString()}
                </Text>
              </View>
            </View>
            <Text style={styles.totalCardSubtext}>
              Your total support across all applications
            </Text>
          </View>

          {/* Application Categories Pie Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Application Categories</Text>
            <Text style={styles.sectionSubtitle}>
              Breakdown of your applications by category
            </Text>
            
            {pieChartData.length > 0 ? (
              <View style={styles.chartContainer}>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 60}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
                
                {/* Category Summary */}
                <View style={styles.categorySummary}>
                  {applicationCategories.map((category, index) => (
                    <View key={index} style={styles.categoryItem}>
                      <View style={styles.categoryInfo}>
                        <View 
                          style={[
                            styles.categoryDot, 
                            { backgroundColor: category.color }
                          ]} 
                        />
                        <Text style={styles.categoryName}>{category.name}</Text>
                      </View>
                      <View style={styles.categoryStats}>
                        <Text style={styles.categoryCount}>{category.count} apps</Text>
                        <Text style={styles.categoryAmount}>
                          ${category.amount.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="pie-chart-outline" size={64} color="#ccc" />
                <Text style={styles.emptyChartText}>No applications yet</Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsCard}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.actionButton, { borderLeftColor: action.color }]}
                  onPress={() => handleQuickAction(action)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
                    <Ionicons name={action.icon} size={28} color={action.color} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Sample activities */}
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#4caf5020' }]}>
                  <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Application Approved</Text>
                  <Text style={styles.activitySubtitle}>Food assistance - $2,500</Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#2196f320' }]}>
                  <Ionicons name="time" size={24} color="#2196f3" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Application Under Review</Text>
                  <Text style={styles.activitySubtitle}>Medical assistance</Text>
                  <Text style={styles.activityTime}>1 day ago</Text>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#ff980020' }]}>
                  <Ionicons name="document-text" size={24} color="#ff9800" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>New Application Submitted</Text>
                  <Text style={styles.activitySubtitle}>Education support</Text>
                  <Text style={styles.activityTime}>3 days ago</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={24} color="#ffc107" />
              <Text style={styles.tipsTitle}>Helpful Tips</Text>
            </View>
            <Text style={styles.tipsText}>
              • Provide detailed information in your applications for faster approval{'\n'}
              • Keep your contact information up to date{'\n'}
              • Check notifications regularly for updates on your requests
            </Text>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>

      <Sidebar 
        visible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)}
        userName={userData?.name || 'Guest User'}
        userEmail={userData?.email || 'guest@impacttrace.com'}
        userRole={userData?.role || 'Guest'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4fc3f7',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 40,
  },
  menuButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  totalCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalCardContent: {
    marginLeft: 16,
    flex: 1,
  },
  totalCardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalCardAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  totalCardSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  categorySummary: {
    width: '100%',
    marginTop: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyChartText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  quickActionsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionsGrid: {
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '600',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  tipsCard: {
    backgroundColor: '#fffbea',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
