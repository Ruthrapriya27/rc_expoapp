import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { BleManager, State } from 'react-native-ble-plx';
import { BluetoothContext } from '../Context/BluetoothContext';

const manager = new BleManager();

const predefinedUUIDList = [
  {
    name: 'Default UUID',
    service: '0000abf0-0000-1000-8000-00805f9b34fb',
    read: '0000abf2-0000-1000-8000-00805f9b34fb',
    write: '0000abf3-0000-1000-8000-00805f9b34fb',
  },
];

const BluetoothConfigScreen = () => {
  const styles = getStyles();

  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showUuidModal, setShowUuidModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [uuidMode, setUuidMode] = useState('predefined');
  const [selectedPredefinedUUID, setSelectedPredefinedUUID] = useState(predefinedUUIDList[0]);
  const [customUUIDs, setCustomUUIDs] = useState({ service: '', read: '', write: '' });

  const {
    connectedDevice,
    setConnectedDevice,
    setServiceUUID,
    setWriteUUID,
    setReadUUID
  } = useContext(BluetoothContext);

  useEffect(() => {
    requestPermissions();
    return () => {
      manager.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  };

  const scanDevices = async () => {
    const state = await manager.state();
    if (state !== State.PoweredOn) {
      Alert.alert('Please turn on Bluetooth to scan for devices');
      return;
    }

    setIsScanning(true);
    setDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        setIsScanning(false);
        return;
      }
      if (device?.name?.startsWith("SIO-RX-")) {
        setDevices((prev) => {
          const exists = prev.some((d) => d.id === device.id);
          return exists ? prev : [...prev, device];
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const connectToDevice = (device) => {
    setSelectedDevice(device);
    setShowUuidModal(true);
  };

  const connectWithUUIDs = async () => {
    const device = selectedDevice;
    if (!device) return;

    let serviceUUID, writeUUID, readUUID;
    if (uuidMode === 'predefined') {
      serviceUUID = selectedPredefinedUUID.service;
      writeUUID = selectedPredefinedUUID.write;
      readUUID = selectedPredefinedUUID.read;
    } else {
      if (!customUUIDs.service || !customUUIDs.write) {
        console.warn('Custom UUIDs are incomplete');
        return;
      }
      serviceUUID = customUUIDs.service;
      writeUUID = customUUIDs.write;
      readUUID = customUUIDs.read || '';
    }

    try {
      const connected = await manager.connectToDevice(device.id, { autoConnect: false });
      await connected.discoverAllServicesAndCharacteristics();
      await connected.requestMTU(517);
      setConnectedDevice(connected);
      setServiceUUID(serviceUUID);
      setWriteUUID(writeUUID);
      setReadUUID(readUUID);
      setShowUuidModal(false);
    } catch (error) {
      console.log('Connection error:', error.message || error);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      try {
        await manager.cancelDeviceConnection(connectedDevice.id);
        const disconnected = connectedDevice;
        setConnectedDevice(null);
        setDevices((prevDevices) => {
          const exists = prevDevices.some((d) => d.id === disconnected.id);
          if (!exists) {
            return [...prevDevices, disconnected];
          }
          return prevDevices;
        });
        scanDevices();
      } catch (error) {
        console.log('Disconnect error:', error);
      }
    }
  };

  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity onPress={() => connectToDevice(item)} style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button
        title={isScanning ? 'Scanning...' : 'Scan for Devices'}
        onPress={scanDevices}
        disabled={isScanning}
      />

      {connectedDevice && (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedTitle}>Connected Device</Text>
          <Text style={styles.deviceName}>{connectedDevice.name || 'Unnamed Device'}</Text>
          <Text>ID: {connectedDevice.id}</Text>
          <TouchableOpacity onPress={disconnectFromDevice} style={{ marginTop: 10 }}>
            <Text style={{ color: 'red' }}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.deviceListContainer}>
        <Text style={styles.deviceListTitle}>Available Devices</Text>
        <FlatList
          data={devices.filter((d) => d.id !== connectedDevice?.id)}
          keyExtractor={(item) => item.id}
          renderItem={renderDeviceItem}
          style={{ marginTop: 10 }}
        />
      </View>

      <Modal visible={showUuidModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Connect Using</Text>

            <TouchableOpacity onPress={() => setUuidMode('predefined')} style={{ marginBottom: 10 }}>
              <Text style={{ color: uuidMode === 'predefined' ? 'black' : 'gray' }}>• Predefined UUIDs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUuidMode('custom')} style={{ marginBottom: 10 }}>
              <Text style={{ color: uuidMode === 'custom' ? 'black' : 'gray' }}>• Custom UUIDs</Text>
            </TouchableOpacity>

            {uuidMode === 'predefined' && (
              <ScrollView style={{ maxHeight: 150 }}>
                {predefinedUUIDList.map((uuid, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedPredefinedUUID(uuid)}
                    style={{
                      padding: 8,
                      borderWidth: selectedPredefinedUUID.name === uuid.name ? 2 : 1,
                      borderColor: '#888',
                      marginBottom: 5,
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>{uuid.name}</Text>
                    <Text>Service: {uuid.service}</Text>
                    <Text>Read: {uuid.read}</Text>
                    <Text>Write: {uuid.write}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {uuidMode === 'custom' && (
              <ScrollView style={{ marginTop: 10 }}>
                <Text>Service UUID:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter service UUID"
                  value={customUUIDs.service}
                  onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, service: text })}
                />
                <Text>Read Characteristic UUID:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter read UUID"
                  value={customUUIDs.read}
                  onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, read: text })}
                />
                <Text>Write Characteristic UUID:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter write UUID"
                  value={customUUIDs.write}
                  onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, write: text })}
                />
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setShowUuidModal(false)} />
              <Button
                title="Connect"
                onPress={connectWithUUIDs}
                disabled={uuidMode === 'custom' && (!customUUIDs.service || !customUUIDs.write)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: 'white',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    connectedContainer: {
      borderRadius: 8,
      padding: 16,
      marginTop: 20,
      backgroundColor: '#FFFFFF',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    connectedTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    deviceListContainer: {
      borderRadius: 8,
      padding: 16,
      marginTop: 20,
      flex: 1,
      backgroundColor: 'white',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    deviceListTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    deviceItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    deviceName: {
      fontWeight: '500',
    },
    deviceId: {
      fontSize: 12,
      color: '#555',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      maxHeight: '90%',
      elevation: 5,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      padding: 8,
      marginBottom: 10,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
  });

export default BluetoothConfigScreen;
