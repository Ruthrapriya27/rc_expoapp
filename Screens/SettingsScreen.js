import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [mobile, setMobile] = useState('+1 234 567 8901');
  const [bluetoothName, setBluetoothName] = useState('MyDevice-BT');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSaveChanges = () => {
    Alert.alert(
      "Changes Saved",
      "Your settings have been updated successfully!",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace('Users') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
              <Ionicons name="checkmark-circle" size={20} color="white" style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
            activeOpacity={0.7}
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
    backgroundColor: '#f5f7fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerLine: {
    height: 3,
    width: 50,
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff758c',
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginLeft: 10,
  },
});

export default SettingsScreen;
