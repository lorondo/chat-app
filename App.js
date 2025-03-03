import React, { useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from "firebase/app"; // Importing Firebase SDK for initialization
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore"; // Firestore functions
import { useNetInfo } from '@react-native-community/netinfo'; // Hook to check network status
import { getStorage } from "firebase/storage";

// Import screens (these are your app's pages)
import Screen1 from './components/Start'; 
import Chat from './components/Chat'; 
import Welcome from './components/Welcome';

// Initialize the stack navigator for screen navigation
const Stack = createNativeStackNavigator();

// Firebase config object for your app
const firebaseConfig = {
  apiKey: "AIzaSyALggj7ZGXJOaxv9n69-38bYEULw11rnak",
  authDomain: "chatapp-e5c23.firebaseapp.com",
  projectId: "chatapp-e5c23",
  storageBucket: "chatapp-e5c23.firebasestorage.app",
  messagingSenderId: "241757354753",
  appId: "1:241757354753:web:bb988f6d796dfafcfdf900"
};

// Initialize Firebase with the config
const app = initializeApp(firebaseConfig);
// Get Firestore instance to interact with the database
const db = getFirestore(app);
const storage = getStorage(app);

const App = () => {
  // Use NetInfo to monitor the device's network connection
  const connectionStatus = useNetInfo();

  // Use effect to monitor changes in network connection status
  useEffect(() => {
    // Ensure Firestore is initialized and network status is valid
    if (db && connectionStatus.isConnected !== null) {
      if (connectionStatus.isConnected) {
        // If the device is connected to the internet, enable Firestore network
        enableNetwork(db).catch((error) => console.error("Failed to enable network", error));
      } else {
        // If offline, show an alert and disable Firestore network
        Alert.alert("Connection Lost!", "You are now in offline mode.");
        disableNetwork(db).catch((error) => console.error("Failed to disable network", error));
      }
    }
  }, [connectionStatus.isConnected]); // Dependency on connectionStatus

  return (
    // Main container for the app that holds the navigation structure
    <View style={styles.container}>
      {/* Navigation container holds all screens for navigation */}
      <NavigationContainer>
        {/* Stack navigator defines screen navigation within the app */}
        <Stack.Navigator initialRouteName="Welcome">
          {/* Screen for Welcome Page */}
          <Stack.Screen name="Welcome" component={Welcome} />
          {/* Screen for Start Page */}
          <Stack.Screen name="Screen1" component={Screen1} />
          {/* Screen for Chat - Here we're passing the db and connectionStatus props */}
          <Stack.Screen 
            name="Chat"
            children={(props) => <Chat 
              {...props} 
              db={db} 
              isConnected={connectionStatus.isConnected}
              storage={storage} 
            />}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

// Define styling for the container (the main layout of the app)
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Makes the container fill the entire screen
    backgroundColor: 'transparent', // Sets the background to be transparent
  },
});

// Export the App component so it can be used elsewhere in the app
export default App;
