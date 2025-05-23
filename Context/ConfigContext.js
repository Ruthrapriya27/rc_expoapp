import React, { createContext, useState, useContext } from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [commonconfigValues, setcommonconfigValues] = useState({
    // Common settings
    productName: '',
    deviceIdCode: '',
    productionTimestamp: '',
    customerName: '',
    deviceType: '',
    firmwareVersion: '',
  })

  const [rfconfigValues, setrfconfigValues] = useState({

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
  })

  const [lrmconfigValues, setlrmconfigValue] = useState({
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

  const updateCommonConfig = (key, value) => {
    setcommonconfigValues(prev => ({ ...prev, [key]: value }));
  };

  const updateRfConfig = (key, value) => {
    setrfconfigValues(prev => ({ ...prev, [key]: value }));
  };

  const updateLRMConfig = (key, value) => {
    setlrmconfigValue(prev => ({ ...prev, [key]: value }));
  };


  return (
    <ConfigContext.Provider
      value={{
        commonconfigValues,
        setcommonconfigValues,
        rfconfigValues,
        setrfconfigValues,
        lrmconfigValues,
        setlrmconfigValue,
        updateCommonConfig,
        updateRfConfig,
        updateLRMConfig,
      }}
    >
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