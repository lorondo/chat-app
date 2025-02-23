import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat"; // Importing GiftedChat for chat functionality
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";

// Chat component for handling messaging
const Chat = ({ route, db, navigation }) => {
  const { name, userId } = route.params; 
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });
  
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        const data = doc.data();
        newMessages.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toMillis ? new Date(data.createdAt.toMillis()) : new Date()
        });
      });
      setMessages(newMessages);
    });
  
    return () => unsubMessages();
  }, []);   


  // Function to handle sending messages
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), {
      ...newMessages[0], 
      createdAt: serverTimestamp() // Ensure `createdAt` is a Firestore timestamp
    });
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
        user={{ 
          _id: userId,
          name: name  
        }}
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </View>  
  );
};

// Screen2 component to display a simple welcome message with background color
const Screen2 = ({ route, navigation, db }) => {
  const { name, bgColor = 'white' } = route.params || {}; 

  useEffect(() => {
    navigation.setOptions({ title: name }); 
  }, [navigation, name]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.welcomeText}>Hello, {name || "Guest"}!</Text> 
      <Chat route={route} db={db} navigation={navigation} /> 
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
    flex: 1,  // Ensure chat takes up full available space
    width: '100%',  // Ensures chat takes full width of the screen
    justifyContent: 'center', // Aligns content within the available space
  },
});

export default Screen2;
