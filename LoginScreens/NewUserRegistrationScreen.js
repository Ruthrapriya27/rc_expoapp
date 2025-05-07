import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView, 
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewUserRegScreen = ({ navigation }) => {
  // State for form fields
  const [fullName, setFullName] = React.useState('');
  const [designation, setDesignation] = React.useState('');
  const [device, setDevice] = React.useState('');
  const [version, setVersion] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');

  // State for touched fields
  const [fullNameTouched, setFullNameTouched] = React.useState(false);
  const [designationTouched, setDesignationTouched] = React.useState(false);
  const [deviceTouched, setDeviceTouched] = React.useState(false);
  const [versionTouched, setVersionTouched] = React.useState(false);
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [mobileNumberTouched, setMobileNumberTouched] = React.useState(false);

  // State for error messages
  const [fullNameError, setFullNameError] = React.useState('');
  const [designationError, setDesignationError] = React.useState('');
  const [deviceError, setDeviceError] = React.useState('');
  const [versionError, setVersionError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [mobileNumberError, setMobileNumberError] = React.useState('');

  // Alert modal state
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
 
  
  //Succesful Registration 
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  //User Exists Modal 
  const [showUserExistsModal, setShowUserExistsModal] = useState(false);

  // Validation functions
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validateMobileNumber = (number) => /^[0-9]{10}$/.test(number);
  const validateStringField = (field) => /^[a-zA-Z\s]+$/.test(field);
  const validateVersion = (version) => /^[a-zA-Z0-9.]+$/.test(version);

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSignUp = async () => {
    setFullNameTouched(true);
    setDesignationTouched(true);
    setDeviceTouched(true);
    setVersionTouched(true);
    setEmailTouched(true);
    setMobileNumberTouched(true);
 
    setFullNameTouched(true);
    setDesignationTouched(true);
    setDeviceTouched(true);
    setVersionTouched(true);
    setEmailTouched(true);
    setMobileNumberTouched(true);

    let hasEmptyFields = false;
    let hasValidationErrors = false;


    if (!fullName) {
      setFullNameError('Please enter Full Name');
      hasEmptyFields = true;
    } else if (!validateStringField(fullName) || fullName.length < 6) {
      setFullNameError('Full name must be at least 6 letters and contain only letters');
      hasError = true;
    }

    if (!designation) {
      setDesignationError('Please enter Designation');
      hasEmptyFields = true;
    } else if (!validateStringField(designation)) {
      setDesignationError('Please enter valid Designation');
      hasValidationErrors = true;
    }

    if (!device) {
      setDeviceError('Please enter Device');
      hasEmptyFields = true;
    } else if (!validateStringField(device)) {
      setDeviceError('Please enter valid Device');
      hasValidationErrors = true;
    }

    if (!version) {
      setVersionError('Please enter Version');
      hasEmptyFields = true;
    } else if (!validateVersion(version)) {
      setVersionError('Please enter valid Version');
      hasValidationErrors = true;
    }

    if (!email) {
      setEmailError('Please enter Email');
      hasEmptyFields = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter valid Email');
      hasValidationErrors = true;
    }

    if (!mobileNumber) {
      setMobileNumberError('Please enter Mobile Number');
      hasEmptyFields = true;
    } else if (!validateMobileNumber(mobileNumber)) {
      setMobileNumberError('Please enter valid Mobile Number');
      hasValidationErrors = true;
    }

    if (hasEmptyFields && !hasValidationErrors) {
      showAlert('All fields are required');
      return;
    }

    if (hasValidationErrors) return;

    if (email.toLowerCase() === 'admin@gmail.com') {
      setShowUserExistsModal(true);
      return;
    }

    try 
    { 
      await AsyncStorage.multiSet([
        ['@username', fullName],
        ['@email', email],
        ['@mobile', mobileNumber],
        ['@designation', designation],
        ['@device', device],
        ['@version', version],
      ]);
      setShowSuccessModal(true);
    } 
    catch (error) 
    {
      console.error("Error saving data to AsyncStorage", error);
      showAlert("Failed to save data. Please try again.");
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            <Text style={styles.startLine}>Create New Account</Text>
  
            {/* Full Name Field */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={20} color="grey" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    setFullNameTouched(true);
                    setFullNameError('');
                  }}
                  onBlur={() => {
                    if (fullNameTouched) {
                      if (!fullName) setFullNameError('Please enter Full Name');
                      else if (!validateStringField(fullName)) setFullNameError('Please enter valid Full Name');
                    }
                  }}
                />
              </View>
              {fullNameTouched && fullNameError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="red" />
                  <Text style={styles.errorText}>{fullNameError}</Text>
                </View>
              ) : null}
            </View>
  
            {/* Designation Field */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.label}>Designation</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="work" size={20} color="grey" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your designation"
                  value={designation}
                  onChangeText={(text) => {
                    setDesignation(text);
                    setDesignationTouched(true);
                    setDesignationError('');
                  }}
                  onBlur={() => {
                    if (designationTouched) {
                      if (!designation) setDesignationError('Please enter Designation');
                      else if (!validateStringField(designation)) setDesignationError('Please enter valid Designation');
                    }
                  }}
                />
              </View>
              {designationTouched && designationError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="red" />
                  <Text style={styles.errorText}>{designationError}</Text>
                </View>
              ) : null}
            </View>
  
            {/* Device Field */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.label}>Device</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="devices" size={20} color="grey" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your device"
                  value={device}
                  onChangeText={(text) => {
                    setDevice(text);
                    setDeviceTouched(true);
                    setDeviceError('');
                  }}
                  onBlur={() => {
                    if (deviceTouched) {
                      if (!device) setDeviceError('Please enter Device');
                      else if (!validateStringField(device)) setDeviceError('Please enter valid Device');
                    }
                  }}
                />
              </View>
              {deviceTouched && deviceError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="red" />
                  <Text style={styles.errorText}>{deviceError}</Text>
                </View>
              ) : null}
            </View>
  
            {/* Version Field */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.label}>Version</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="system-update" size={20} color="grey" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter version"
                  value={version}
                  onChangeText={(text) => {
                    setVersion(text);
                    setVersionTouched(true);
                    setVersionError('');
                  }}
                  onBlur={() => {
                    if (versionTouched) {
                      if (!version) setVersionError('Please enter Version');
                      else if (!validateVersion(version)) setVersionError('Please enter valid Version');
                    }
                  }}
                />
              </View>
              {versionTouched && versionError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="red" />
                  <Text style={styles.errorText}>{versionError}</Text>
                </View>
              ) : null}
            </View>
  
            {/* Email Field */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={20} color="grey" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputBox}
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailTouched(true);
                    setEmailError('');
                  }}
                  onBlur={() => {
                    if (emailTouched) {
                      if (!email) setEmailError('Please enter Email');
                      else if (!validateEmail(email)) setEmailError('Please enter valid Email');
                    }
                  }}
                />
              </View>
              {emailTouched && emailError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="red" />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : null}
            </View>
  
            {/* Mobile Number Field */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="phone" size={20} color="grey" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChangeText={(text) => {
                    setMobileNumber(text);
                    setMobileNumberTouched(true);
                    setMobileNumberError('');
                  }}
                  onBlur={() => {
                    if (mobileNumberTouched) {
                      if (!mobileNumber) setMobileNumberError('Please enter Mobile Number');
                      else if (!validateMobileNumber(mobileNumber)) setMobileNumberError('Please enter valid Mobile Number');
                    }
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {mobileNumberTouched && mobileNumberError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="red" />
                  <Text style={styles.errorText}>{mobileNumberError}</Text>
                </View>
              ) : null}
            </View>
  
            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
            <Text style={styles.loginButtonText}>Register</Text>
          </TouchableOpacity>
  
            <View style={styles.signupContainer}>
              <Text style={styles.signupLabel}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.LoginHereText}>Login Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  
      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
  
      {/* Success Modal */}
      <Modal
        transparent
        visible={showSuccessModal}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MaterialIcons name="check-circle" size={64} color="green" style={{ marginTop: 24 }} />
            <Text style={styles.modalText}>Successfully registered</Text>
  
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Login'); 
              }}
            >
              <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

     {/*User Exists Modal*/}
      <Modal
        transparent
        visible={showUserExistsModal}
        animationType="fade"
        onRequestClose={() => setShowUserExistsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MaterialIcons name="error-outline" size={64} color="#FFA000" style={{ marginTop: 24 }} />
            <Text style={styles.modalText}>This user already exists</Text>
            <Text style={styles.modalSubText}>Please use a different email address instead</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.modalButton, { width: '48%' }]}
                onPress={() => setShowUserExistsModal(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Go to Login Button */}
        <TouchableOpacity
          style={[styles.modalButton, { width: '48%' }]} 
          onPress={() => {
            setShowUserExistsModal(false);
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },
  startLine: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputFieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputBox: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1C1C1C',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 5,
  },
  LoginHereText: {
    color: '#1A73E8',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#FFA000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  signupLabel: {
    color: '#5F6368',
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 5,
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginLeft: 5,
  },

  //All Alert Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    width: '85%',
    maxWidth: 360,
    overflow: 'hidden',
    alignItems: 'center',
    marginHorizontal: 16,
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
  modalSubText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
    color: '#333',  
    marginBottom: 10,
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
});

export default NewUserRegScreen;