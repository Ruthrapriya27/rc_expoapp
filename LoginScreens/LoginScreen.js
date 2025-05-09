import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [passwordTouched, setPasswordTouched] = React.useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@gmail\.com$/;
    return re.test(email);
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

  const validatePassword = (password) => {
    if (password.length < 8) return false;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*#?&]/.test(password);

    return hasLower && hasUpper && hasNumber && hasSpecial;
};

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleLogin = () => {
    // Mark both fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

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

    // Password validation
    if (!password) {
        setPasswordError('Please enter your password');
        hasValidationError = true;
    } else if (!validatePassword(password)) {
        shouldShowPasswordAlert = true;
        hasValidationError = true; // Add this line
    }

    // Show password alert if password is invalid
    if (shouldShowPasswordAlert) {
        showAlert('Please enter a valid password');
        return; // Add this line to prevent further checks
    }

    // Return if we have any other validation errors
    if (hasValidationError) return;

    navigation.navigate('TabScreen');

    // Credentials check
    // if (email === 'admin@gmail.com' && password === 'Admin@123') {
    //     navigation.navigate('TabScreen');
    // } else {
    //     showAlert('User Doesnt Exist.Please try again.');
    // }
};

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.startLine}>Welcome to Innospace</Text>
      </View>

      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Enter your email</Text>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="grey" style={styles.inputIcon} />
        <TextInput
          style={styles.inputBox}
          placeholder="yourname@gmail.com"
          placeholderTextColor="grey"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailTouched(true);
            setEmailError('');
          }}
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

      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Enter your password</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <FontAwesome name="key" size={18} color="grey" style={styles.inputIcon} />
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="grey"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordTouched(true);
            setPasswordError('');
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="grey" />
        </TouchableOpacity>
      </View>
      {passwordError !== '' && passwordTouched && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={16} color="red" />
          <Text style={styles.errorText}>{passwordError}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupLabel}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.forgotPassword}>Signup Here</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.alertModalOverlay}>
          <View style={styles.alertModalContainer}>
            <Text style={styles.alertModalText}>{alertMessage}</Text>
            {alertMessage === 'Please enter a valid password' && <PasswordRequirements />}
            <Pressable
              style={styles.alertModalButton}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={styles.alertModalButtonText}>OK</Text>
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
    paddingHorizontal: 30,
    backgroundColor: '#F9FAFB',
  },
  startLine: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 30,
    textAlign: 'center',
  },
  BoxAboveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 15,
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
    paddingLeft: 10,
    paddingRight: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 5,
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
    paddingLeft: 10,
    paddingRight: 15,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    color: '#1A73E8',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textAlign: 'right',
  },
  loginButton: {
    backgroundColor: '#FFA000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
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
    marginTop: 10,
  },
  signupLabel: {
    color: '#5F6368',
    fontSize: 14,
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
  alertModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  alertModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    width: '85%',
    maxWidth: 360,
    overflow: 'hidden',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  alertModalText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    color: '#000',
    fontWeight: '400',
    lineHeight: 24,
  },
  alertModalButton: {
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  alertModalButtonText: {
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

export default LoginScreen;
