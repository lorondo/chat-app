import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, Image } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, storage, isConnected }) => {
  const { name, userId, bgColor = 'white' } = route.params || {};
  const [messages, setMessages] = useState([]);
  let unsubMessages = useRef(null);

  const loadChats = async () => {
    try {
      const cachedChats = await AsyncStorage.getItem("chats");
      if (cachedChats) {
        setMessages(JSON.parse(cachedChats));
      }
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected) {
      if (unsubMessages.current) unsubMessages.current();
      const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      unsubMessages.current = onSnapshot(messagesQuery, async (snapshot) => {
        const newMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text || "",
            user: {
              _id: data.user?._id || "Anonymous",
              name: data.user?.name || "Anonymous",
              avatar: data.user?.avatar || "https://placeimg.com/140/140/any"
            },
            createdAt: data.createdAt?.toMillis ? new Date(data.createdAt.toMillis()) : new Date(),
            location: data.location || null,  
            image: data.image || null,        
          };
        });

        setMessages(newMessages);
        try {
          await AsyncStorage.setItem("chats", JSON.stringify(newMessages));
        } catch (error) {
          console.error("AsyncStorage Save Error:", error);
        }
      });
    } else {
      loadChats();
    }

    return () => {
      if (unsubMessages.current) unsubMessages.current();
    };
  }, [db, navigation, name, isConnected]);

  const onSend = async (newMessages = []) => {
    newMessages.forEach(async (message) => {
      console.log("Processing message in onSend:", message); // Add this debug log
  
      try {
        const validUser = {
          _id: message.user?._id || "Anonymous",
          name: message.user?.name || "Anonymous",
        };
  
        const messageToSend = {
          _id: message._id,
          text: message.text || "",
          user: validUser,
          createdAt: serverTimestamp(),
        };
  
        if (message.location) {
          messageToSend.location = message.location;
        }
  
        if (message.image) {
          messageToSend.image = message.image;
        }
  
        console.log("Saving to Firestore:", messageToSend);
  
        await addDoc(collection(db, "messages"), messageToSend);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
  };       

  const renderBubble = (props) => {
    const { currentMessage } = props;
  
    if (currentMessage?.image) {
      console.log("Rendering image:", currentMessage.image); // Debugging
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: "#000", padding: 10, borderRadius: 15 },
            left: { backgroundColor: "#FFF", padding: 10, borderRadius: 15 },
          }}
        >
          <View style={{ marginTop: 5 }}>
            <Image
              source={{ uri: currentMessage.image }}
              style={{ width: 200, height: 150, borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>
        </Bubble>
      );
    }
  
    if (currentMessage?.location) {
      console.log("Rendering location:", currentMessage.location); // Debugging
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: "#000", padding: 10, borderRadius: 15 },
            left: { backgroundColor: "#FFF", padding: 10, borderRadius: 15 },
          }}
        >
          <MapView
            style={{ width: 200, height: 150, borderRadius: 10 }}
            initialRegion={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          />
        </Bubble>
      );
    }
  
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: "#000", padding: 10, borderRadius: 15 },
          left: { backgroundColor: "#FFF", padding: 10, borderRadius: 15 },
        }}
        textStyle={{
          right: { color: "#FFF" },
          left: { color: "#000" },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => (isConnected ? <InputToolbar {...props} /> : null);

  const renderCustomActions = (props) => {
    return <CustomActions 
      {...props} 
      user={{ _id: userId || "Anonymous", name: name || "Anonymous" }} 
      onSend={onSend}
      storage={storage} 
    />;
  };    

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage?.location?.latitude && currentMessage?.location?.longitude) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          initialRegion={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.chatContainer, { backgroundColor: bgColor }]}>
      <Text style={styles.welcomeText}>Hello, {name || "Guest"}!</Text>
      {isConnected !== false ? (
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={(messages) => onSend(messages)}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          user={{
            _id: userId || "Anonymous",
            name: name || "Anonymous",
            avatar: "https://placeimg.com/140/140/any"
          }}
          image
        />
      ) : (
        <>
          <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            user={{
              _id: userId || "Anonymous",
              name: name || "Anonymous",
              avatar: "https://placeimg.com/140/140/any"
            }}
          />
          <Text style={styles.offlineText}>Offline Mode - Viewing Cached Messages</Text>
        </>
      )}
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: { flex: 1, width: "100%", justifyContent: "center" },
  welcomeText: { fontSize: 18, textAlign: "center", marginVertical: 10 },
  offlineText: { fontSize: 16, textAlign: "center", margin: 20 },
});

export default Chat;