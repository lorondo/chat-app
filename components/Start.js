import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

// Background image to display on Screen1
const image = require('../assets/backgroundImage.png');

const Screen1 = ({ navigation }) => {
  // State for storing the username and selected color for Screen2
  const [name, setName] = useState('');
  const [color, setColor] = useState('white'); // Default background color for Screen2

  // Function to handle color selection and update the color state
  const selectColor = (selectedColor) => {
    setColor(selectedColor); // Update color state when a color is selected
  };

  return (
   <ImageBackground source={image} resizeMode="cover" style={styles.image}>  {/* Set background image for the screen */}
    <View style={styles.container}>
      <Text>Hello Screen1!</Text>
      
      {/* TextInput to collect the username */}
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}  // Update `name` state on text change
        placeholder='Type your username here'  // Placeholder text when the input is empty
      />
      
      <Text>Select Chat Screen Color!</Text>
      
      {/* TouchableOpacity buttons to select background color for Screen2 */}
      <TouchableOpacity style={[styles.button, { backgroundColor: 'blue' }]} onPress={() => selectColor('blue')}>
          <Text style={styles.buttonText}>Blue</Text>  {/* Button for selecting blue */}
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => selectColor('red')}>
          <Text style={styles.buttonText}>Red</Text>  {/* Button for selecting red */}
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'yellow' }]} onPress={() => selectColor('yellow')}>
          <Text style={styles.buttonText}>Yellow</Text>  {/* Button for selecting yellow */}
      </TouchableOpacity>

      {/* Button to navigate to Screen2 with the username and selected background color */}
      <Button
        title="Go to screen 2"
        onPress={() => navigation.navigate('Screen2', { name: name, bgColor: color })}  // Pass data to Screen2
      />
    </View>
   </ImageBackground>
 );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,  // Ensure the image stretches to cover the entire screen
    justifyContent: 'center',  // Center the content vertically
  },
  container: {
    flex: 1,  // Take up full screen
    justifyContent: 'center',  // Center content vertically
    alignItems: 'center',  // Center content horizontally
  },
  button: {
    alignItems: 'center',  // Center the text inside the button
    padding: 10,  // Padding for button
    margin: 5,  // Margin between buttons
    width: 100,  // Set a fixed width for buttons
  },
  buttonText: {
    color: 'white',  // Text color for button
    fontWeight: 'bold',  // Make button text bold
  },
  textInput: {
    width: "88%",  // Text input width as a percentage of the screen width
    padding: 15,  // Padding inside the text input
    borderWidth: 1,  // Border for text input
    marginTop: 15,  // Margin at the top of the text input
    marginBottom: 15,  // Margin at the bottom of the text input
  },
});

export default Screen1;
