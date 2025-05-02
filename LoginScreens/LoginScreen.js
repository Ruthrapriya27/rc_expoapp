import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  // const [error, setError] = useState('');

  const handleLogin = () => navigation.navigate('TabScreen');

  // const handleLogin = () => {
  //   if (email === 'admin' && password === 'admin') {
  //     navigation.navigate('TabScreen'); 
  //   } else {
  //     Alert.alert('Error', 'Invalid credentials');
  //   }
  // };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length < 8) {
      setError('Password must be at least 8 characters');
    } else {
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.startLine}>Welcome to Innospace</Text>
      </View>

      {/* Email Input */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Enter your email</Text>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="email"
          size={20}
          color="grey"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="yourname@gmail.com"
          placeholderTextColor="grey"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.BoxAboveHeader}>
        <Text style={styles.label}>Enter your password</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')}>
  <Text style={styles.forgotPassword}>Forgot password?</Text>
</TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <FontAwesome
          name="key"
          size={18}
          color="grey"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="grey"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin} 
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupLabel}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
    <Text style={styles.forgotPassword}>Signup Here</Text>
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
    backgroundColor: '#F9FAFB', // Light background
  },
  startLine: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8', // Primary Blue
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
    color: '#5F6368', // Secondary Text
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0', // Soft border
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  inputBox: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1C1C1C', // Primary Text
    paddingLeft: 10,
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
    borderLeftWidth: 1,
    // borderLeftColor: '#1A73E8',
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
    color: '#1A73E8', // Primary Blue
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textAlign: 'right',
  },
  loginButton: {
    backgroundColor: '#FFA000', // Accent Orange
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
    color: '#5F6368', // Secondary Text
    fontSize: 14,
  },
  signupLink: {
    color: '#1A73E8', // Primary Blue
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;