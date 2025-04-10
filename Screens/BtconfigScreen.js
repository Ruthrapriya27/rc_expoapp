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
} 
from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
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

  const scanDevices = () => {
    setIsScanning(true);
    setDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        setIsScanning(false);
        return;
      }
      if (device && device.name) {
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

      const services = await connected.services();
      for (const svc of services) {
        const chars = await connected.characteristicsForService(svc.uuid);
        chars.forEach((c) => {
          console.log(`Characteristic: ${c.uuid}, Writable: ${c.isWritableWithResponse}`);
        });
      }

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
    <TouchableOpacity
      onPress={() => connectToDevice(item)}
      style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}
    >
      <Text style={{ fontWeight: '500' }}>{item.name}</Text>
      <Text style={{ fontSize: 12, color: '#555' }}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {connectedDevice && (
        <View style={{ borderWidth: 1, borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Connected Device</Text>
          <Text style={{ marginTop: 6 }}>{connectedDevice.name || 'Unnamed Device'}</Text>
          <Text>ID: {connectedDevice.id}</Text>
          <TouchableOpacity onPress={disconnectFromDevice} style={{ marginTop: 10 }}>
            <Text style={{ color: 'red' }}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}

      <Button
        title={isScanning ? 'Scanning...' : 'Scan for Devices'}
        onPress={scanDevices}
        disabled={isScanning}
      />

      <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 16 }}>Available Devices</Text>
      <FlatList
        data={devices.filter((d) => d.id !== connectedDevice?.id)}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
        style={{ marginTop: 10 }}
      />

      <Modal visible={showUuidModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '90%' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Connect Using</Text>

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
                  style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
                  placeholder="Enter service UUID"
                  value={customUUIDs.service}
                  onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, service: text })}
                />
                <Text>Read Characteristic UUID:</Text>
                <TextInput
                  style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
                  placeholder="Enter read UUID"
                  value={customUUIDs.read}
                  onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, read: text })}
                />
                <Text>Write Characteristic UUID:</Text>
                <TextInput
                  style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
                  placeholder="Enter write UUID"
                  value={customUUIDs.write}
                  onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, write: text })}
                />
              </ScrollView>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
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

export default BluetoothConfigScreen;
