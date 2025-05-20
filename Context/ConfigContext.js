import React, { createContext, useState, useContext } from 'react';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [configValues, setConfigValues] = useState({
    // Common settings
    productName: '',
    deviceIdCode: '',
    productionTimestamp: '',
    customerName: '',
    deviceType: '',
    firmwareVersion: '',

    // RF settings
    rfChannel: '',
    rfFrequency: '',
    rfLogicalAddress: '',
    rfEncryptionKey: '',
    rfSyncWord: '',
    rfChipId: '',
    rfBaudrate: '',
    rfBandwidth: '',
    spreadFactor: '',
    codeRate: '',
    rfTransmissionPower: '',

    // IR settings
    irLogicalAddress: '',

    // Relay settings
    relayCount: '',
    keyCount: '',
    momentaryTimeout: '',
    relayTimeout: '',

    //LRM3 settings 
    rfDeviceType: '',
    rfFirmwareVersion: '',
    rfBandwidth: '',
    spreadFactor: '',
    codeRate: '',
    rfTransmissionPower: '',
    rfFrequency: '',
    rfLogicalAddress: '',
    preambleLength: '',
    payloadLength: '',
    crcControl: '',
    rfRelayTimeout: ''
  });

  const updateConfig = (key, value) => {
    setConfigValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ConfigContext.Provider value={{ configValues, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};