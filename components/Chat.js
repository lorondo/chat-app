import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const unsubMessages = useRef(null);

  const loadChats = async () => {
    const cachedChats = await AsyncStorage.getItem("chats");
    if (cachedChats) {
      setMessages(JSON.parse(cachedChats)); // Fix setMessages instead of setLists
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages.current) unsubMessages.current();
      
      const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages.current = onSnapshot(messagesQuery, (snapshot) => {
        const saveMessages = async () => {
          let newMessages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              _id: doc.id,
              text: data.text || "",
              user: {
                _id: data.user || "Anonymous",
                name: data.user || "Anonymous"
              },
              createdAt: data.createdAt?.toMillis ? new Date(data.createdAt.toMillis()) : new Date(),
            };
          });
      
          setMessages(newMessages);
      
          AsyncStorage.setItem("chats", JSON.stringify(newMessages));
        };
      
        saveMessages(); // Call the async function
      });
    } else {
      loadChats();
    }

    return () => {
      if (unsubMessages.current) unsubMessages.current();
    };
  }, [db, navigation, name, isConnected]);

  const onSend = async (newMessages) => {
    const { _id, text, user } = newMessages[0];

    if (!text || !user) {
      console.error("Invalid message: Missing text or user");
      return;
    }

    await addDoc(collection(db, "messages"), {
      _id,
      text,
      user: user._id || "Anonymous",
      createdAt: serverTimestamp(),
    });
  };

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
      {isConnected !== false ? (
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          onSend={messages => onSend(messages)}
          user={{
            _id: userId,  
            name: name || "Anonymous"
          }}
        />
      ) : (
        <Text style={styles.offlineText}>Offline Mode - Viewing Cached Messages</Text>
      )} 
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </View>  
  );
};

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
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
});

export default Screen2;
