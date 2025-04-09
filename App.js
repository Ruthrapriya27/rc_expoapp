import { registerRootComponent } from 'expo'; 
import App from './Navigations/Navigation';
import { BluetoothProvider } from './Bluetooth/BluetoothContext'; 

const RootApp = () => 
  (
  <BluetoothProvider>
    <App/>
  </BluetoothProvider>
);

registerRootComponent(RootApp);
