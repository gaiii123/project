// LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../app/services/api';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedRole = params.selectedRole as string;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>('');

  useEffect(() => {
    if (selectedRole) {
      setCurrentRole(selectedRole);
    } else {
      // If no role selected, get from storage or default to donor
      AsyncStorage.getItem('userRole').then(role => {
        setCurrentRole(role || 'donor');
      });
    }
  }, [selectedRole]);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'NGO Admin';
      case 'donor': return 'Donor';
      case 'beneficiary': return 'Beneficiary';
      default: return 'User';
    }
  };

  const getRoleBasedRoute = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return '/(tabs)/admin-home';
      case 'donor':
        return '/(tabs)/donor-home';
      case 'beneficiary':
        return '/(tabs)/beneficiary-home';
      default:
        return '/(tabs)/home';
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter both email and password',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // Call backend API
      const response = await apiService.login({
        email,
        password,
      });

      if (response.success && response.data) {
        // Save user data and token
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userRole', response.data.user.role);

        setLoading(false);
        
        Toast.show({
          type: 'success',
          text1: 'Login Successful! 🎉',
          text2: `Welcome back, ${response.data.user.name}!`,
          position: 'top',
          visibilityTime: 2000,
        });

        // Navigate based on user role after a short delay
        setTimeout(() => {
          const route = getRoleBasedRoute(response.data.user.role);
          router.replace(route as any);
        }, 500);
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Unable to login. Please try again.',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      setLoading(false);
      
      console.error('Error during login:', error);
      
      // Parse error message
      let errorTitle = 'Login Error';
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Invalid email or password')) {
          errorTitle = 'Invalid Credentials';
          errorMessage = 'Email or password is incorrect. Please check and try again.';
        } else if (error.message.includes('Cannot connect')) {
          errorTitle = 'Connection Error';
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  const handleRoleChange = () => {
    // Navigate back to role selection
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="heart" size={50} color="#EF4444" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue making an impact</Text>
          
          {/* Role Display */}
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              Logging in as: {getRoleDisplayName(currentRole)}
            </Text>
            <TouchableOpacity onPress={handleRoleChange} style={styles.roleChangeButton}>
              <Text style={styles.roleChangeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                Login as {getRoleDisplayName(currentRole)}
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push({
              pathname: '/signup',
              params: { selectedRole: currentRole }
            } as any)}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 8,
  },
  roleChangeButton: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleChangeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#111827',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#A855F7',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#A855F7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 14,
    color: '#A855F7',
    fontWeight: '600',
  },
});