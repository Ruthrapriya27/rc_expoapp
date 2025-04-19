  import React, { useContext, useEffect, useState } from 'react';
  import { View, Alert, TextInput, Modal, Text, TouchableOpacity, StyleSheet, ScrollView ,Pressable} from 'react-native';
  import { BluetoothContext } from '../Context/BluetoothContext';
  import { LogContext } from '../Context/LogContext';
  import { Buffer } from 'buffer';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import { Picker } from '@react-native-picker/picker';

  const KeyScreen = () => {

    //USE STATES 
    const { connectedDevice, serviceUUID, writeUUID, readUUID } = useContext(BluetoothContext);
    const { addLog, setDeviceId, setCustomerName, setRfChannel, setTimestamp } = useContext(LogContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [currentAction, setCurrentAction] = useState(null);
    const [serialNumber, setSerialNumber] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [inputKeyIndex, setInputKeyIndex] = useState("");
    const [inputKeyValue, setInputKeyValue] = useState("");
  
    //RESPONSE READ AND LABEL MAP FOR OUTPUT RESPONSE VALUE
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

                    if (parsed.rsp === "RF_FIRMWARE_VERSION_GET" && parsed.err === 0 && parsed.data?.[0]) {
                      parsed.data[0] = parsed.data[0].toString().split('').join('.');
                    }

                    if ((parsed.rsp === "DEV_TYPE_GET" || parsed.rsp === "RF_DEV_TYPE_GET") && 
                        parsed.err === 0 && parsed.data && parsed.data.length > 0) {
                      const deviceType = parsed.data[0];
                      parsed.data[0] = deviceType === 1 ? "Transmitter" : "Receiver";
                    }
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
                        } else if (char5 === 'L' && char6 === '3') {
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

      //RESPONSE FROM DEVICE
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

    //COMMON BUTTONS CONFIGURATIONS
    const cbuttons = [
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
        title: 'Get Device ID Code',
        action: 'DEV_IDCODE_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "DEV_IDCODE_GET" })
      },
      {
        title: 'Set Production Timestamp',
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
        title: 'Get Production Timestamp',
        action: 'PROD_TIMESTAMP_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "PROD_TIMESTAMP_GET" })
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
        title: 'Set Device ID',
        action: 'DEV_ID_SET',
        needsInput: true,
        placeholder: 'Enter Device ID (e.g., 000000)',
        validate: (value) => /^\d+$/.test(value) && value.length <= 15,
        errorMessage: 'Invalid input. Only numbers up to 15 digits allowed.',
        onSend: (value) => {
          setDeviceId(value);
          return JSON.stringify({ cmd: "DEV_ID_SET", args: [value] });
        }
      },
      {
        title: 'Get Device ID',
        action: 'DEV_ID_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "DEV_ID_GET" })
      },
      {
        title: 'Get Device Type',
        action: 'DEV_TYPE_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "DEV_TYPE_GET" })
      },
      {
        title: 'Get Firmware Version',
        action: 'FIRMWARE_VERSION_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "FIRMWARE_VERSION_GET" })
      },
      {
        title: 'Reset Configuration',
        action: 'RESET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "RESET" })
      }
    ];  

    //RF BUTTONS CONFIGURATIONS 
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
        title: 'Set RF Frequency',
        action: 'RF_FREQ_SET',
        needsInput: true,
        placeholder: 'Enter Frequency (e.g., 433000000)',
        validate: (value) => /^[0-9]+$/.test(value),
        errorMessage: 'Invalid input. Only numeric values allowed.',
        onSend: (value) => JSON.stringify({ cmd: "RF_FREQ_SET", args: [parseInt(value, 10)] })
      },
      {
        title: 'Get RF Frequency',
        action: 'RF_FREQ_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "RF_FREQ_GET" })
      }, 
      {
        title: 'Set RF Logical Address',
        action: 'RF_LOGICADDR_SET',
        needsInput: true,
        placeholder: 'Enter Logical Address (e.g., 1)',
        validate: (value) => /^[0-9]+$/.test(value),
        errorMessage: 'Invalid input. Only numeric values allowed.',
        onSend: (value) => JSON.stringify({ cmd: "RF_LOGICADDR_SET", args: [parseInt(value, 10)] })
      },
      {
        title: 'Get RF Logical Address',
        action: 'RF_LOGICADDR_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "RF_LOGICADDR_GET" })
      },
      {
        title: 'Set RF Encryption Key',
        action: 'RF_ENCRYPTKEY_SET',
        needsInput: true,
        placeholder: 'Enter Encryption Key (e.g., 123456789ABCDEF0)',
        validate: (value) => /^[0-9A-Fa-f]+$/.test(value),
        errorMessage: 'Invalid input. Only hexadecimal characters allowed.',
        onSend: (value) => JSON.stringify({ cmd: "RF_ENCRYPTKEY_SET", args: [value] })
      },
      {
        title: 'Get RF Encryption Key',
        action: 'RF_ENCRYPTKEY_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "RF_ENCRYPTKEY_GET" })
      },
      {
        title: 'Set RF Sync Word',
        action: 'SYNC_WORD_SET',
        needsInput: true,
        placeholder: 'Enter Sync Word (e.g., 0001)',
        validate: (value) => /^[0-9A-Fa-f]+$/.test(value),
        errorMessage: 'Invalid input. Only hexadecimal characters allowed.',
        onSend: (value) => JSON.stringify({ cmd: "SYNC_WORD_SET", args: [value] })
      },
      {
        title: 'Get RF Sync Word',
        action: 'SYNC_WORD_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "SYNC_WORD_GET" })
      },
      
      {
        title: 'Get RF Chip ID',
        action: 'RF_CHIP_ID_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "RF_CHIP_ID_GET" })
      },
      {
        title: 'Set RF Baudrate',
        action: 'RF_BAUDRATE_SET',
        needsInput: true,
        placeholder: 'Enter Baudrate (e.g., 9600)',
        validate: (value) => /^[0-9]+$/.test(value),
        errorMessage: 'Invalid input. Only numeric values allowed.',
        onSend: (value) => JSON.stringify({ cmd: "RF_BAUDRATE_SET", args: [parseInt(value, 10)] })
      },
      {
        title: 'Get RF Baudrate',
        action: 'RF_BAUDRATE_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "RF_BAUDRATE_GET" })
      }
    ];

    const rfirbuttons = [
      {
        title: 'Set IR Logical Address',
        action: 'IR_LOGICADDR_SET',
        needsInput: true,
        placeholder: 'Enter IR Logical Address (e.g., 1)',
        validate: (value) => /^[0-9]+$/.test(value),
        errorMessage: 'Invalid input. Only numeric values allowed.',
        onSend: (value) => JSON.stringify({ cmd: "IR_LOGICADDR_SET", args: [parseInt(value, 10)] })
      },
      {
        title: 'Get IR Logical Address',
        action: 'IR_LOGICADDR_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "IR_LOGICADDR_GET" })
      }
    ];

    const rfrlbuttons = [
    {
      title: 'Get No. of Relays',
      action: 'RELAY_COUNT_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RELAY_COUNT_GET" })
    },
    {
      title: 'Get No. of Keys',
      action: 'KEY_COUNT_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "KEY_COUNT_GET" })
    },
    {
      title: 'Set Momentary Timeout',
      action: 'MOMENTARY_TIMEOUT_SET',
      needsInput: true,
      placeholder: 'Enter Timeout (e.g., 20)',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => JSON.stringify({
        cmd: "MOMENTARY_TIMEOUT_SET",
        args: [parseInt(value, 10)]
      })
    },
    {
      title: 'Get Momentary Timeout',
      action: 'MOMENTARY_TIMEOUT_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "MOMENTARY_TIMEOUT_GET" })
    },
    {
      title: 'Set Key Value',
      action: 'KEY_VALUE_SET',
      needsInput: true,
      placeholder: 'Enter Key Index and Value (dropdowns used)',
      onSend: () => JSON.stringify({
        cmd: "KEY_VALUE_SET",
        args: [{ idx: Number(inputKeyIndex), value: Number(inputKeyValue) }]
      })
    },
    {
      title: 'Get Key Value',
      action: 'KEY_VALUE_GET',
      needsInput: true,
      placeholder: 'Enter Key Index (e.g., 1)',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => JSON.stringify({
        cmd: "KEY_VALUE_GET",
        args: [{ idx: parseInt(value, 10) }]
      })
    },
    // {
    //   title: 'Set Mode Value',
    //   action: 'MODE_VALUE_SET',
    //   needsInput: true,
    //   placeholder: 'Enter Mode Index and Mode (dropdowns used)',
    //   onSend: () => {
    //     console.log("Current values:", inputKeyIndex, inputKeyValue);
    //     return JSON.stringify({
    //         cmd: "MODE_VALUE_SET",
    //         args: [{
    //             idx: Number(inputKeyIndex),
    //             value: Number(inputKeyValue)
    //         }]
    //     });
    // }
    // },
    {
      title: 'Get Mode Value',
      action: 'MODE_VALUE_GET',
      needsInput: true,
      placeholder: 'Enter Mode Index (e.g., 1)',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: () => {
        console.log("Index:", inputKeyIndex, "Value:", inputKeyValue);
        return JSON.stringify({
            cmd: "MODE_VALUE_SET",
            args: [{
                idx: Number(inputKeyIndex),
                value: Number(inputKeyValue)
            }]
        })
    }
    },
    {
      title: 'Set Ontime Delay',
      action: 'ONTIME_DELAY_SET',
      needsInput: true,
      placeholder: 'Enter Ontime Delay Index and Value (dropdowns used)',
      onSend: () => JSON.stringify({
        cmd: "ONTIME_DELAY_SET",
        args: [{ idx: Number(inputKeyIndex), value: Number(inputKeyValue) }]
      })
    },
    {
      title: 'Get Ontime Delay',
      action: 'ONTIME_DELAY_GET',
      needsInput: true,
      placeholder: 'Enter Delay Index (e.g., 1)',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => JSON.stringify({
        cmd: "ONTIME_DELAY_GET",
        args: [{ idx: parseInt(value, 10) }]
      })
    },
    {
      title: 'Set Offtime Delay',
      action: 'OFFTIME_DELAY_SET',
      needsInput: true,
      placeholder: 'Enter Offtime Delay Index and Value (dropdowns used)',
      onSend: () => JSON.stringify({
        cmd: "OFFTIME_DELAY_SET",
        args: [{ idx: Number(inputKeyIndex), value: Number(inputKeyValue) }]
      })
    },
    {
      title: 'Get Offtime Delay',
      action: 'OFFTIME_DELAY_GET',
      needsInput: true,
      placeholder: 'Enter Delay Index (e.g., 1)',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => JSON.stringify({
        cmd: "OFFTIME_DELAY_GET",
        args: [{ idx: parseInt(value, 10) }]
      })
    },
    {
      title: 'Set Interlock Value',
      action: 'INTERLOCK_VALUE_SET',
      needsInput: true,
      placeholder: 'Enter Interlock Index and Value (dropdowns used)',
      onSend: () => JSON.stringify({
        cmd: "INTERLOCK_VALUE_SET",
        args: [{ idx: Number(inputKeyIndex), value: Number(inputKeyValue) }]
      })
    },
    {
      title: 'Get Interlock Value',
      action: 'INTERLOCK_VALUE_GET',
      needsInput: true,
      placeholder: 'Enter Interlock Index (e.g., 1)',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => JSON.stringify({
        cmd: "INTERLOCK_VALUE_GET",
        args: [{ idx: parseInt(value, 10) }]
      })
    },
    {
      title: 'Set Relay Number',
      action: 'RELAY_NUMBER_SET',
      needsInput: true,
      placeholder: 'Enter Relay Index and Value (dropdowns used)',
      onSend: () => JSON.stringify({
        cmd: "RELAY_NUMBER_SET",
        args: [{ idx: Number(inputKeyIndex), value: Number(inputKeyValue) }]
      })
    },
    {
      title: 'Get Relay Number',
      action: 'RELAY_NUMBER_GET',
      needsInput: true,
      placeholder: 'Enter Relay Index (e.g., 1)',
      validate: (value) => /^[0-9]+$/.test(value),
      errorMessage: 'Invalid input. Only numeric values allowed.',
      onSend: (value) => JSON.stringify({
        cmd: "RELAY_NUMBER_GET",
        args: [{ idx: parseInt(value, 10) }]
      })
    }
  ];

  //LRM3 BUTTONS CONFIGURATIONS 
  const lrmrlbuttons = [
    {
      title: 'Get Relay Timeout',
      action: 'RELAY_TIMEOUT_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RELAY_TIMEOUT_GET" })
    },
    {
      title: 'Set Relay Timeout',
      action: 'RELAY_TIMEOUT_SET',
      needsInput: true,
      placeholder: 'Enter Timeout (1-65535)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 1 && value <= 65535,
      errorMessage: 'Invalid input. Enter a number between 1-65535.',
      onSend: (value) => JSON.stringify({ cmd: "RELAY_TIMEOUT_SET", args: [parseInt(value, 10)] })
    }
  ];

    const lrmrfbuttons = [
      {
        title: 'Get RF Device Type',
        action: 'RF_DEV_TYPE_GET',
        needsInput: false,
        onSend: () => JSON.stringify({ cmd: "RF_DEV_TYPE_GET" })
      }, 
    {
      title: 'Get RF Bandwidth',
      action: 'RF_BANDWIDTH_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_BANDWIDTH_GET" })
    },
    {
      title: 'Set RF Bandwidth',
      action: 'RF_BANDWIDTH_SET',
      needsInput: true,
      placeholder: 'Enter Bandwidth value (0-10)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 0 && value <= 10,
      errorMessage: 'Invalid input. Enter a number between 0-10.',
      onSend: (value) => JSON.stringify({ cmd: "RF_BANDWIDTH_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get Spread Factor',
      action: 'SPREAD_FACTOR_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "SPREAD_FACTOR_GET" })
    },
    {
      title: 'Set Spread Factor',
      action: 'SPREAD_FACTOR_SET',
      needsInput: true,
      placeholder: 'Enter SF value (5-12)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 5 && value <= 12,
      errorMessage: 'Invalid input. Enter a number between 5-12.',
      onSend: (value) => JSON.stringify({ cmd: "SPREAD_FACTOR_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get Code Rate',
      action: 'CODE_RATE_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "CODE_RATE_GET" })
    },
    {
      title: 'Set Code Rate',
      action: 'CODE_RATE_SET',
      needsInput: true,
      placeholder: 'Enter CR value (1-4)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 1 && value <= 4,
      errorMessage: 'Invalid input. Enter a number between 1-4.',
      onSend: (value) => JSON.stringify({ cmd: "CODE_RATE_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get RF Transmission Power',
      action: 'RF_TRANSMISSION_POWER_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_TRANSMISSION_POWER_GET" })
    },
    {
      title: 'Set RF Transmission Power',
      action: 'RF_TRANSMISSION_POWER_SET',
      needsInput: true,
      placeholder: 'Enter Power (e.g., 1-22)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 1 && value <= 22,
      errorMessage: 'Invalid input. Enter a number between 1-22.',
      onSend: (value) => JSON.stringify({ cmd: "RF_TRANSMISSION_POWER_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get RF Sync Word',
      action: 'SYNC_WORD_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "SYNC_WORD_GET" })
    },
    {
      title: 'Set RF Sync Word',
      action: 'SYNC_WORD_SET',
      needsInput: true,
      placeholder: 'Enter Sync Word (e.g.0000)',
      validate: (value) => /^[0-9]{4}$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 65535,
      errorMessage: 'Invalid input. Enter 4 digits between 0001-65535.',
      onSend: (value) => JSON.stringify({ cmd: "SYNC_WORD_SET", args: [value] })
    },
    {
      title: 'Get RF Frequency',
      action: 'RF_FREQ_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_FREQ_GET" })
    },
    {
      title: 'Set RF Frequency',
      action: 'RF_FREQ_SET',
      needsInput: true,
      placeholder: 'Enter Frequency (e.g. 869775000)',
      validate: (value) => /^[0-9]+$/.test(value) && parseInt(value, 10) > 0,
      errorMessage: 'Invalid input. Enter a positive frequency value.',
      onSend: (value) => JSON.stringify({ cmd: "RF_FREQ_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get Logical Address',
      action: 'RF_LOGICADDR_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_LOGICADDR_GET" })
    },
    {
      title: 'Set Logical Address',
      action: 'RF_LOGICADDR_SET',
      needsInput: true,
      placeholder: 'Enter Address (0-255)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 0 && value <= 255,
      errorMessage: 'Invalid input. Enter a number between 0-255.',
      onSend: (value) => JSON.stringify({ cmd: "RF_LOGICADDR_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get Preamble Length',
      action: 'PREAMBLE_LENGTH_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "PREAMBLE_LENGTH_GET" })
    },
    {
      title: 'Set Preamble Length',
      action: 'PREAMBLE_LENGTH_SET',
      needsInput: true,
      placeholder: 'Enter Length (1-255)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 1 && value <= 255,
      errorMessage: 'Invalid input. Enter a number between 1-255.',
      onSend: (value) => JSON.stringify({ cmd: "PREAMBLE_LENGTH_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get Payload Length',
      action: 'PAYLOAD_LENGTH_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "PAYLOAD_LENGTH_GET" })
    },
    {
      title: 'Set Payload Length',
      action: 'PAYLOAD_LENGTH_SET',
      needsInput: true,
      placeholder: 'Enter Length (1-255)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 1 && value <= 255,
      errorMessage: 'Invalid input. Enter a number between 1-255.',
      onSend: (value) => JSON.stringify({ cmd: "PAYLOAD_LENGTH_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get CRC Control',
      action: 'CRC_CONTROL_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "CRC_CONTROL_GET" })
    },
    {
      title: 'Set CRC Control',
      action: 'CRC_CONTROL_SET',
      needsInput: true,
      placeholder: 'Enter 0 (disable) or 1 (enable)',
      validate: (value) => /^[01]$/.test(value),
      errorMessage: 'Invalid input. Enter 0 or 1.',
      onSend: (value) => JSON.stringify({ cmd: "CRC_CONTROL_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'Get RF Firmware Version',
      action: 'RF_FIRMWARE_VERSION_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_FIRMWARE_VERSION_GET" })
    },
    {
      title: 'Get RF Relay Timeout',
      action: 'RF_RELAY_TIMEOUT_GET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_RELAY_TIMEOUT_GET" })
    },
    {
      title: 'Set RF Relay Timeout',
      action: 'RF_RELAY_TIMEOUT_SET',
      needsInput: true,
      placeholder: 'Enter Timeout (1-65535)',
      validate: (value) => /^[0-9]+$/.test(value) && value >= 1 && value <= 65535,
      errorMessage: 'Invalid input. Enter a number between 1-65535.',
      onSend: (value) => JSON.stringify({ cmd: "RF_RELAY_TIMEOUT_SET", args: [parseInt(value, 10)] })
    },
    {
      title: 'RF Reset',
      action: 'RF_RESET',
      needsInput: false,
      onSend: () => JSON.stringify({ cmd: "RF_RESET" })
    }
  ];

  ///////////////////////////BUTTON CONFIGURATION ENDS////////////////////////////

  //BUTTON PRESS 
  const handleButtonPress = (buttonConfig) => {
    setCurrentAction(buttonConfig);
    setInputValue('');
    setInputKeyIndex('');
    setInputKeyValue('');
    
    if (buttonConfig.needsInput) {
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

    //CONTAINERS FOR BUTTONS
    return (
      <>
        <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
          {/* Top Row Container */}
          <View style={styles.topRowContainer}>
            <View style={styles.topButtonWrapper}>
              <TouchableOpacity
                style={styles.topButton}
                onPress={() => handleButtonPress(cbuttons[0])}
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
    
          {/* GENERAL Configurations Container */}
          <View style={styles.productConfigContainer}>
            <Text style={styles.sectionTitle}>Device Configurations</Text>
            <ScrollView nestedScrollEnabled style={styles.innerScroll}>
              {cbuttons.slice(1).map((button, index) => (
                <View key={button.title}>
                  <TouchableOpacity
                    style={styles.productConfigItem}
                    onPress={() => handleButtonPress(button)}
                  >
                    <Text style={styles.productConfigItemText} numberOfLines={1}>
                      {button.title}
                    </Text>
                    <Text style={styles.arrow}>›</Text>
                  </TouchableOpacity>
                  {index < cbuttons.slice(1).length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </ScrollView>
          </View>
    
           {deviceName === "IR/RF" && ( 
            <>
              {/* RF PRODUCTION Configurations Container */}
              <View style={styles.configContainer}>
                <Text style={styles.sectionTitle}>RF Configurations</Text>
                <ScrollView nestedScrollEnabled style={styles.innerScroll}>
                  {rfbuttons.map((button, index) => (
                    <View key={button.title}>
                      <TouchableOpacity
                        style={styles.configItem}
                        onPress={() => handleButtonPress(button)}
                      >
                        <Text style={styles.configItemText} numberOfLines={1}>
                          {button.title}
                        </Text>
                        <Text style={styles.arrow}>›</Text>
                      </TouchableOpacity>
                      {index < rfbuttons.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
                </ScrollView>
              </View>
    
              {/* RF PRODUCT IR Configurations Container */}
              <View style={styles.irConfigContainer}>
                <Text style={styles.sectionTitle}>IR Configurations</Text>
                <ScrollView nestedScrollEnabled style={styles.innerScroll}>
                  {rfirbuttons.map((button, index) => (
                    <View key={button.title}>
                      <TouchableOpacity
                        style={styles.irConfigItem}
                        onPress={() => handleButtonPress(button)}
                      >
                        <Text style={styles.irConfigItemText} numberOfLines={1}>
                          {button.title}
                        </Text>
                        <Text style={styles.arrow}>›</Text>
                      </TouchableOpacity>
                      {index < rfirbuttons.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
                </ScrollView>
              </View>
    
              {/* RF PRODUCT Relay Configurations Container */}
              <View style={styles.rlConfigContainer}>
                <Text style={styles.sectionTitle}>RF Relay Configurations</Text>
                <ScrollView nestedScrollEnabled style={styles.innerScroll}>
                  {rfrlbuttons.map((button, index) => (
                    <View key={button.title}>
                      <TouchableOpacity
                        style={styles.rlConfigItem}
                        onPress={() => handleButtonPress(button)}
                      >
                        <Text style={styles.rlConfigItemText} numberOfLines={1}>
                          {button.title}
                        </Text>
                        <Text style={styles.arrow}>›</Text>
                      </TouchableOpacity>
                      {index < rfrlbuttons.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          )} 
    
          {deviceName === "LRM3" && (
            <>
              {/* LRM3 PRODUCT RELAY CONFIGURATION Container */}
              <View style={styles.lrm3RlConfigContainer}>
                <Text style={styles.sectionTitle}>LRM3 Relay Configuration</Text>
                <ScrollView nestedScrollEnabled style={styles.innerScroll}>
                  {lrmrlbuttons.map((button, index) => (
                    <View key={button.title}>
                      <TouchableOpacity
                        style={styles.rlConfigItem}
                        onPress={() => handleButtonPress(button)}
                      >
                        <Text style={styles.rlConfigItemText} numberOfLines={1}>
                          {button.title}
                        </Text>
                        <Text style={styles.arrow}>›</Text>
                      </TouchableOpacity>
                      {index < lrmrlbuttons.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
                </ScrollView>
              </View>
    
              {/* LRM3 RF CONFIGURATION Container */}
              <View style={styles.lrm3RfConfigContainer}>
                <Text style={styles.sectionTitle}>LRM3 RF Configuration</Text>
                <ScrollView nestedScrollEnabled style={styles.innerScroll}>
                  {lrmrfbuttons.map((button, index) => (
                    <View key={button.title}>
                      <TouchableOpacity
                        style={styles.configItem}
                        onPress={() => handleButtonPress(button)}
                      >
                        <Text style={styles.configItemText} numberOfLines={1}>
                          {button.title}
                        </Text>
                        <Text style={styles.arrow}>›</Text>
                      </TouchableOpacity>
                      {index < lrmrfbuttons.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </ScrollView>

  {/* MODAL */}
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{currentAction?.title}</Text>


        {/*----------- Modal of CButtons -----------*/}
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

        /*----------- Modal of RFButtons -----------*/

        ) : currentAction?.title === 'Set RF Channel' ? (
          <Picker
            selectedValue={inputValue}
            onValueChange={(itemValue) => setInputValue(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            dropdownIconColor="#888"
          >
            <Picker.Item label="-- Select --" value="" />
            {[1, 2, 3, 4].map((ch) => (
              <Picker.Item key={ch} label={`${ch}`} value={`${ch}`} />
            ))}
          </Picker>
        ) : currentAction?.title === 'Get Key Value' ? (
          <View style={styles.input}>
            <Text>Enter Key Index</Text>
            <Picker
              selectedValue={inputValue}
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor="#888"
            >
              <Picker.Item label="-- Select --" value="" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
          </View>
        ) : currentAction?.title === 'Set Key Value' ? (
          <>
            <View style={styles.input}>
              <Text>Enter Key Index</Text>
              <Picker
                selectedValue={inputKeyIndex}
                onValueChange={(itemValue) => setInputKeyIndex(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter Key Value (e.g., 2)"
              value={inputKeyValue}
              onChangeText={setInputKeyValue}
              keyboardType="numeric"
            />
          </>
        ) : currentAction?.title === 'Get Mode Value' ? (
          <View style={styles.input}>
            <Text>Enter Mode Index</Text>
            <Picker
              selectedValue={inputValue}
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor="#888"
            >
              <Picker.Item label="-- Select --" value="" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
          </View>
        ) : currentAction?.title === 'Set Mode Value' ? (
          <>
            <View style={styles.input}>
              <Text>Enter Mode Index</Text>
              <Picker
                selectedValue={inputKeyIndex}
                onValueChange={(itemValue) => setInputKeyIndex(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                ))}
              </Picker>
            </View>
            <View style={styles.input}>
              <Text>Enter Mode</Text>
              <Picker
                selectedValue={inputKeyValue}
                onValueChange={(itemValue) => setInputKeyValue(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {modeOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </>
        ) : currentAction?.title?.includes('Ontime Delay') && currentAction?.title?.includes('Set') ? (
          <>
            <View style={styles.input}>
              <Text>Enter Ontime Delay Index</Text>
              <Picker
                selectedValue={inputKeyIndex}
                onValueChange={(itemValue) => setInputKeyIndex(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                ))}
              </Picker>
            </View>
            <View style={styles.input}>
              <Text>Set Ontime Delay Value</Text>
              <Picker
                selectedValue={inputKeyValue}
                onValueChange={(itemValue) => setInputKeyValue(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <Picker.Item key={v} label={`${v}`} value={`${v}`} />
                ))}
              </Picker>
            </View>
          </>
        ) : currentAction?.title?.includes('Ontime Delay') && currentAction?.title?.includes('Get') ? (
          <View style={styles.input}>
            <Text>Enter Ontime Delay Index</Text>
            <Picker
              selectedValue={inputValue}
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor="#888"
            >
              <Picker.Item label="-- Select --" value="" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
          </View>
        ) : currentAction?.title?.includes('Offtime Delay') && currentAction?.title?.includes('Set') ? (
          <>
            <View style={styles.input}>
              <Text>Enter Offtime Delay Index</Text>
              <Picker
                selectedValue={inputKeyIndex}
                onValueChange={(itemValue) => setInputKeyIndex(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                ))}
              </Picker>
            </View>
            <View style={styles.input}>
              <Text>Set Offtime Delay Value</Text>
              <Picker
                selectedValue={inputKeyValue}
                onValueChange={(itemValue) => setInputKeyValue(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <Picker.Item key={v} label={`${v}`} value={`${v}`} />
                ))}
              </Picker>
            </View>
          </>
        ) : currentAction?.title?.includes('Offtime Delay') && currentAction?.title?.includes('Get') ? (
          <View style={styles.input}>
            <Text>Enter Offtime Delay Index</Text>
            <Picker
              selectedValue={inputValue}
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor="#888"
            >
              <Picker.Item label="-- Select --" value="" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
          </View>
        ) : currentAction?.title === 'Get Interlock Value' ? (
          <View style={styles.input}>
            <Text>Enter Interlock Index</Text>
            <Picker
              selectedValue={inputValue}
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor="#888"
            >
              <Picker.Item label="-- Select --" value="" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
          </View>
        ) : currentAction?.title === 'Set Interlock Value' ? (
          <>
            <View style={styles.input}>
              <Text>Enter Interlock Index</Text>
              <Picker
                selectedValue={inputKeyIndex}
                onValueChange={(itemValue) => setInputKeyIndex(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                ))}
              </Picker>
            </View>
            <View style={styles.input}>
              <Text>Set Interlock Value</Text>
              <Picker
                selectedValue={inputKeyValue}
                onValueChange={(itemValue) => setInputKeyValue(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <Picker.Item key={v} label={`${v}`} value={`${v}`} />
                ))}
              </Picker>
            </View>
          </>
        ) : currentAction?.title === 'Get Relay Number' ? (
          <View style={styles.input}>
            <Text>Enter Relay Index</Text>
            <Picker
              selectedValue={inputValue}
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor="#888"
            >
              <Picker.Item label="-- Select --" value="" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
          </View>
        ) : currentAction?.title === 'Set Relay Number' ? (
          <>
            <View style={styles.input}>
              <Text>Enter Relay Index</Text>
              <Picker
                selectedValue={inputKeyIndex}
                onValueChange={(itemValue) => setInputKeyIndex(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Picker.Item key={i} label={`${i}`} value={`${i}`} />
                ))}
              </Picker>
            </View>
           
            <View style={styles.input}>
              <Text>Set Relay Value</Text>
              <Picker
                selectedValue={inputKeyValue}
                onValueChange={(itemValue) => setInputKeyValue(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#888"
              >
                <Picker.Item label="-- Select --" value="" />
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <Picker.Item key={v} label={`${v}`} value={`${v}`} />
                ))}
              </Picker>
            </View>
          </> 
          
          /*----------- Modal of LRM3Buttons -----------*/
        ) : currentAction?.title === 'Set RF Bandwidth' ? (
          <View style={styles.input}>
            <Text>Select RF Bandwidth</Text>
            <Picker
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="7.8 kHz" value={0} />
              <Picker.Item label="10.4 kHz" value={8} />
              <Picker.Item label="15.6 kHz" value={1} />
              <Picker.Item label="20.8 kHz" value={9} />
              <Picker.Item label="31.25 kHz" value={2} />
              <Picker.Item label="41.7 kHz" value={10} />
              <Picker.Item label="62.5 kHz" value={3} />
              <Picker.Item label="125 kHz" value={4} />
              <Picker.Item label="250 kHz" value={5} />
              <Picker.Item label="500 kHz" value={6} />
            </Picker>
          </View>
        ) : currentAction?.title === 'Set Spread Factor' ? (
          <View style={styles.input}>
            <Text>Select Spread Factor</Text>
            <Picker
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="5" value={5} />
              <Picker.Item label="6" value={6} />
              <Picker.Item label="7" value={7} />
              <Picker.Item label="8" value={8} />
              <Picker.Item label="9" value={9} />
              <Picker.Item label="10" value={10} />
              <Picker.Item label="11" value={11} />
              <Picker.Item label="12" value={12} />
            </Picker>
          </View>
        ) : currentAction?.title === 'Set Code Rate' ? (
          <View style={styles.input}>
            <Text>Select Code Rate</Text>
            <Picker
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="4/5" value={1} />
              <Picker.Item label="4/6" value={2} />
              <Picker.Item label="4/7" value={3} />
              <Picker.Item label="4/8" value={4} />
            </Picker>
          </View>
        ) : currentAction?.title === 'Set CRC Control' ? (
          <View style={styles.input}>
            <Text>Select CRC Control</Text>
            <Picker
              onValueChange={(itemValue) => setInputValue(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Disable" value={0} />
              <Picker.Item label="Enable" value={1} />
            </Picker>
          </View>
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

  //STYLES
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
        height: 60,
      },
      topButtonWrapper: {
        flex: 0.4,
        paddingRight: 10,
      },
      deviceInfoWrapper: {
        flex: 0.6,
      },
      topButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: 160,
      },
      topButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
      },
      deviceInfoContainer: {
        backgroundColor: '#F28C28',
        paddingVertical: 14,         
        paddingHorizontal: 16,       
        borderRadius: 16,            
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 5,                
        maxWidth: '95%',             
        alignSelf: 'flex-end',
        marginTop: 4,    
      },
      deviceInfoText: {
        fontSize: 16,                
        fontWeight: 'bold',
        color: '#000',
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
        height: 300, 
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
        height: 300, 
      },
      irConfigContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        height: 160, 
      },
      rlConfigContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        height: 300, 
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 16,
        paddingBottom: 8,
        color: '#333',
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
        paddingVertical: 10,
        paddingHorizontal: 16,
        height: 50,
      },
      irConfigItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        height: 50,
      },
      rlConfigItem: {
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
      irConfigItemText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        marginRight: 10,
      },
      rlConfigItemText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        marginRight: 10,
      },
      lrm3RlConfigContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        height: 160, 
      },
      lrm3RfConfigContainer: 
      {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        height: 300, 
      },
      lrm3RlConfigItem: 
      {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        height: 50,
      },
      
      lrm3RfConfigItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        height: 50,
      },

      lrm3RlConfigItemText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        marginRight: 10,
      },
      lrm3RfConfigItemText: 
      {
        fontSize: 15,
        color: '#333',
        flex: 1,
        marginRight: 10,
      },
      innerScroll: {
        flex: 1,
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
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        width: '80%',
        borderRadius: 8,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 12,
        borderRadius: 5,
      },
      picker: {
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        zIndex: 1000,
        height: 50,
        width: '100%',
        justifyContent: 'center',
      },
      
      pickerItem: {
        textAlign: 'center',
        color: '#1C1C1C',
        fontSize: 16,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        paddingVertical: 10,
      },
      dropdownContainer: {
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        zIndex: 1000,
      },
      dropdownItemStyle: {
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
      },
      dropdownLabelStyle: {
        color: '#1C1C1C',
      },
      dropdownSelectedItemStyle: {
        backgroundColor: '#E3F2FD', // faded light blue
      },
      modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      cancelButton: {
        padding: 10,
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
      },
      setButton: {
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '90%',
      },
      scrollContent: {
        paddingBottom: 40,
      },
    });


  export default KeyScreen;