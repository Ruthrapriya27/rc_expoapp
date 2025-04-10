import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BluetoothContext } from '../Bluetooth/BluetoothContext';

const DashboardScreen = () => {
  const { customerName, deviceId } = useContext(BluetoothContext);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Device ID Code:</Text>
      <Text style={styles.value}>{deviceId || 'Not Available'}</Text>

      <Text style={styles.label}>Customer Name:</Text>
      <Text style={styles.value}>{customerName || 'Not Available'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    height: '100%',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    marginBottom: 24,
    color: '#333333',
  },
});

export default DashboardScreen;
