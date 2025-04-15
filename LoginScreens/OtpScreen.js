import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a 4-digit OTP.');
      return;
    }

    if (otpString === '1234') {  // Replace with real OTP check logic
      setOtpVerified(true);
      // Navigate to NewUserRegistrationScreen after verification
      navigation.navigate('User Registration');
    } else {
      Alert.alert('Error', 'Incorrect OTP. Please try again.');
    }
  };

  const handleChangeOtp = (text, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.inputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={digit}
            onChangeText={(text) => handleChangeOtp(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={inputRefs[index]}
            textAlign="center"
            autoFocus={index === 0}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Alert.alert('OTP Resent', 'OTP sent again')}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F3E99F',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FF6D60',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#F7D060',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: 50,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#98D8AA',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FF6D60',
    fontSize: 16,
  },
  resendText: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default OTPScreen;
