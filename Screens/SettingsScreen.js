import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SettingsScreen = ({ navigation }) => 
{

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [bluetoothName, setBluetoothName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveChanges = () => {
    console.log("Changes Saved");
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
      <TextInput
        style={styles.inputBox}
        placeholder="Enter your current password"
        placeholderTextColor="grey"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      {/* New Password Section */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>New Password</Text>
      </View>
      <TextInput
        style={styles.inputBox}
        placeholder="Enter a new password"
        placeholderTextColor="grey"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Logout Link */}
      <TouchableOpacity 
        style={styles.logoutLink} 
        onPress={() => navigation.navigate('Users')}
      >
        <Icon name="sign-out" size={30} color="red" style={styles.logoutIcon} />
        <Text style={styles.logoutLinkText}>Logout</Text>
      </TouchableOpacity>
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
  logoutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 45,
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },

  logoutIcon: 
  {
    marginRight: 2,
  },
  logoutLinkText: 
  {
    color: 'red',
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;