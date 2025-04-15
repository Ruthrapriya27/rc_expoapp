import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator, StyleSheet } from 'react-native';

const NewUserRegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [device, setDevice] = useState('');
  const [version, setVersion] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility

  const handleRegister = () => {
    if (!email || !mobile || !fullName || !designation || !device || !version) {
      setError('All fields are required.');
      return;
    }

    // Simple validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (mobile.length !== 10) {
      setError('Mobile number should be 10 digits.');
      return;
    }

    // Show the modal for confirmation
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    setIsModalVisible(false);  // Close modal
    setIsLoading(true); // Start loading animation

    setTimeout(() => {
      // Simulate network delay for loading animation
      setIsLoading(false); // Stop loading animation
      navigation.replace('TabScreen');  // Navigate to TabScreen after loading
    }, 2000); // Adjust delay as necessary
  };

  const handleCancel = () => {
    setIsModalVisible(false);  // Close the modal if cancel is clicked
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New User Registration</Text>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Email</Text>
        <TextInput
          style={styles.inputLine}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter email"
        />
      </View>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Mobile Number</Text>
        <TextInput
          style={styles.inputLine}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
          placeholder="Enter mobile number"
        />
      </View>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Full Name</Text>
        <TextInput
          style={styles.inputLine}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
        />
      </View>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Designation</Text>
        <TextInput
          style={styles.inputLine}
          value={designation}
          onChangeText={setDesignation}
          placeholder="Enter designation"
        />
      </View>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Device</Text>
        <TextInput
          style={styles.inputLine}
          value={device}
          onChangeText={setDevice}
          placeholder="Enter device name"
        />
      </View>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Version</Text>
        <TextInput
          style={styles.inputLine}
          value={version}
          onChangeText={setVersion}
          placeholder="Enter version"
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>

      {/* Modal for Confirmation */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure you want to register?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Animation */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6D60" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3E99F',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6D60',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FF6D60',
    marginBottom: 4,
  },
  formSection: {
    marginBottom: 12,
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingVertical: 8,
    borderLeftWidth: 6,
    borderLeftColor: '#98D8AA',
    borderRadius: 8,
  },
  inputLine: {
    height: 40,
    borderBottomColor: '#FF6D60',
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: '#98D8AA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FF6D60',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  backToLogin: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#FF6D60',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default NewUserRegistrationScreen;
