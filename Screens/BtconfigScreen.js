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
  ActivityIndicator,
  Image
} from 'react-native';
import { BleManager, State } from 'react-native-ble-plx';
import { BluetoothContext } from '../Context/BluetoothContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  const 
  {
    connectedDevice,
    setConnectedDevice,
    setServiceUUID,
    setWriteUUID,
    setReadUUID
  } = useContext(BluetoothContext);

  useEffect(() => 
    {
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

  const scanDevices = async () => 
    {
    const state = await manager.state();
    if (state !== State.PoweredOn) {
      Alert.alert('Bluetooth Required', 'Please turn on Bluetooth to scan for devices');
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
<<<<<<< HEAD
=======
      
>>>>>>> development
      if (device?.name?.startsWith("SIO-RX-")) {
        setDevices((prev) => {
          const exists = prev.some((d) => d.id === device.id);
          return exists ? prev : [...prev, device];
        });
      }
    });

    setTimeout(() => 
    {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const connectToDevice = (device) => 
    {
    setSelectedDevice(device);
    setShowUuidModal(true);
  };

  const connectWithUUIDs = async () => {
    const device = selectedDevice;
    if (!device) return;

    let serviceUUID, writeUUID, readUUID;
    if (uuidMode === 'predefined') 
    {
      serviceUUID = selectedPredefinedUUID.service;
      writeUUID = selectedPredefinedUUID.write;
      readUUID = selectedPredefinedUUID.read;
<<<<<<< HEAD
    } else {
      if (!customUUIDs.service || !customUUIDs.write) {
        Alert.alert('Incomplete UUIDs', 'Please provide at least Service and Write UUIDs');
=======
    } 
    else 
    {
      if (!customUUIDs.service || !customUUIDs.write) 
      {
        console.warn('Custom UUIDs are incomplete');
>>>>>>> development
        return;
      }
      serviceUUID = customUUIDs.service;
      writeUUID = customUUIDs.write;
      readUUID = customUUIDs.read || '';
    }

<<<<<<< HEAD
    try {
      setShowUuidModal(false);
=======
    try 
    {
>>>>>>> development
      const connected = await manager.connectToDevice(device.id, { autoConnect: false });
      await connected.discoverAllServicesAndCharacteristics();
      await connected.requestMTU(512);
      setConnectedDevice(connected);
      setServiceUUID(serviceUUID);
      setWriteUUID(writeUUID);
      setReadUUID(readUUID);
      Alert.alert('Connected', `Successfully connected to ${device.name}`);
    } catch (error) {
      console.log('Connection error:', error.message || error);
      Alert.alert('Connection Failed', error.message || 'Failed to connect to device');
    }
  };

  const disconnectFromDevice = async () => 
    {
    if (connectedDevice) 
      {
      try 
      {
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
        Alert.alert('Disconnected', `Disconnected from ${disconnected.name}`);
        scanDevices();
      } 
      catch (error) 
      {
        console.log('Disconnect error:', error);
        Alert.alert('Error', 'Failed to disconnect from device');
      }
    }
  };

<<<<<<< HEAD
  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => connectToDevice(item)} 
      style={[
        styles.deviceItem,
        connectedDevice?.id === item.id && styles.connectedDeviceItem
      ]}
    >
      <View style={styles.deviceIconContainer}>
        <Icon name="bluetooth" size={24} color="#6200ee" />
      </View>
      <View style={styles.deviceInfoContainer}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceId}>{item.id}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#888" />
=======
  const renderDeviceItem = ({ item }) => 
    (
    <TouchableOpacity onPress={() => connectToDevice(item)} style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
>>>>>>> development
    </TouchableOpacity>
    );

<<<<<<< HEAD
  return (
    <View style={styles.container}>
=======
    return (
      <View style={styles.container}>
         <TouchableOpacity 
      onPress={scanDevices}
      disabled={isScanning}
      style={[
        styles.scanButton,
        isScanning && styles.scanButtonDisabled
      ]}
    >
      <Text style={styles.scanButtonText}>
        {isScanning ? 'Scanning...' : 'Scan for Devices'}
      </Text>
    </TouchableOpacity>
>>>>>>> development

      <View style={styles.content}>
        <TouchableOpacity 
          onPress={scanDevices} 
          disabled={isScanning}
          style={styles.scanButton}
        >
          {isScanning ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.scanButtonText}>
              Scan for Devices
            </Text>
          )}
        </TouchableOpacity>

        {connectedDevice && (
          <View style={styles.connectedContainer}>
            <View style={styles.connectedHeader}>
              <Icon name="bluetooth-connected" size={24} color="#4CAF50" />
              <Text style={styles.connectedTitle}>Connected Device</Text>
            </View>
            <View style={styles.connectedDeviceInfo}>
              <Text style={styles.connectedDeviceName}>{connectedDevice.name || 'Unnamed Device'}</Text>
              <Text style={styles.connectedDeviceId}>{connectedDevice.id}</Text>
            </View>
            <TouchableOpacity 
              onPress={disconnectFromDevice} 
              style={styles.disconnectButton}
            >
              <Text style={styles.disconnectButtonText}>
                <Icon name="link-off" size={16} color="white" /> Disconnect
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.deviceListContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.deviceListTitle}>Available Devices</Text>
            <Text style={styles.deviceCount}>{devices.filter(d => d.id !== connectedDevice?.id).length} found</Text>
          </View>
          
          {devices.filter(d => d.id !== connectedDevice?.id).length > 0 ? (
            <FlatList
              data={devices.filter((d) => d.id !== connectedDevice?.id)}
              keyExtractor={(item) => item.id}
              renderItem={renderDeviceItem}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="bluetooth-disabled" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No devices found</Text>
              <Text style={styles.emptyStateSubtext}>Press scan to search for devices</Text>
            </View>
          )}
        </View>
      </View>

      <Modal visible={showUuidModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
<<<<<<< HEAD
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Connection Settings</Text>
              <TouchableOpacity onPress={() => setShowUuidModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Select UUID Mode</Text>
            <View style={styles.uuidModeSelector}>
              <TouchableOpacity 
                onPress={() => setUuidMode('predefined')} 
                style={[
                  styles.uuidModeButton,
                  uuidMode === 'predefined' && styles.uuidModeButtonActive
                ]}
              >
                <Text style={[
                  styles.uuidModeButtonText,
                  uuidMode === 'predefined' && styles.uuidModeButtonTextActive
                ]}>
                  Predefined
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setUuidMode('custom')} 
                style={[
                  styles.uuidModeButton,
                  uuidMode === 'custom' && styles.uuidModeButtonActive
                ]}
              >
                <Text style={[
                  styles.uuidModeButtonText,
                  uuidMode === 'custom' && styles.uuidModeButtonTextActive
                ]}>
                  Custom
                </Text>
              </TouchableOpacity>
            </View>

            {uuidMode === 'predefined' && (
              <View style={styles.uuidListContainer}>
                <Text style={styles.sectionTitle}>Select UUID Set</Text>
                <ScrollView style={styles.uuidScrollView}>
                  {predefinedUUIDList.map((uuid, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedPredefinedUUID(uuid)}
                      style={[
                        styles.uuidItem,
                        selectedPredefinedUUID.name === uuid.name && styles.selectedUuidItem
                      ]}
                    >
                      <View style={styles.uuidSelect}>
                        {selectedPredefinedUUID.name === uuid.name && (
                          <View style={styles.uuidSelected} />
                        )}
                      </View>
                      <View style={styles.uuidDetails}>
                        <Text style={styles.uuidName}>{uuid.name}</Text>
                        <Text style={styles.uuidValue}>Service: {uuid.service}</Text>
                        <Text style={styles.uuidValue}>Read: {uuid.read}</Text>
                        <Text style={styles.uuidValue}>Write: {uuid.write}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {uuidMode === 'custom' && (
              <View style={styles.customUuidContainer}>
                <Text style={styles.sectionTitle}>Enter Custom UUIDs</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Service UUID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0000xxxx-0000-1000-8000-00805f9b34fb"
                    value={customUUIDs.service}
                    onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, service: text })}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Read Characteristic UUID (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0000xxxx-0000-1000-8000-00805f9b34fb"
                    value={customUUIDs.read}
                    onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, read: text })}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Write Characteristic UUID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0000xxxx-0000-1000-8000-00805f9b34fb"
                    value={customUUIDs.write}
                    onChangeText={(text) => setCustomUUIDs({ ...customUUIDs, write: text })}
                  />
                </View>
              </View>
=======
            <TouchableOpacity onPress={() => setUuidMode('predefined')} style={{ marginBottom: 10 }}>
              <Text style={{ color: uuidMode === 'predefined' ? 'black' : 'gray' }}>• Predefined UUIDs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUuidMode('custom')} style={{ marginBottom: 10 }}>
              <Text style={{ color: uuidMode === 'custom' ? 'black' : 'gray' }}>• Custom UUIDs</Text>
            </TouchableOpacity>

            {uuidMode === 'predefined' && 
            (
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

            {uuidMode === 'custom' && 
            (
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
>>>>>>> development
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => setShowUuidModal(false)} 
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={connectWithUUIDs}
                disabled={uuidMode === 'custom' && (!customUUIDs.service || !customUUIDs.write)}
                style={[
                  styles.primaryButton,
                  (uuidMode === 'custom' && (!customUUIDs.service || !customUUIDs.write)) && 
                    styles.primaryButtonDisabled
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  <Icon name="bluetooth" size={16} color="white" /> Connect
                </Text>
              </TouchableOpacity>
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
<<<<<<< HEAD
      backgroundColor: '#F3E99F', // Light yellow background
    },
    header: {
      padding: 16,
      backgroundColor: '#FF6D60', // Coral red header
=======
      padding: 20,
      backgroundColor: '#F3E99F', // Light yellow 
>>>>>>> development
      elevation: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    scanButton: {
      backgroundColor: '#FF6D60', // Coral red
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      marginBottom: 16,
    },
    scanButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    connectedContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
<<<<<<< HEAD
      marginBottom: 16,
      elevation: 2,
      borderLeftWidth: 5,
      borderLeftColor: '#98D8AA', // Light green left border
    },
    connectedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
=======
      marginTop: 20,
      backgroundColor: '#FFFFFF',
      borderLeftWidth: 5,
      borderLeftColor: '#98D8AA', // Light green 
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
>>>>>>> development
    },
    connectedTitle: {
      fontSize: 16,
      fontWeight: 'bold',
<<<<<<< HEAD
      marginLeft: 8,
      color: '#FF6D60', // Coral red
      textDecorationLine: 'underline',
      textDecorationColor: '#F7D060', // Yellow underline
    },
    connectedDeviceInfo: {
      marginBottom: 12,
    },
    connectedDeviceName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#FF6D60', // Coral red
    },
    connectedDeviceId: {
      fontSize: 12,
      color: '#555',
      marginTop: 4,
    },
    disconnectButton: {
      backgroundColor: '#FF6D60', // Coral red
      padding: 10,
      borderRadius: 6,
      alignItems: 'center',
    },
    disconnectButtonText: {
      color: 'white',
      fontWeight: '500',
=======
      color: '#FF6D60', // Coral red
      textDecorationLine: 'underline',
      textDecorationColor: '#F7D060', // Yellow 
>>>>>>> development
    },
    deviceListContainer: {
      flex: 1,
      backgroundColor: 'white',
<<<<<<< HEAD
      borderRadius: 8,
      elevation: 2,
      padding: 16,
      borderLeftWidth: 5,
      borderLeftColor: '#98D8AA', // Light green left border
    },
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
=======
      borderLeftWidth: 5,
      borderLeftColor: '#98D8AA', // Light green 
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
>>>>>>> development
    },
    deviceListTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FF6D60', // Coral red
      textDecorationLine: 'underline',
<<<<<<< HEAD
      textDecorationColor: '#F7D060', // Yellow underline
    },
    deviceCount: {
      fontSize: 12,
      color: '#666',
    },
    listContent: {
      paddingBottom: 8,
=======
      textDecorationColor: '#F7D060', // Yellow 
>>>>>>> development
    },
    deviceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    connectedDeviceItem: {
      backgroundColor: '#e3f2fd',
    },
    deviceIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#e3f2fd',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    deviceInfoContainer: {
      flex: 1,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#FF6D60', // Coral red
    },
    deviceId: {
      fontSize: 12,
      color: '#888',
      marginTop: 2,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: '#666',
      marginTop: 16,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: '#999',
      marginTop: 8,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 24,
    },
    modalContainer: {
      backgroundColor: 'white',
<<<<<<< HEAD
      borderRadius: 12,
      maxHeight: '80%',
      borderLeftWidth: 5,
      borderLeftColor: '#98D8AA', // Light green left border
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderColor: '#eee',
=======
      borderRadius: 10,
      padding: 20,
      maxHeight: '90%',
      elevation: 5,
      borderLeftWidth: 5,
      borderLeftColor: '#98D8AA', // Light green 
>>>>>>> development
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
<<<<<<< HEAD
      color: '#FF6D60', // Coral red
      textDecorationLine: 'underline',
      textDecorationColor: '#F7D060', // Yellow underline
    },
    modalSubtitle: {
      fontSize: 14,
      color: '#666',
      marginHorizontal: 16,
      marginTop: 8,
    },
    uuidModeSelector: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      overflow: 'hidden',
    },
    uuidModeButton: {
      flex: 1,
      padding: 12,
      backgroundColor: '#f5f5f5',
    },
    uuidModeButtonActive: {
      backgroundColor: '#FF6D60', // Coral red
    },
    uuidModeButtonText: {
      textAlign: 'center',
      color: '#666',
      fontWeight: '500',
    },
    uuidModeButtonTextActive: {
      color: 'white',
    },
    uuidListContainer: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#FF6D60', // Coral red
      marginBottom: 8,
    },
    uuidScrollView: {
      maxHeight: 200,
    },
    uuidItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: '#eee',
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedUuidItem: {
      borderColor: '#FF6D60', // Coral red
      backgroundColor: '#f5f5f5', 
    },
    uuidSelect: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#888',
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uuidSelected: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#FF6D60', // Coral red
    },
    uuidDetails: {
      flex: 1,
    },
    uuidName: {
      fontWeight: '500',
      marginBottom: 4,
      color: '#FF6D60', // Coral red
    },
    uuidValue: {
      fontSize: 12,
      color: '#666',
    },
    customUuidContainer: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    inputGroup: {
      marginBottom: 12,
    },
    inputLabel: {
      fontSize: 14,
      color: '#FF6D60', // Coral red
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: '#F7D060', // Yellow
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#f9f9f9',
=======
      marginBottom: 10,
      color: '#FF6D60', // Coral red
      textDecorationLine: 'underline',
      textDecorationColor: '#F7D060', // Yellow 
    },
    input: {
      borderWidth: 1,
      borderColor: '#F7D060', // Yellow 
      padding: 8,
      marginBottom: 10,
>>>>>>> development
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderTopWidth: 1,
      borderColor: '#eee',
    },
    primaryButton: {
      flex: 1,
      backgroundColor: '#98D8AA', // Light green
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginLeft: 8,
    },
    primaryButtonDisabled: {
      backgroundColor: '#C1E1C1', // Lighter green
    },
    primaryButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: '#FF6D60', // Coral red
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginRight: 8,
    },
    secondaryButtonText: {
      color: 'white',
      fontWeight: '500',
    },
    scanButton: {
      backgroundColor: '#FF6D60', // Coral red
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      marginBottom: 16,
    },
    scanButtonDisabled: {
      backgroundColor: '#FF9E9E', // Lighter 
    },
    scanButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    }
  });

export default BluetoothConfigScreen;