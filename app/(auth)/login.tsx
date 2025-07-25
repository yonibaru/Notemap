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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push('/(auth)/signup' as any);
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Google Sign In', 'Google sign in is not implemented yet');
  };

  const handleAppleSignIn = () => {
    Alert.alert('Apple Sign In', 'Apple sign in is not implemented yet');
  };

  const handleFacebookSignIn = () => {
    Alert.alert('Facebook Sign In', 'Facebook sign in is not implemented yet');
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 32 }}>
            <View className="flex-1 justify-center">
              {/* Header */}
              <View className="items-center mb-6">
                <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-6">
                  <Ionicons name="map" size={40} color="white" />
                </View>
                <Text className="text-4xl font-bold text-white text-center mb-2">Welcome Back</Text>
                <Text className="text-lg text-gray-300 text-center">Sign in to your Notemap account</Text>
              </View>

              {/* Social Login Buttons */}
              <View className="gap-3 mb-8">
                <TouchableOpacity
                  onPress={handleGoogleSignIn}
                  className="bg-white/10 rounded-xl p-4 flex-row items-center justify-center border border-white/20"
                >
                  <Ionicons name="logo-google" size={20} color="#ffffffff" />
                  <Text className="text-white text-base font-semibold ml-3">Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAppleSignIn}
                  className="bg-white/10 rounded-xl p-4 flex-row items-center justify-center border border-white/20"
                >
                  <Ionicons name="logo-apple" size={20} color="white" />
                  <Text className="text-white text-base font-semibold ml-3">Continue with Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleFacebookSignIn}
                  className="bg-white/10 rounded-xl p-4 flex-row items-center justify-center border border-white/20"
                >
                  <Ionicons name="logo-facebook" size={20} color="#ffffffff" />
                  <Text className="text-white text-base font-semibold ml-3">Continue with Facebook</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View className="flex-row items-center mb-8">
                <View className="flex-1 h-px bg-white/20" />
                <Text className="text-gray-400 text-sm mx-4">or continue with email</Text>
                <View className="flex-1 h-px bg-white/20" />
              </View>

              {/* Email Form */}
              <View className="gap-4">
                <View>
                  <Text className="text-gray-300 text-sm mb-2 ml-1">Email Address</Text>
                  <View className="bg-white/10 rounded-xl border border-white/20">
                    <TextInput
                      className="p-4 text-base text-white"
                      placeholder="Enter your email"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-gray-300 text-sm mb-2 ml-1">Password</Text>
                  <View className="bg-white/10 rounded-xl border border-white/20">
                    <TextInput
                      className="p-4 text-base text-white"
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                </View>

                <TouchableOpacity
                  className={`rounded-xl p-4 items-center mt-4 ${loading ? 'bg-gray-600' : 'bg-blue-600'}`}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text className="text-white text-base font-semibold">
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                  <Text className="text-gray-400 text-sm">Don't have an account? </Text>
                  <TouchableOpacity onPress={navigateToSignup}>
                    <Text className="text-blue-400 text-sm font-semibold">Sign Up</Text>
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
