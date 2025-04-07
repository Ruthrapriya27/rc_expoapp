import React, { useContext } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { BluetoothContext } from '../Bluetooth/BluetoothContext';
import { Buffer } from 'buffer';

const KeyScreen = () => {
  const {
    connectedDevice,
    serviceUUID,
    writeUUID,
  } = useContext(BluetoothContext);

  const sendCommand = async (jsonCommand) => {
    if (!connectedDevice || !serviceUUID || !writeUUID) {
      return;
    }
  
    try {
      const base64Command = Buffer.from(jsonCommand).toString('base64');
      await connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeUUID,
        base64Command
      );
      console.log('Sent:', jsonCommand);
    } catch (error) {
      console.log('Error sending:', error);
    }
  };

  return (
    <View style={styles.container}>
    <Button
      title="Set Device ID"
      onPress={() => sendCommand('{"cmd": "DEV_IDCODE_SET","args": ["1234"]}')} 
    />
    <Button
      title="Get Timestamp"
      onPress={() => sendCommand('{"cmd": "PROD_TIMESTAMP_GET"}')}
    />
    <Button
      title="Get Customer Name"
      onPress={() => sendCommand('{"cmd": "CUSTOMER_NAME_GET"}')}
    />
    <Button
      title="Set Customer Name"
      onPress={() => sendCommand('{"cmd": "CUSTOMER_NAME_SET", "args": ["INNOSPACE"]}')}
    />
    <Button
      title="Get RF Frequency"
      onPress={() => sendCommand('{"cmd": "RF_FREQ_GET"}')}
    />
  </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'space-around',
    height: '100%',
  },
});

export default KeyScreen;    