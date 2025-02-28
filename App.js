import React, { useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";

import { useNetInfo } from '@react-native-community/netinfo';

// Import screens
import Screen1 from './components/Start';
import Screen2 from './components/Chat';
import Welcome from './components/Welcome';

// Create the navigator for stack-based navigation
const Stack = createNativeStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyALggj7ZGXJOaxv9n69-38bYEULw11rnak",
  authDomain: "chatapp-e5c23.firebaseapp.com",
  projectId: "chatapp-e5c23",
  storageBucket: "chatapp-e5c23.firebasestorage.app",
  messagingSenderId: "241757354753",
  appId: "1:241757354753:web:bb988f6d796dfafcfdf900"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import the background image to be used in the app
const image = require('./assets/backgroundImage.png');

const App = () => {
  const connectionStatus = useNetInfo();
  
  useEffect(() => {
    if (db && connectionStatus.isConnected !== null) {
      if (connectionStatus.isConnected) {
        enableNetwork(db).catch((error) => console.error("Failed to enable network", error));
      } else {
        Alert.alert("Connection Lost!");
        disableNetwork(db).catch((error) => console.error("Failed to disable network", error));
      }
    } 
  }, [connectionStatus.isConnected]);

  return (
    // Main container for the app. It wraps the entire navigation system
    <View style={styles.container}>
      {/* NavigationContainer is the top-level container that holds the navigation tree */}
      <NavigationContainer>
        {/* Stack.Navigator holds the screens in a stack-based navigation */}
        <Stack.Navigator
          initialRouteName="Welcome"  // Set the initial screen when the app loads to Welcome
        >
          <Stack.Screen
            name="Welcome"  
            component={Welcome}  
          />
          {/* Stack.Screen is used to define each screen in the navigator */}
          <Stack.Screen
            name="Screen1"  // Name of the screen (for navigation purposes)
            component={Screen1}  // The component (screen) to render when navigating to "Screen1"
          />
          <Stack.Screen name="Screen2">
            {props => <Screen2 {...props} db={db} isConnected={connectionStatus.isConnected} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

// Styles for the app's container
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Ensures the container takes up the full screen
    backgroundColor: 'transparent',  // Makes the background of the container transparent (useful if you're adding a background image)
  },
});

// Export the main App component
export default App;