import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal} from 'react-native';

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [otpErrorModalVisible, setOtpErrorModalVisible] = useState(false);
  const showOtpErrorModal = () => setOtpErrorModalVisible(true);
  const closeOtpErrorModal = () => setOtpErrorModalVisible(false);

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a 4-digit OTP.');
      return;
    }

    if (otpString === '1234') {  
      setOtpVerified(true);
      navigation.navigate('User Registration');
    } else {
      showOtpErrorModal();
    }
      };

  const handleChangeOtp = (text, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    } else if (!text && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>We've sent a verification code to your mobile</Text>
      
      <View style={styles.inputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.input, digit ? styles.filledInput : null]}
            value={digit}
            onChangeText={(text) => handleChangeOtp(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={inputRefs[index]}
            textAlign="center"
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => Alert.alert('OTP Resent', 'OTP sent again')}>
        <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink}>Resend</Text></Text>
      </TouchableOpacity>
  
      {/* OTP Error Modal - Now properly nested inside the parent View */}
      <Modal
        visible={otpErrorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeOtpErrorModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Incorrect OTP. Please try again.</Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={closeOtpErrorModal}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1A73E8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  input: {
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#1C1C1C',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filledInput: {
    borderColor: '#1A73E8',
    backgroundColor: '#F0F7FF',
  },
  button: {
    backgroundColor: '#1A73E8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#5F6368',
    textAlign: 'center',
    fontSize: 14,
  },
  resendLink: {
    color: '#1A73E8',
    fontWeight: '600',
  },

  
//INCORRECT OTP Alert Modal 
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


export default OTPScreen;