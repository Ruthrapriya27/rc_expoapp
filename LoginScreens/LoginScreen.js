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

  const handleLogin = () => navigation.navigate('TabScreen');
  
  // const handleLogin = () => {
  //   if (email === 'admin@gmail.com' && password === 'admin') {
  //     navigation.navigate('TabScreen'); 
  //   } else {
  //     Alert.alert('Error', 'Invalid credentials');
  //   }
  // };

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
    backgroundColor: '#F3E99F', // Light yellow 
  },
  startLine: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6D60', // Coral red
    marginBottom: 30,
    textAlign: 'center',
    textDecorationColor: '#F7D060', // Yellow 
  },
  BoxAboveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#FF6D60', // Coral red
    marginBottom: 10,
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F7D060', // Yellow 
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderLeftWidth: 5, 
    borderLeftColor: '#98D8AA',// Light green 
  },
  inputBox: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
    paddingLeft: 10,
    paddingRight: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F7D060', // Yellow border
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderLeftWidth: 5, 
    borderLeftColor: '#98D8AA',// Light green 
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
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
    color: '#FF6D60', // Coral red
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  loginButton: {
    // backgroundColor: '#98D8AA', // Light green
  backgroundColor: '#5DB075',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
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
    color: '#FF6D60', // Coral red
  },
  signupLink: {
    color: '#FF6D60', // Coral red
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  }
});

export default LoginScreen;