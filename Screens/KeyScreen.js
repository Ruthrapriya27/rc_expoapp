import React, { useContext, useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { BluetoothContext } from '../Bluetooth/BluetoothContext';
import { Buffer } from 'buffer';

const KeyScreen = () => {
  const {
    connectedDevice,
    serviceUUID,
    writeUUID,
    readUUID,
  } = useContext(BluetoothContext);

  useEffect(() => {
    let subscription;

    const monitorResponse = async () => {
      if (connectedDevice && serviceUUID && readUUID) {
        subscription = connectedDevice.monitorCharacteristicForService(
          serviceUUID,
          readUUID,
          (error, characteristic) => {
            if (error) {
              Alert.alert('Notification Error', error.message);
              return;
            }

            if (characteristic?.value) {
              try {
                const decoded = Buffer.from(characteristic.value, 'base64').toString('utf8');
                console.log('Received from ESP32:', decoded);
                Alert.alert('Command Response', decoded);
              } catch (decodeError) {
                Alert.alert('Decode Error', decodeError.message);
              }
            }
          }
        );
      }
    };

    monitorResponse();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [connectedDevice, serviceUUID, readUUID]);

  const sendCommand = async (jsonCommand) => {
    if (!connectedDevice || !serviceUUID || !writeUUID || !readUUID) {
      return;
    }

    const base64Command = Buffer.from(jsonCommand).toString('base64');
    await connectedDevice.writeCharacteristicWithResponseForService(
      serviceUUID,
      writeUUID,
      base64Command
    );
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
