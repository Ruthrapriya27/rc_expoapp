import React, { useContext, useEffect, useState } from 'react';
import { View, Alert, TextInput, Modal, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BluetoothContext } from '../Context/BluetoothContext';
import { LogContext } from '../Context/LogContext';
import { Buffer } from 'buffer';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const KeyScreen = () => {
  const { connectedDevice, serviceUUID, writeUUID, readUUID } = useContext(BluetoothContext);
  const { addLog, setDeviceId, setCustomerName, setRfChannel, setTimestamp } = useContext(LogContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentAction, setCurrentAction] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    let subscription;
    const monitorResponse = async () => {
      if (connectedDevice && serviceUUID && readUUID) {
        subscription = connectedDevice.monitorCharacteristicForService(
          serviceUUID,
          readUUID,
          (error, characteristic) => {
            if (characteristic?.value) {
              try {
                const decoded = Buffer.from(characteristic.value, 'base64').toString('utf8');
                console.log('Received from ESP32:', decoded);
                addLog(`Received from ESP32:' ${decoded}`);
                let parsed;

                try {
                  parsed = JSON.parse(decoded);
                  if (parsed.rsp === "DEV_SERIAL_NO_GET" && parsed.err === 0 && parsed.data && parsed.data.length > 0) {
                    const serialNumber = parsed.data[0];
                    setSerialNumber(serialNumber);

                    if (serialNumber.length >= 7) {
                      const char5 = serialNumber.charAt(5);
                      const char6 = serialNumber.charAt(6);

                      if (char5 === 'G' && char6 === 'R') {
                        setDeviceName("GRAB");
                      } else if (char5 === 'I' && char6 === 'R') {
                        setDeviceName("IR/RF");
                      } else if (char5 === 'L' && char6 === 'R') {
                        setDeviceName("LRM3");
                      } else {
                        setDeviceName("UNKNOWN");
                      }
                    }
                  }
                } catch (jsonError) {
                  Alert.alert('JSON Parse Error', jsonError.message);
                  return;
                }

                const errorMessages = {
                  0: { description: 'No error', action: 'None' },
                  1: { description: 'Internal error', action: 'Check the request data' },
                  2: { description: 'Invalid request', action: 'Check the request data and format' },
                  3: {
                    description: 'Communication error',
                    action: 'Check data format is correct, verify correct transmission, baud rate, and check hardware connection'
                  },
                };

                const errorCode = parsed.err;
                const errorInfo = errorMessages[errorCode];
                let description = errorInfo?.description || 'Unknown';
                let action = errorInfo?.action || 'Unknown';
                const message = parsed.msg?.trim() !== '' ? parsed.msg : 'NULL';
                let dataOutput = 'NULL';

                if (parsed.data !== undefined && parsed.data !== '' && !(Array.isArray(parsed.data) && parsed.data.length === 0)) {
                  dataOutput = Array.isArray(parsed.data) ? parsed.data.join(', ') : parsed.data.toString();
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
  }, [connectedDevice, serviceUUID, readUUID, addLog]);

  const sendCommand = async (jsonCommand) => {
    if (!connectedDevice || !serviceUUID || !writeUUID || !readUUID) {
      console.log('Error: Bluetooth service/characteristics are not set');
      return;
    }

    try {
      const base64Command = Buffer.from(jsonCommand).toString('base64');
      await connectedDevice.writeCharacteristicWithoutResponseForService(serviceUUID, writeUUID, base64Command);
      console.log('Command sent successfully:', jsonCommand);
      addLog(`Command sent successfully: ${jsonCommand}`);
    } catch (error) {
      console.log('Error sending command:', error.message);
      addLog(`Error sending command: ${error.message}`);
    }
  };

  const buttons = [
    {
      title: 'Get Product Name',
      action: 'DEV_SERIAL_NO_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "DEV_SERIAL_NO_GET" })
    },
    {
      title: 'Set Device ID Code',
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
      placeholder: 'Select Year and Month',
      validate: (value) => /^\d{6}$/.test(value),
      errorMessage: 'Invalid input. Format must be YYYYMM.',
      onSend: (value) => {
        setTimestamp(value);
        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(4, 6));
        return JSON.stringify({ cmd: 'PROD_TIMESTAMP_SET', args: [{ year, month }] });
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
      title: 'Set RF Channel',
      action: 'RF_CHANNEL_SET',
      needsInput: true,
      placeholder: 'Select RF Channel',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => {
        setRfChannel(value);
        return JSON.stringify({ cmd: "RF_CHANNEL_SET", args: [parseInt(value, 10)] });
      }
    },
    {
      title: 'Get RF Channel',
      action: 'RF_CHANNEL_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_CHANNEL_GET" })
    }
  ];


  const rfbuttons = [
    {
      title: 'Set RF Channel',
      action: 'RF_CHANNEL_SET',
      needsInput: true,
      placeholder: 'Select RF Channel',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => {
        setRfChannel(value);
        return JSON.stringify({ cmd: "RF_CHANNEL_SET", args: [parseInt(value, 10)] });
      }
    },
    {
      title: 'Get RF Channel',
      action: 'RF_CHANNEL1_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_CHANNEL_GET" })
    },
    {
      title: 'Get Product Name',
      action: 'DEV_SERIAL_NO_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "DEV_SERIAL_NO_GET" })
    },
    {
      title: 'Set Device ID Code',
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
      placeholder: 'Select Year and Month',
      validate: (value) => /^\d{6}$/.test(value),
      errorMessage: 'Invalid input. Format must be YYYYMM.',
      onSend: (value) => {
        setTimestamp(value);
        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(4, 6));
        return JSON.stringify({ cmd: 'PROD_TIMESTAMP_SET', args: [{ year, month }] });
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
    <>
      <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
        {/* Top Row Container */}
        <View style={styles.topRowContainer}>
          <View style={styles.topButtonWrapper}>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => handleButtonPress(buttons[0])}
            >
              <Text style={styles.topButtonText}>Get Product Name</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.deviceInfoWrapper}>
            {deviceName !== '' && (
              <View style={styles.deviceInfoContainer}>
                <Text style={styles.deviceInfoText} numberOfLines={1}>
                  {deviceName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Configurations Container */}
        <View style={styles.configContainer}>
          <ScrollView style={styles.scrollContainer}>
            {buttons.slice(1).map((button, index) => (
              <View key={button.title}>
                <TouchableOpacity
                  style={styles.configItem}
                  onPress={() => handleButtonPress(button)}
                >
                  <Text style={styles.configItemText} numberOfLines={1}>{button.title}</Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
                {index < buttons.slice(1).length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </ScrollView>
        </View>
    

        {/* Product Configurations Container */}
          <View style={styles.productConfigContainer}>
            <ScrollView style={styles.scrollContainer}>
              {rfbuttons.map((button, index) => (
                <View key={button.title}>
                  <TouchableOpacity
                    style={styles.productConfigItem}
                    onPress={() => handleButtonPress(button)}
                  >
                    <Text style={styles.productConfigItemText} numberOfLines={1}>{button.title}</Text>
                    <Text style={styles.arrow}>›</Text>
                  </TouchableOpacity>
                  {index < rfbuttons.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </ScrollView>
          </View>
      </ScrollView>

      {/* Modal remains unchanged */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentAction?.title}</Text>

            {currentAction?.title === 'Set Timestamp' ? (
              <>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  <Text>
                    {selectedDate
                      ? `${selectedDate.getFullYear()}${String(selectedDate.getMonth() + 1).padStart(2, '0')}`
                      : 'Pick Year and Month'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    display="calendar"
                    onChange={(event, selected) => {
                      setShowDatePicker(false);
                      if (selected) {
                        setSelectedDate(selected);
                        const y = selected.getFullYear();
                        const m = selected.getMonth() + 1;
                        setInputValue(`${y}${m < 10 ? '0' + m : m}`);
                      }
                    }}
                    minimumDate={new Date(2000, 0, 1)}
                    maximumDate={new Date(2099, 11, 31)}
                  />
                )}
              </>
            ) : currentAction?.title === 'Set RF Channel' ? (
              <Picker
                selectedValue={inputValue}
                onValueChange={(itemValue) => setInputValue(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select RF Channel" value="" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
              </Picker>
            ) : (
              <TextInput
                style={styles.input}
                placeholder={currentAction?.placeholder}
                value={inputValue}
                onChangeText={setInputValue}
              />
            )}

            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSend} style={styles.setButton}>
                <Text>Set Value</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    height: 60, // Fixed height for top row
  },
  topButtonWrapper: {
    flex: 0.4, // Takes 40% of row width
    paddingRight: 10,
  },
  deviceInfoWrapper: {
    flex: 0.6, // Takes 60% of row width
  },
  topButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // height: '60px',
    width: 160,
  },
  topButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deviceInfoContainer: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // height: '60px',
    width: 160,
  },
  deviceInfoText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  configContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    height: 300, // Height for 6 items
  },
  productConfigContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    height: 500, // Height for 2 items
  },
  scrollContainer: {
    flex: 1,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  productConfigItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  configItemText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  productConfigItemText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  arrow: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
    width: 20,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e5ea',
    marginLeft: 16,
    marginRight: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 8
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center'
  },
  setButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center'
  }
});

export default KeyScreen;
