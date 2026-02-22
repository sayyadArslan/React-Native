import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#000' },
        drawerLabelStyle: { color: '#fff' },
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Scannex - Barcode & QR Code' }} />
      <Drawer.Screen name="history" options={{ title: 'History' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
      <Drawer.Screen name="generate" options={{ title: 'Generate New Barcode' }} />
      <Drawer.Screen name="result" options={{ title: 'Result' }} />
      <Drawer.Screen name="help" options={{ title: 'Help' }} />
      <Drawer.Screen name="privacy-policy" options={{ title: 'Privacy Policy' }} />
      
    </Drawer>
  );
}
