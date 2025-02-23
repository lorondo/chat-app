import React from 'react';
import { StyleSheet, View } from 'react-native';

// Import the screens that will be used in the app
import Screen1 from './components/Start';  // Screen1 is the starting screen (User can input a name and choose a color)
import Screen2 from './components/Chat';   // Screen2 is where the user is taken after selecting a color
import Welcome from './components/Welcome';

// Import necessary components from React Navigation for navigation functionality
import { NavigationContainer } from '@react-navigation/native';  // Provides the container for navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';  // Creates a stack navigator for app navigation

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Create the navigator for stack-based navigation
const Stack = createNativeStackNavigator();

// Import the background image to be used in the app
const image = require('./assets/backgroundImage.png');

const App = () => {
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
            {props => <Screen2 db={db} {...props} />}
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