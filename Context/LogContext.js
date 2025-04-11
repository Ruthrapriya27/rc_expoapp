import React, { createContext, useState } from 'react';

export const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [deviceId, setDeviceId] = useState("N/A");
  const [customerName, setCustomerName] = useState("N/A");
  const [timestamp, setTimestamp] = useState("N/A");
  const [RfChannel, setRfChannel] = useState("N/A");
  
  const addLog = (log) => {
    setLogs((prevLogs) => [log, ...prevLogs]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider
      value={{
        logs,
        addLog,
        clearLogs,
        deviceId,
        setDeviceId,
        customerName,
        setCustomerName,
        setTimestamp,
        timestamp,
        RfChannel,
        setRfChannel
      }}
    >
      {children}
    </LogContext.Provider>
  );
};
