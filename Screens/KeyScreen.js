import React, { useContext, useEffect, useState } from 'react';
import { View, Alert, TextInput, Modal, Text, TouchableOpacity } from 'react-native';
import { BluetoothContext } from '../Context/BluetoothContext';
import { LogContext } from '../Context/LogContext';
import { Buffer } from 'buffer';

const KeyScreen = () => {
  const { connectedDevice, serviceUUID, writeUUID, readUUID } = useContext(BluetoothContext);
  const { addLog, setDeviceId, setCustomerName } = useContext(LogContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentAction, setCurrentAction] = useState(null);

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
    return () => subscription?.remove();
  }, [connectedDevice, serviceUUID, readUUID]);

  const sendCommand = async (jsonCommand) => {
    if (!connectedDevice || !serviceUUID || !writeUUID || !readUUID) {
      console.log('Error: Bluetooth service/characteristics are not set');
      return;
    }
  
    try {
      const base64Command = Buffer.from(jsonCommand).toString('base64');
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

  const buttons = [
    {
      title: 'Set Device ID',
      action: 'DEV_IDCODE_SET',
      needsInput: true,
      placeholder: 'Enter ID Code (e.g., 1234)',
      validate: (value) => /^\d+$/.test(value) && value.length <= 15,
      errorMessage: 'Invalid input. Only numbers up to 15 digits allowed.',
      onSend: (value) => {
        setDeviceId(value);
        return JSON.stringify({ cmd: "DEV_IDCODE_SET", args: [value] });
      }
    },
    {
      title: 'Set Timestamp',
      action: 'PROD_TIMESTAMP_SET',
      needsInput: true,
      placeholder: 'Enter Year and Month (e.g., 202503)',
      validate: (value) => /^\d{6}$/.test(value),
      errorMessage: 'Invalid input. Format must be YYYYMM.',
      onSend: (value) => {
        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(4, 6));
        return JSON.stringify({
          cmd: "PROD_TIMESTAMP_SET",
          args: [{ year: year, month: month }]
        });
      }
    },
    {
      title: 'Set Customer Name',
      action: 'CUSTOMER_NAME_SET',
      needsInput: true,
      placeholder: 'Enter Customer Name (e.g., Innospace)',
      validate: (value) => /^[a-zA-Z0-9 ]+$/.test(value),
      errorMessage: 'Invalid input. Only alphanumeric characters and spaces allowed.',
      onSend: (value) => {
        setCustomerName(value);
        return JSON.stringify({ cmd: "CUSTOMER_NAME_SET", args: [value] });
      }
    },
    {
      title: 'Get Customer Name',
      action: 'CUSTOMER_NAME_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "CUSTOMER_NAME_GET" })
    },
    {
      title: 'Get Firmware Version',
      action: 'FIRMWARE_VERSION_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "FIRMWARE_VERSION_GET" })
    }
  ];

  const handleButtonPress = (buttonConfig) => {
    setCurrentAction(buttonConfig);
    if (buttonConfig.needsInput) {
      setInputValue('');
      setModalVisible(true);
    } else {
      sendCommand(buttonConfig.onSend());
    }
  };

  const handleSend = () => {
    if (currentAction.validate && !currentAction.validate(inputValue)) {
      Alert.alert('Error', currentAction.errorMessage);
      return;
    }
    sendCommand(currentAction.onSend(inputValue));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => handleButtonPress(button)}
        >
          <Text style={styles.buttonText}>{button.title}</Text>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentAction?.title}</Text>
            
            {currentAction?.needsInput && (
              <TextInput
                placeholder={currentAction.placeholder}
                value={inputValue}
                onChangeText={setInputValue}
                style={styles.input}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.sendButton]}
                onPress={handleSend}
              >
                <Text style={styles.modalButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    padding: 24,
    margin: 16,
    borderRadius: 12,
    justifyContent: 'space-evenly',
    height: '90%',
    backgroundColor: '#ffffff'
  },
  button: {
    backgroundColor: '#E5E5EA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    minWidth: '45%',
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#E5E5EA'
  },
  sendButton: {
    backgroundColor: '#E5E5EA'
  },
  modalButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center'
  }
};

export default KeyScreen;
