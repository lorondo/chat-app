import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat"; // Importing GiftedChat for chat functionality

// Chat component for handling messaging
const Chat = ({ route }) => {
  const { name } = route.params; 
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Setting an initial message when the component loads
    setMessages([
      {
        _id: 1,
        text: "Hello developer", 
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []); 

  // Function to handle sending messages
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  // Custom styling for chat bubbles
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000" },
        left: { backgroundColor: "#FFF" }
      }}
    />
  );

  return (
    <View style={styles.chatContainer}> 
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{ _id: 1 }}
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </View>  
  );
};

// Screen2 component to display a simple welcome message with background color
const Screen2 = ({ route, navigation }) => {
  const { name, bgColor = 'white' } = route.params || {}; 

  useEffect(() => {
    navigation.setOptions({ title: name }); 
  }, [navigation, name]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.welcomeText}>Hello, {name || "Guest"}!</Text> 
      <Chat route={route} /> 
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    margin: 10,
  },
  chatContainer: {
    flex: 1, // Ensures chat takes up full available space
    width: '100%',
  },
});

export default Screen2;
