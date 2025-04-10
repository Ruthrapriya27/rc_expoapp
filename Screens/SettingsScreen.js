import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = ({ navigation }) => 
{
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [bluetoothName, setBluetoothName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSaveChanges = () => {
    console.log("Changes Saved");
  };

  const handleLogout = () => {
    navigation.replace('Users');
  };

  return (
    <View style={styles.container}>
      {/* Name Section */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Name</Text>
      </View>
      <TextInput
        style={styles.inputBox}
        placeholder="Enter your name"
        placeholderTextColor="grey"
        value={name}
        onChangeText={setName}
      />

      {/* Email Section */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Email ID</Text>
      </View>
      <TextInput
        style={styles.inputBox}
        placeholder="Enter your email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={setEmail}
      />

      {/* Mobile Section */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Mobile Number</Text>
      </View>
      <TextInput
        style={styles.inputBox}
        placeholder="Enter your mobile number"
        placeholderTextColor="grey"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      {/* Bluetooth Name Section */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Bluetooth Name</Text>
      </View>
      <TextInput
        style={styles.inputBox}
        placeholder="Enter Bluetooth name"
        placeholderTextColor="grey"
        value={bluetoothName}
        onChangeText={setBluetoothName}
      />

      {/* Current Password Section */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Current Password</Text>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your current password"
          placeholderTextColor="grey"
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
            color="grey"
          />
        </TouchableOpacity>
      </View>

      {/* New Password Section */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>New Password</Text>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter a new password"
          placeholderTextColor="grey"
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
            color="grey"
          />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Logout Button-like Container */}
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity 
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Icon name="sign-out" size={24} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  BoxAboveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    fontWeight: '400',
  },
  inputBox: {
    height: 45,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
    paddingHorizontal: 12
  },
  saveButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 45,
    fontSize: 14,
    color: '#000',
  },
  eyeIcon: {
    padding: 4,
  },
  logoutButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default SettingsScreen;
