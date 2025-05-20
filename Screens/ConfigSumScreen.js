import React, { useContext, useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useConfig } from '../Context/ConfigContext';
import { LogContext } from '../Context/LogContext';

const ConfigSumScreen = () => {
  const { configValues } = useConfig();
  const { deviceIdcode, customerName, timestamp, deviceID } = useContext(LogContext);
  const productName = configValues.productName || 'Not configured';

  // Helper function to display values consistently
  const displayValue = (value) => value || 'N/A';

  // Common settings data
  const commonSettings = [
    { key: 'Product Name', value: productName },
    { key: 'Device ID Code', value: displayValue(deviceIdcode) },
    { key: 'Customer Name', value: displayValue(customerName) },
    { key: 'Timestamp', value: displayValue(timestamp) },
    { key: 'Device Type', value: displayValue(configValues.deviceType) },
    { key: 'Firmware Version', value: displayValue(configValues.firmwareVersion) },
  ];

  // IR/RF specific settings
  const irRfSettings = [
    { key: 'RF Channel', value: displayValue(configValues.rfChannel) },
    { key: 'RF Frequency', value: displayValue(configValues.rfFrequency) },
    { key: 'Logical Address', value: displayValue(configValues.rfLogicalAddress) },
    { key: 'Encryption Key', value: displayValue(configValues.rfEncryptionKey) },
    { key: 'Sync Word', value: displayValue(configValues.rfSyncWord) },
    { key: 'Baudrate', value: displayValue(configValues.rfBaudrate) },
    { key: 'Chip ID', value: displayValue(configValues.rfChipId) },
    { key: 'IR Logical Address', value: displayValue(configValues.irLogicalAddress) },
  ];

  // Relay settings
  const relaySettings = [
    { key: 'Number of Relays', value: displayValue(configValues.relayCount) },
    { key: 'Number of Keys', value: displayValue(configValues.keyCount) },
    { key: 'Momentary Timeout', value: displayValue(configValues.momentaryTimeout) },
    { key: 'Relay Timeout', value: displayValue(configValues.relayTimeout) },
    { key: 'Mode Value', value: displayValue(configValues.modeValue) },
    { key: 'Ontime Delay', value: displayValue(configValues.ontimeDelay) },
    { key: 'Offtime Delay', value: displayValue(configValues.offtimeDelay) },
    { key: 'Interlock Value', value: displayValue(configValues.interlockValue) },
    { key: 'Relay Number', value: displayValue(configValues.relayNumber) },
  ];

  // LRM3 specific settings
  const lrm3Settings = [
    { key: 'RF Device Type', value: displayValue(configValues.rfDeviceType) },
    { key: 'RF Firmware Version', value: displayValue(configValues.rfFirmwareVersion) },
    { key: 'Bandwidth', value: displayValue(configValues.rfBandwidth) },
    { key: 'Spread Factor', value: displayValue(configValues.spreadFactor) },
    { key: 'Code Rate', value: displayValue(configValues.codeRate) },
    { key: 'Transmission Power', value: displayValue(configValues.rfTransmissionPower) },
    { key: 'Frequency', value: displayValue(configValues.rfFrequency) },
    { key: 'Logical Address', value: displayValue(configValues.rfLogicalAddress) },
    { key: 'Preamble Length', value: displayValue(configValues.preambleLength) },
    { key: 'Payload Length', value: displayValue(configValues.payloadLength) },
    { key: 'CRC Control', value: displayValue(configValues.crcControl) },
    { key: 'RF Relay Timeout', value: displayValue(configValues.rfRelayTimeout) },
  ];

  const renderSettingItem = ({ item }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingKey}>{item.key}</Text>
      <Text style={styles.settingValue}>{item.value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        {commonSettings.map((item, index) => (
          <View key={index}>
            {renderSettingItem({ item })}
            {index < commonSettings.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>

      {/* Only for IR/RF */}
      {productName === 'IR/RF' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IR RF Configuration</Text>
            {irRfSettings.map((item, index) => (
              <View key={index}>
                {renderSettingItem({ item })}
                {index < irRfSettings.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RF Relay Configuration</Text>
            {relaySettings.map((item, index) => (
              <View key={index}>
                {renderSettingItem({ item })}
                {index < relaySettings.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </>
      )}

      {/* Only for LRM3 */}
      {productName === 'LRM3' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LRM3 RF Configuration</Text>
          {lrm3Settings.map((item, index) => (
            <View key={index}>
              {renderSettingItem({ item })}
              {index < lrm3Settings.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1C1C1C',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingKey: {
    fontSize: 16,
    color: '#5F6368',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1C',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
});

export default ConfigSumScreen;