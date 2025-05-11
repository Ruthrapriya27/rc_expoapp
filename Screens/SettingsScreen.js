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
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [bluetoothName, setBluetoothName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [[storedName], [storedEmail], [storedMobile], [storedBluetooth], [storedPassword]] =
          await AsyncStorage.multiGet([
            '@username',
            '@email',
            '@mobile',
            '@bluetoothName',
            '@password'
          ]);

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedMobile) setMobile(storedMobile);
        if (storedBluetooth) setBluetoothName(storedBluetooth);
        if (storedPassword) setCurrentPassword(storedPassword);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      await AsyncStorage.multiSet([
        ['@username', name],
        ['@email', email],
        ['@mobile', mobile],
        ['@bluetoothName', bluetoothName],
        ['@designation', designation],
      ]);

      setModalMessage('Changes have been saved.');
      setShowModal(true);
    } catch (error) {

      setModalMessage('Failed to save changes.');
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'android' && Platform.Version >= 23
            ? 'height'
            : undefined
        }
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Profile Information</Text>

            {/* Name */}
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

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email ID</Text>
              <TextInput
                style={[styles.inputBox, { opacity: 0.5 }]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={false}
              />
            </View>

            {/* Mobile */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[styles.inputBox, { opacity: 0.5 }]}
                placeholder="Enter your mobile number"
                placeholderTextColor="#999"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                editable={false}
              />
            </View>

            {/* Designation*/}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Designation</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your designation"
                placeholderTextColor="#999"
                value={designation}
                onChangeText={setDesignation}
              />
            </View>
          </View>

          {/* Device Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Device Settings</Text>

            {/* Device Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Device Name</Text>
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

            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, { opacity: 0.5 }]}
                  placeholder="Enter your current password"
                  placeholderTextColor="#999"
                  value={currentPassword}
                  secureTextEntry={!showCurrentPassword}
                  editable={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? 'eye' : 'eye-off'}
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
            onPress={() => setShowLogoutModal(true)}
            style={styles.logoutButton}
            activeOpacity={0.5}
          >
            <View style={styles.buttonContent}>
              <Icon
                name="sign-out"
                size={18}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal for Changes Saved */}
      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.logoutmodalOverlay}>
          <View style={styles.logoutmodalContainer}>
            <Text style={styles.logoutmodalText}>Are you sure you want to logout?</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.logoutmodalButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.logoutmodalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutmodalButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutmodalButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A73E8',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1C1C1C',
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
    backgroundColor: '#1A73E8',
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
    backgroundColor: '#FFA000',
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

  //Changes Saved Alert Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    width: 300,
    height: 120,
    overflow: 'hidden',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    color: '#000',
    fontWeight: '400',
    lineHeight: 24,
  },
  modalButton: {
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },

  // Logout Modal Styles
  logoutmodalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  logoutmodalContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    width: 300,
    height: 150,
    overflow: 'hidden',
  },
  logoutmodalText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 20,
    color: '#000',
    fontWeight: '400',
    lineHeight: 24,
  },
  logoutmodalButtonContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
  },
  logoutmodalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutmodalButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default SettingsScreen;
