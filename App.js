import { registerRootComponent } from 'expo'; 
import App from './Navigations/Navigation';
import { BluetoothProvider } from './Context/BluetoothContext'; 
import { LogProvider } from './Context/LogContext';
import { ConfigProvider } from './Context/ConfigContext';

const RootApp = () => (
  <ConfigProvider>
  <BluetoothProvider>
    <LogProvider>
      <App />
    </LogProvider>
  </BluetoothProvider>
  </ConfigProvider>
);

registerRootComponent(RootApp)
