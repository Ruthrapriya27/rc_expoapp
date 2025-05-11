import React, { createContext, useState } from 'react';

export const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [deviceIdcode, setDeviceIdcode] = useState("N/A");
  const [customerName, setCustomerName] = useState("N/A");
  const [timestamp, setTimestamp] = useState("N/A");
  const [deviceID, setDeviceId] = useState("N/A");

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
        deviceIdcode,
        setDeviceIdcode,
        customerName,
        setCustomerName,
        setTimestamp,
        timestamp,
        deviceID,
        setDeviceId
      }}
    >
      {children}
    </LogContext.Provider>
  );
};
