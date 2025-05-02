import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useConfig } from '../Context/ConfigContext';

const ConfigSumScreen = () => {
  const { configValues } = useConfig();
  const productName = configValues.productName;

  return (
    <ScrollView style={styles.container}>
      {/* Always Visible - Common Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        <ConfigItem label="Product Name" value={productName} />
        <ConfigItem label="Device ID Code" value={configValues.deviceIdCode} />
        <ConfigItem label="Production Timestamp" value={configValues.productionTimestamp} />
        <ConfigItem label="Customer Name" value={configValues.customerName} />
        <ConfigItem label="Device Type" value={configValues.deviceType} />
        <ConfigItem label="Firmware Version" value={configValues.firmwareVersion} />
      </View>

      {/* Only for IR/RF */}
      {productName === 'IR/RF' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IR RF Configuration</Text>
            <ConfigItem label="RF Channel" value={configValues.rfChannel} />
            <ConfigItem label="RF Frequency" value={configValues.rfFrequency} />
            <ConfigItem label="Logical Address" value={configValues.rfLogicalAddress} />
            <ConfigItem label="Encryption Key" value={configValues.rfEncryptionKey} />
            <ConfigItem label="Sync Word" value={configValues.rfSyncWord} />
            <ConfigItem label="Baudrate" value={configValues.rfBaudrate} />
            <ConfigItem label="Chip ID" value={configValues.rfChipId} />
            <ConfigItem label="IR Logical Address" value={configValues.irLogicalAddress} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RF Relay Configuration</Text>
            <ConfigItem label="Number of Relays" value={configValues.relayCount} />
            <ConfigItem label="Number of Keys" value={configValues.keyCount} />
            <ConfigItem label="Momentary Timeout" value={configValues.momentaryTimeout} />
            <ConfigItem label="Relay Timeout" value={configValues.relayTimeout} />
            <ConfigItem label="Mode Value" value={configValues.modeValue} />
            <ConfigItem label="Ontime Delay" value={configValues.ontimeDelay} />
            <ConfigItem label="Offtime Delay" value={configValues.offtimeDelay} />
            <ConfigItem label="Interlock Value" value={configValues.interlockValue} />
            <ConfigItem label="Relay Number" value={configValues.relayNumber} />
          </View>
        </>
      )}

      {/* Only for LRM3 */}
      {productName === 'LRM3' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LRM3 RF Configuration</Text>
          <ConfigItem label="RF Device Type" value={configValues.rfDeviceType} />
          <ConfigItem label="RF Firmware Version" value={configValues.rfFirmwareVersion} />
          <ConfigItem label="Bandwidth" value={configValues.rfBandwidth} />
          <ConfigItem label="Spread Factor" value={configValues.spreadFactor} />
          <ConfigItem label="Code Rate" value={configValues.codeRate} />
          <ConfigItem label="Transmission Power" value={configValues.rfTransmissionPower} />
          <ConfigItem label="Sync Word" value={configValues.rfSyncWord} />
          <ConfigItem label="Frequency" value={configValues.rfFrequency} />
          <ConfigItem label="Logical Address" value={configValues.rfLogicalAddress} />
          <ConfigItem label="Preamble Length" value={configValues.preambleLength} />
          <ConfigItem label="Payload Length" value={configValues.payloadLength} />
          <ConfigItem label="CRC Control" value={configValues.crcControl} />
          <ConfigItem label="RF Relay Timeout" value={configValues.rfRelayTimeout} />
        </View>
      )}
    </ScrollView>
  );
};

const ConfigItem = ({ label, value }) => (
  <View style={styles.configItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'Not set'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#3498db',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
});

export default ConfigSumScreen;
