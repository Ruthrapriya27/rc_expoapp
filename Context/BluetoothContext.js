// BluetoothContext.js
import React, { createContext, useState } from 'react';

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [serviceUUID, setServiceUUID] = useState(null);
  const [writeUUID, setWriteUUID] = useState(null);
  const [readUUID, setReadUUID] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <BluetoothContext.Provider
      value={{
        connectedDevice,
        setConnectedDevice,
        serviceUUID,
        setServiceUUID,
        writeUUID,
        setWriteUUID,
        readUUID,
        setReadUUID,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
