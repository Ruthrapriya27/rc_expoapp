import React, { useContext, useEffect, useState } from 'react';
import { View, Alert, TextInput, Modal, Text, TouchableOpacity , StyleSheet} from 'react-native';
import { BluetoothContext } from '../Context/BluetoothContext';
import { LogContext } from '../Context/LogContext';
import { Buffer } from 'buffer';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const KeyScreen = () => {
  const { connectedDevice, serviceUUID, writeUUID, readUUID } = useContext(BluetoothContext);
  const { addLog, setDeviceId, setCustomerName , setRfChannel, setTimestamp} = useContext(LogContext);

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
            if (error) {
              Alert.alert('Notification Error', error.message);
              return;
            }

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
                    
                    if (serialNumber.length >= 7) 
                      {
                      const char5 = serialNumber.charAt(5); // 'G'
                      const char6 = serialNumber.charAt(6); // 'R'
                      
                      if (char5 === 'G' && char6 === 'R')                                                                                                                                                              
                      {
                        setDeviceName("GRAB");
                      } 
                      // else if (char5 === 'I' && char6 === 'R') 
                      // {
                      //   setDeviceName("IR/RF");
                      // } 
                      // else if (char5 === 'L' && char6 === 'B') 
                      // {
                      //   setDeviceName("LRM3");
                      // }    
                      else 
                      {
                        setDeviceName("UNKNOWN"); 
                      }
                    }
                  }
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

                if (parsed.data !== undefined && parsed.data !== '' && !(Array.isArray(parsed.data) && parsed.data.length === 0)) 
                  {
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
      title: 'Get Product Name',
      action: 'DEV_SERIAL_NO_GET',
      needsInput: false,
      onSend: () => {
        return JSON.stringify({ cmd: "DEV_SERIAL_NO_GET" });
      }
    },

    {
      title: 'Set Device ID CODE',
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
        // value is in the format YYYYMM from calendar picker
        setTimestamp(value);
        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(4, 6));
        return JSON.stringify({
          cmd: 'PROD_TIMESTAMP_SET',
          args: [{ year: year, month: month }],
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
      title: 'Set RF Channel',
      action: 'RF_CHANNEL_SET',
      needsInput: true,  
      placeholder: 'Select RF Channel',  
      validate: (value) => /^[0-9]+$/.test(value), 
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => {
        setRfChannel(value); 
        return JSON.stringify({ cmd: "RF_CHANNEL_SET", args: [parseInt(value,10)] });
      }
    },
    
    {
      title: 'Get RF Channel',
      action: 'RF_CHANNEL_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_CHANNEL_GET" })
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
      <View style={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <View key={button.title}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress(button)}
            >
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
  
            {index === 0 && deviceName !== '' && (
              <View style={styles.deviceNameBox}>
                <Text style={styles.deviceNameText}>
                  Device Name: {deviceName}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
  
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
                ? `${selectedDate.getFullYear()}${String(
                    selectedDate.getMonth() + 1
                  ).padStart(2, '0')}`
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
        <View style={styles.input}>
          <Picker
            selectedValue={inputValue}
            onValueChange={(itemValue) => setInputValue(itemValue)}
          >
            <Picker.Item label="None" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
          </Picker>
        </View>
      ) : (
        currentAction?.needsInput && (
          <TextInput
            placeholder={currentAction.placeholder}
            value={inputValue}
            onChangeText={setInputValue}
            style={styles.input}
          />
        )
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
      backgroundColor: '#F3E99F' // Light yellow for main background
    },
    buttonContainer: {
      flexDirection: 'column',
      justifyContent: 'center'
    },
    button: {
      backgroundColor: '#98D8AA', // Light green button
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
    deviceNameBox: {
      alignSelf: 'center',
      marginTop: 20,
      marginBottom: 20,
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: '#ffffff', // Section container
      borderLeftWidth: 4,
      borderLeftColor: '#98D8AA', // Light green left border
      borderRadius: 10,
      height: 60,
      justifyContent: 'center'
    },
    deviceNameText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#000000',
      textAlign: 'center'
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
      margin: 20,
      backgroundColor: '#ffffff', // White modal 
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
      textAlign: 'center',
      color: '#FF6D60', // Coral red 
      borderBottomWidth: 2,
      borderBottomColor: '#F7D060', // Yellow 
      paddingBottom: 4
    },
    input: {
      borderColor: '#F7D060', // Yellow 
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
      backgroundColor: '#FF6D60' // Coral red 
    },
    sendButton: {
      backgroundColor: '#98D8AA' // Light green 
    },
    modalButtonText: {
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'center'
    }
  };  

export default KeyScreen;

// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const KeyScreen = () => {
//   const [showPicker, setShowPicker] = useState(false);
//   const [selectedYearMonth, setSelectedYearMonth] = useState(null);

//   const showDatePicker = () => {
//     setShowPicker(true);
//   };

//   const onChange = (event, selectedDate) => {
//     setShowPicker(false);
//     if (selectedDate) {
//       const year = selectedDate.getFullYear();
//       const month = selectedDate.getMonth() + 1;
//       const formatted = `${year}-${month < 10 ? '0' + month : month}`;

//       setSelectedYearMonth(formatted);

//       const jsonCommand = {
//         command: 'setDate',
//         yearMonth: formatted,
//       };

//       console.log('Generated JSON Command:', JSON.stringify(jsonCommand));
//       Alert.alert('Selected Year-Month', formatted);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <TouchableOpacity
//         onPress={showDatePicker}
//         style={{
//           padding: 10,
//           backgroundColor: '#FFA500',
//           borderRadius: 5,
//           marginBottom: 20,
//         }}
//       >
//         <Text style={{ color: '#fff' }}>Pick Year and Month</Text>
//       </TouchableOpacity>

//       {selectedYearMonth && <Text>Selected Year-Month: {selectedYearMonth}</Text>}

//       {showPicker && (
//         <DateTimePicker
//           value={new Date()}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
//           onChange={onChange}
//           maximumDate={new Date()}
//           minimumDate={new Date(2000, 0, 1)}
//         />
//       )}
//     </View>
//   );
// };

// export default KeyScreen;


