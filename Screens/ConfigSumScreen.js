import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfigSummaryScreen = () => {
  const [configData, setConfigData] = useState({});

  useEffect(() => {
    const loadConfigData = async () => {
      try {
        const keys = {
          // COMMON CONFIGURATIONS
          deviceName: '@config_common_deviceName',
          deviceIdCode: '@config_common_deviceIdCode',
          prodTimestamp: '@config_common_prodTimestamp',
          customerName: '@config_common_customerName',
          deviceType: '@config_common_deviceType',
          firmwareVersion: '@config_common_firmwareVersion',

          // IR/RF - RF CONFIGURATIONS
          rfChannel: '@config_rf_channel',
          rfFrequency: '@config_rf_frequency',
          rfLogicalAddress: '@config_rf_logicalAddress',
          rfEncryptionKey: '@config_rf_encryptionKey',
          rfSyncWord: '@config_rf_syncWord',
          rfBaudrate: '@config_rf_baudrate',
          rfChipId: '@config_rf_chipId',

          // IR/RF - IR CONFIGURATIONS
          irLogicalAddress: '@config_ir_logicalAddress',

          // IR/RF RELAY CONFIGURATIONS
          momentaryTimeout: '@config_relay_momentaryTimeout',
          keyValue: '@config_relay_keyValue',
          modeValue: '@config_relay_modeValue',
          ontimeDelay: '@config_relay_ontimeDelay',
          offtimeDelay: '@config_relay_offtimeDelay',
          interlockValue: '@config_relay_interlockValue',
          relayNumber: '@config_relay_relayNumber',
          relayCount: '@config_relay_relayCount',
          keyCount: '@config_relay_keyCount',

          // LRM - RF CONFIGURATIONS
          lrmRfBandwidth: '@config_lrm_rfBandwidth',
          lrmSpreadFactor: '@config_lrm_spreadFactor',
          lrmCodeRate: '@config_lrm_codeRate',
          lrmRfTransmissionPower: '@config_lrm_rfTransmissionPower',
          lrmPreambleLength: '@config_lrm_preambleLength',
          lrmPayloadLength: '@config_lrm_payloadLength',
          lrmCrcControl: '@config_lrm_crcControl',
          lrmRfRelayTimeout: '@config_lrm_rfRelayTimeout',
          rfDeviceType: '@config_rf_deviceType',
          rfFirmwareVersion: '@config_rf_firmwareVersion',

          // LRM - RELAY CONFIGURATIONS
          lrmRelayTimeout: '@config_lrm_relayTimeout',
        };

        const entries = await Promise.all(
          Object.entries(keys).map(async ([label, storageKey]) => {
            const value = await AsyncStorage.getItem(storageKey);
            return [label, value ?? 'Not Set'];
          })
        );

        setConfigData(Object.fromEntries(entries));
      } catch (error) {
        console.error('Failed to load configuration data:', error);
      }
    };

    loadConfigData();
  }, []);

  const renderSettingItem = ({ key, value }) => (
    <View style={styles.settingItem} key={key}>
      <Text style={styles.settingKey}>{key}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );

  // Grouped config arrays
  const commonConfigs = [
    { key: 'Device Name', value: configData.deviceName },
    { key: 'Device ID Code', value: configData.deviceIdCode },
    { key: 'Production Timestamp', value: configData.prodTimestamp },
    { key: 'Customer Name', value: configData.customerName },
    { key: 'Device Type', value: configData.deviceType },
    { key: 'Firmware Version', value: configData.firmwareVersion },
  ];

  const irRfRfConfigs = [
    { key: 'RF Channel', value: configData.rfChannel },
    { key: 'RF Frequency', value: configData.rfFrequency },
    { key: 'RF Logical Address', value: configData.rfLogicalAddress },
    { key: 'RF Encryption Key', value: configData.rfEncryptionKey },
    { key: 'RF Sync Word', value: configData.rfSyncWord },
    { key: 'RF Baudrate', value: configData.rfBaudrate },
    { key: 'RF Chip ID', value: configData.rfChipId },
  ];

  const irConfigs = [
    { key: 'IR Logical Address', value: configData.irLogicalAddress },
  ];

  const irRfRelayConfigs = [
    { key: 'Momentary Timeout', value: configData.momentaryTimeout },
    { key: 'Key Value', value: configData.keyValue },
    { key: 'Mode Value', value: configData.modeValue },
    { key: 'On-time Delay', value: configData.ontimeDelay },
    { key: 'Off-time Delay', value: configData.offtimeDelay },
    { key: 'Interlock Value', value: configData.interlockValue },
    { key: 'Relay Number', value: configData.relayNumber },
    { key: 'No. of Relays', value: configData.relayCount },
    { key: 'No. of Keys', value: configData.keyCount },
  ];

  const lrmRfConfigs = [
    { key: 'RF Bandwidth', value: configData.lrmRfBandwidth },
    { key: 'Spread Factor', value: configData.lrmSpreadFactor },
    { key: 'Code Rate', value: configData.lrmCodeRate },
    { key: 'RF Transmission Power', value: configData.lrmRfTransmissionPower },
    { key: 'Preamble Length', value: configData.lrmPreambleLength },
    { key: 'Payload Length', value: configData.lrmPayloadLength },
    { key: 'CRC Control', value: configData.lrmCrcControl },
    { key: 'RF Relay Timeout', value: configData.lrmRfRelayTimeout },
    { key: 'RF Device Type', value: configData.rfDeviceType },
    { key: 'RF Firmware Version', value: configData.rfFirmwareVersion },
  ];

  const lrmRelayConfigs = [
    { key: 'LRM Relay Timeout', value: configData.lrmRelayTimeout },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
    >
      {/* Common Configurations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Configurations</Text>
        {commonConfigs.map(renderSettingItem)}
      </View>

      {/* IR/RF Configuration Sections */}
      {configData.deviceName === 'IR/RF' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IR/RF - RF Configurations</Text>
            {irRfRfConfigs.map(renderSettingItem)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IR Configurations</Text>
            {irConfigs.map(renderSettingItem)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IR/RF Relay Configurations</Text>
            {irRfRelayConfigs.map(renderSettingItem)}
          </View>
        </>
      )}

      {/* GRAB Configuration Sections */}
      {configData.deviceName === 'GRAB' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IR/RF - RF Configurations</Text>
            {irRfRfConfigs.map(renderSettingItem)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IR Configurations</Text>
            {irConfigs.map(renderSettingItem)}
          </View>
        </>
      )}

      {/* LRM Configuration Sections */}
      {configData.deviceName === 'LRM3' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LRM - RF Configurations</Text>
            {lrmRfConfigs.map(renderSettingItem)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LRM - Relay Configurations</Text>
            {lrmRelayConfigs.map(renderSettingItem)}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
    letterSpacing: 0.3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingKey: {
    fontSize: 16,
    color: '#5F6368',
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1C',
    flex: 1,
    textAlign: 'right',
  },
});

export default ConfigSummaryScreen;



