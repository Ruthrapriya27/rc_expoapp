import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSendOTP = () => {
    setIsModalVisible(true);
  };

  const handleOptionSelect = (method) => {
    setIsModalVisible(false);
    console.log(`Send OTP via ${method}`);
  
    if (method === 'Email') {
      navigation.navigate('OtpVerification', {
        method: 'Email',
        email: email,
      });
    } else if (method === 'Mobile') {
      navigation.navigate('OtpVerification', {
        method: 'Mobile',
        mobile: mobile,
      });
    }
  };
  

  const handleGmailSignup = () => {
    console.log('Redirecting to Gmail');
    // navigation.navigate('Dashboard'); // Simulate successful login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up Here!</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mobile number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.otpButton} onPress={handleSendOTP}>
        <Text style={styles.otpButtonText}>Send OTP</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.gmailButton} onPress={handleGmailSignup}>
      <Icon name="gmail" style={styles.icon} />
      <Text style={styles.gmailButtonText}>Sign up using Gmail  </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose OTP Method</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionSelect('Email')}
            >
              <View style={styles.circle} />
              <Text style={styles.optionText}>Via Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionSelect('Mobile')}
            >
              <View style={styles.circle} />
              <Text style={styles.optionText}>Via Mobile</Text>
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
    backgroundColor: '#F9FAFB', // New background
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A73E8', // Primary Blue
    alignSelf: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderColor: '#E0E0E0', // Soft border
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    color: '#5F6368', // Secondary text
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: '#1C1C1C', // Primary text
    backgroundColor: '#FFFFFF', // Card-style input
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  otpButton: {
    backgroundColor: '#FFA000', // Accent Orange
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  otpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 25,
  },
  gmailButton: {
    backgroundColor: '#1A73E8', // Primary Blue
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#1A73E8',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  gmailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 24,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFA000',
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#1C1C1C',
  },
});

export default SignUpScreen;

