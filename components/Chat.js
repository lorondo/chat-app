import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Screen2 = ({ route, navigation }) => {
  // Destructure the `name` and `bgColor` from route.params
  // Default `bgColor` to 'white' if not passed in params
  const { name, bgColor = 'white' } = route.params || {};

  // useEffect hook to update the screen title in the navigation bar
  useEffect(() => {
    // Set the title of the navigation header to the `name` passed from Screen1
    navigation.setOptions({ title: name });
  }, [navigation, name]); // Dependencies to trigger effect when `navigation` or `name` changes

  return (
    // Set the background color of the container dynamically based on `bgColor`
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Display the message with the passed `name` */}
      <Text>Hello, {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full available space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
});

export default Screen2;
