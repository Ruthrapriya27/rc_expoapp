import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [bluetoothName, setBluetoothName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSaveChanges = () => 
    {
    Alert.alert
    (
      "Changes Saved",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
  };

  const handleLogout = () => 
    {
    Alert.alert
    (
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace('Login') }
      ]
    );
  };

  return (
    <View style={styles.container}>
   <KeyboardAvoidingView
  behavior=
  {
      Platform.OS === 'android' && Platform.Version >= 23   ? 'height'  : undefined     
  }
  style={styles.keyboardView}
>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            
            {/* Name Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email ID</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* Mobile Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your mobile number"
                placeholderTextColor="#999"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Device Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Device Settings</Text>
            
            {/* Bluetooth Name Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bluetooth Name</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter Bluetooth name"
                placeholderTextColor="#999"
                value={bluetoothName}
                onChangeText={setBluetoothName}
              />
            </View>
          </View>

          {/* Security Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            {/* Current Password Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your current password"
                  placeholderTextColor="#999"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter a new password"
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveChanges}
            activeOpacity={0.5}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </View>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
            activeOpacity={0.5}
          >
            <View style={styles.buttonContent}>
              <Icon name="sign-out" size={18} color="white" style={styles.buttonIcon} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF', // Card/Modal
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    // borderLeftWidth: 4,
    // borderLeftColor: '#1A73E8', // Primary blue accent
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A73E8', // Primary blue
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Soft border
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#5F6368', // Secondary text
    marginBottom: 8,
    fontWeight: '500',
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Border
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1C1C1C', // Primary text
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#1C1C1C',
  },
  eyeIcon: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#1A73E8', // Primary blue for main action
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: '#FFA000', // Accent amber for alerts
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginLeft: 10,
  },
});

export default SettingsScreen;