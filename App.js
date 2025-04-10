import { registerRootComponent } from 'expo'; 
import App from './Navigations/Navigation';
import { BluetoothProvider } from './Context/BluetoothContext'; 
import { LogProvider } from './Context/LogContext';

const RootApp = () => (
  <BluetoothProvider>
    <LogProvider>
      <App />
    </LogProvider>
  </BluetoothProvider>
);

registerRootComponent(RootApp)


/*import { registerRootComponent } from 'expo'; 
import App from './Navigations/Navigation';
import { BluetoothProvider } from './Bluetooth/BluetoothContext'; 

const RootApp = () => 
  (
  <BluetoothProvider>
    <App/>
  </BluetoothProvider>
);

registerRootComponent(RootApp);*/
