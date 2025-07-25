import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login' as any);
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Google Sign Up', 'Google sign up is not implemented yet');
  };

  const handleAppleSignUp = () => {
    Alert.alert('Apple Sign Up', 'Apple sign up is not implemented yet');
  };

  const handleFacebookSignUp = () => {
    Alert.alert('Facebook Sign Up', 'Facebook sign up is not implemented yet');
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#2D1B69', '#16998E', '#20A080']}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 32 }}>
            <View className="flex-1 justify-center">
              {/* Header */}
              <View className="items-center mb-10">
                <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-6">
                  <Ionicons name="map" size={40} color="white" />
                </View>
                <Text className="text-4xl font-bold text-white text-center mb-2">Join Notemap</Text>
                <Text className="text-lg text-gray-100 text-center">Create your account to get started</Text>
              </View>

              {/* Email Form */}
              <View className="gap-4">
                <View>
                  <Text className="text-gray-100 text-sm mb-2 ml-1">Email Address</Text>
                  <View className="bg-white/15 rounded-xl border border-white/30">
                    <TextInput
                      className="p-4 text-base text-white"
                      placeholder="Enter your email"
                      placeholderTextColor="#E5E7EB"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-gray-100 text-sm mb-2 ml-1">Password</Text>
                  <View className="bg-white/15 rounded-xl border border-white/30">
                    <TextInput
                      className="p-4 text-base text-white"
                      placeholder="Create a password"
                      placeholderTextColor="#E5E7EB"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-gray-100 text-sm mb-2 ml-1">Confirm Password</Text>
                  <View className="bg-white/15 rounded-xl border border-white/30">
                    <TextInput
                      className="p-4 text-base text-white"
                      placeholder="Confirm your password"
                      placeholderTextColor="#E5E7EB"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                  </View>
                </View>

                <TouchableOpacity
                  className={`rounded-xl p-4 items-center mt-4 ${loading ? 'bg-gray-600' : 'bg-green-600'}`}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <Text className="text-white text-base font-semibold">
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                  <Text className="text-gray-100 text-sm">Already have an account? </Text>
                  <TouchableOpacity onPress={navigateToLogin}>
                    <Text className="text-green-300 text-sm font-semibold">Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
