import React, { useContext, useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { BluetoothContext } from '../Context/BluetoothContext';
import { LogContext } from '../Context/LogContext';
import { Buffer } from 'buffer';

const KeyScreen = () => {
  const {
    connectedDevice,
    serviceUUID,
    writeUUID,
    readUUID,
  } = useContext(BluetoothContext);

  const { addLog, setDeviceId, setCustomerName } = useContext(LogContext);
  const [devIdCommand, setDevIdCommand] = useState('{"cmd": "DEV_IDCODE_SET","args": ["1234"]}');
  const [timestampCommand, setTimestampCommand] = useState('{"cmd": "PROD_TIMESTAMP_GET"}');
  const [custNameSetCommand, setCustNameSetCommand] = useState('{"cmd": "CUSTOMER_NAME_SET", "args": ["INNOSPACE"]}');
  const [relayCountCommand, setRelayCountCommand] = useState('{"cmd": "RELAY_COUNT_GET"}');

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
                addLog(`Received from ESP32: ${decoded}`);

                let parsed;

                try {
                  parsed = JSON.parse(decoded);
                } catch (jsonError) {
                  Alert.alert('JSON Parse Error', jsonError.message);
                  return;
                }

                const errorMessages = {
                  0: {
                    description: 'No error',
                    action: 'None',
                  },
                  1: {
                    description: 'Internal error',
                    action: 'Check the request data',
                  },
                  2: {
                    description: 'Invalid request',
                    action: 'Check the request data and format',
                  },
                  3: {
                    description: 'Communication error',
                    action: 'Check data format is correct, verify correct transmission, baud rate, and check hardware connection',
                  },
                };

                const errorCode = parsed.err;
                const errorInfo = errorMessages[errorCode];

                let description = 'Unknown';
                let action = 'Unknown';

                if (errorInfo) {
                  description = errorInfo.description;
                  action = errorInfo.action;
                }

                const message = parsed.msg && parsed.msg.trim() !== '' ? parsed.msg : 'NULL';

                let dataOutput = 'NULL';

                if (parsed.data !== undefined && parsed.data !== '' && !(Array.isArray(parsed.data) && parsed.data.length === 0)) {
                  if (Array.isArray(parsed.data)) {
                    dataOutput = parsed.data.join(', ');
                  } else {
                    dataOutput = parsed.data.toString();
                  }
                }

                Alert.alert(
                  'Status',
                  `Description: ${description}\nAction: ${action}\nMessage: ${message}\nData: ${dataOutput}`
                );

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
      console.log('Error: Bluetooth service/characteristics are not set');
      return;
    }
  
    const base64Command = Buffer.from(jsonCommand).toString('base64');
  
    try {
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        serviceUUID,
        writeUUID,
        base64Command
      );
      console.log('Command sent successfully:', jsonCommand);
      addLog(`Command sent successfully: ${jsonCommand}`);

    } catch (error) {
      console.log('Error sending command:', error.message);
      addLog(`Error sending command: ${error.message}`);
    }
  };
  
  
  return (
    
    <View style={styles.container}>
    <TextInput
      placeholder="Enter ID Code eg.,1234"
      onChangeText={(text) => {
        setDeviceId(text);
        const newCommand = {
          cmd: "DEV_IDCODE_SET",
          args: [text]
        };
        setDevIdCommand(JSON.stringify(newCommand));
      }}
      style={styles.input}
    />
    <Button
      title="Set Device ID"
      onPress={() => {
        try {
          const parsed = JSON.parse(devIdCommand);
          const arg = parsed.args?.[0];
  
          if (!/^\d+$/.test(arg)|| arg.length > 15) {
            Alert.alert('Invalid input. Command not sent');
            return;
          }
  
          sendCommand(devIdCommand);
        } catch (e) {
          Alert.alert('Invalid input format');
        }
      }}
    />
    
 <TextInput
  placeholder="Enter Timestamp eg.,202503"
  onChangeText={(text) => {
    const newCommand = {
      cmd: "PROD_TIMESTAMP_SET",
      args: [parseInt(text)]
    };
    setTimestampCommand(JSON.stringify(newCommand));
  }}
  style={styles.input}
/>
<Button
  title="Set Timestamp"
  onPress={() => {
    try {
      const parsed = JSON.parse(timestampCommand);
      const arg = parsed.args?.[0];

      if (!/^\d+$/.test(arg)) {
        Alert.alert('Invalid input. Command not sent.');
        return;
      }

      sendCommand(timestampCommand);
    } catch (e) {
      Alert.alert('Invalid input format.');
    }
  }}
/>

  
    <TextInput
      placeholder="Enter Customer Name eg.,Innospace"
      onChangeText={(text) => {
        setCustomerName(text);
        const newCommand = {
          cmd: "CUSTOMER_NAME_SET",
          args: [text]
        };
        setCustNameSetCommand(JSON.stringify(newCommand));
      }}
      style={styles.input}
    />
    <Button
      title="Set Customer Name"
      onPress={() => {
        try {
          const parsed = JSON.parse(custNameSetCommand);
          const arg = parsed.args?.[0];
  
          if (!/^[a-zA-Z0-9 ]+$/.test(arg)) {
            Alert.alert('Invalid input. Command not sent.');
            return;
          }
  
          sendCommand(custNameSetCommand);
        } catch (e) {
          Alert.alert('Invalid input format.');
        }
      }}
    />
  
    <Button
      title="Get Customer Name"
      onPress={() => sendCommand(custNameGetCommand)}
    />
  
    <Button
      title="Get Relay Count"
      onPress={() => sendCommand(relayCountCommand)}
    />
  </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    padding: 24,
    margin: 16,
    borderRadius: 12,
    justifyContent: 'space-evenly',
    height: '90%',
    backgroundColor: '#ffffff'
  },

  input: {
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8
  }
});

export default KeyScreen;
 