import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@gmail\.com$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 8) return false;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*#?&]/.test(password);

    return hasLower && hasUpper && hasNumber && hasSpecial;
  };

  const PasswordRequirements = () => {
    return (
      <View style={passwordStyles.container}>
        <Text style={passwordStyles.title}>Your password must contain:</Text>

        <View style={passwordStyles.requirement}>
          <FontAwesome name="check" size={16} color="#4CAF50" />
          <Text style={passwordStyles.text}>At least 8 characters</Text>
        </View>

        <View style={passwordStyles.requirement}>
          <FontAwesome name="check" size={16} color="#4CAF50" />
          <Text style={passwordStyles.text}>Required:</Text>
        </View>

        <View style={passwordStyles.subRequirement}>
          <FontAwesome name="circle" size={8} color="#000" style={passwordStyles.bullet} />
          <Text style={passwordStyles.text}>Lower case letters (a-z)</Text>
        </View>

        <View style={passwordStyles.subRequirement}>
          <FontAwesome name="circle" size={8} color="#000" style={passwordStyles.bullet} />
          <Text style={passwordStyles.text}>Upper case letters (A-Z)</Text>
        </View>

        <View style={passwordStyles.subRequirement}>
          <FontAwesome name="circle" size={8} color="#000" style={passwordStyles.bullet} />
          <Text style={passwordStyles.text}>Numbers (0-9)</Text>
        </View>

        <View style={passwordStyles.subRequirement}>
          <FontAwesome name="circle" size={8} color="#000" style={passwordStyles.bullet} />
          <Text style={passwordStyles.text}>Special characters (ex. !@#$%^&*)</Text>
        </View>
      </View>
    );
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleResetPassword = () => {
    // Mark all fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let shouldShowPasswordAlert = false;
    let hasValidationError = false;

    // Email validation
    if (!email) {
      setEmailError('Please enter your email address');
      hasValidationError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasValidationError = true;
    }

    // New Password validation
    if (!newPassword) {
      setPasswordError('Please enter your new password');
      hasValidationError = true;
    } else if (!validatePassword(newPassword)) {
      shouldShowPasswordAlert = true;
      hasValidationError = true;
    }

    // Confirm Password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your new password');
      hasValidationError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasValidationError = true;
    }

    // Show password alert if password is invalid
    if (shouldShowPasswordAlert) {
      showAlert('Please enter a valid password');
      return;
    }

    // Return if we have any other validation errors
    if (hasValidationError) return;

    // Here you would typically call your API to reset the password
    showAlert('Password reset successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.instruction}>
        Enter your registered email address to reset your password.
      </Text>

      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailTouched(true);
            setEmailError('');
          }}
          placeholder="yourname@gmail.com"
          placeholderTextColor="grey"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {emailError !== '' && emailTouched && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={16} color="red" />
          <Text style={styles.errorText}>{emailError}</Text>
        </View>
      )}

      <Text style={styles.label}>New Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setPasswordTouched(true);
            setPasswordError('');
          }}
          placeholder="Enter new password"
          placeholderTextColor="grey"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
       <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
      </View>
      {passwordError !== '' && passwordTouched && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={16} color="red" />
          <Text style={styles.errorText}>{passwordError}</Text>
        </View>
      )}

      <Text style={styles.label}>Confirm New Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordTouched(true);
            setConfirmPasswordError('');
          }}
          placeholder="Confirm new password"
          placeholderTextColor="grey"
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
       <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Text>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>

      </View>
      {confirmPasswordError !== '' && confirmPasswordTouched && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={16} color="red" />
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            {alertMessage === 'Please enter a valid password' && <PasswordRequirements />}
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setAlertVisible(false);
                if (alertMessage === 'Password reset successfully!') {
                  navigation.navigate('Login');
                }
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A73E8',
    marginBottom: 16,
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#5F6368',
    fontSize: 15,
  },
  label: {
    marginBottom: 8,
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 40,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputBox: {
    height: 50,
    fontSize: 16,
    color: '#1C1C1C',
    paddingLeft: 15,
    paddingRight: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1C1C1C',
    paddingLeft: 15,
    paddingRight: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  resetButton: {
    backgroundColor: '#FFA000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginLeft: 5,
  },
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

const passwordStyles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  subRequirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginVertical: 2,
  },
  text: {
    marginLeft: 10,
    fontSize: 14,
  },
  bullet: {
    marginRight: 10,
  },
});

export default ForgotPasswordScreen;