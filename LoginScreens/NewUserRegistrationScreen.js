import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const NewUserRegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [device, setDevice] = useState('');
  const [version, setVersion] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRegister = () => {
    if (!email || !mobile || !fullName || !designation || !device || !version) {
      setError('All fields are required.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }

    if (mobile.length !== 10) {
      setError('Mobile number should be 10 digits.');
      return;
    }

    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    setIsModalVisible(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigation.replace('TabScreen');
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollWrapper} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>New User Registration</Text>
          <View style={styles.formCard}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Email</Text>
              <TextInput
                style={styles.inputBox}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter email"
                multiline={true}
              />
            </View>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Mobile Number</Text>
              <TextInput
                style={styles.inputBox}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="numeric"
                placeholder="Enter mobile number"
                multiline={true}
              />
            </View>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Full Name</Text>
              <TextInput
                style={styles.inputBox}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                multiline={true}
              />
            </View>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Designation</Text>
              <TextInput
                style={styles.inputBox}
                value={designation}
                onChangeText={setDesignation}
                placeholder="Enter designation"
                multiline={true}
              />
            </View>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Device</Text>
              <TextInput
                style={styles.inputBox}
                value={device}
                onChangeText={setDevice}
                placeholder="Enter device name"
                multiline={true}
              />
            </View>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Version</Text>
              <TextInput
                style={styles.inputBox}
                value={version}
                onChangeText={setVersion}
                placeholder="Enter version"
                multiline={true}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={styles.backToLogin}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFA000" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollWrapper: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A73E8',
    textAlign: 'center',
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 4,
  },
  inputBox: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#FFA000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  backToLogin: {
    color: '#1A73E8',
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#1C1C1C',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#1A73E8',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});

export default NewUserRegistrationScreen;
