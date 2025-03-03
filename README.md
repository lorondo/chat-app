# ChatApp

ChatApp is a real-time messaging app where users can send text, images, and location data, while also monitoring their network connection status. It supports offline mode and syncs data when the connection is restored.

## Features
- **Real-time messaging** with Firestore
- **Image uploading** to Firebase Storage
- **Location sharing** using device GPS
- **Offline mode** with data syncing
- **Firebase Firestore** for database storage
- **React Navigation** for app routing

## Screens

### Welcome Screen (`Welcome.js`)
The **Welcome Screen** is the first screen users encounter. It displays the app title and a button that navigates to the **Start Screen** where users can enter their username and choose a chat background color.

**Key Features**:
- Displays a welcome message.
- A "Get started" button that navigates to the Start Screen.

### Start Screen (`Start.js`)
The **Start Screen** allows users to:
1. Enter a username.
2. Select a background color for their chat screen.
3. Sign in anonymously using Firebase Authentication.
4. Navigate to the Chat Screen with the selected username and background color.

**Key Features**:
- Allows users to type their username.
- Lets users choose a background color (blue, red, yellow).
- Sign-in functionality with Firebase Authentication.
- Navigates to the Chat Screen with the username and background color.

### Chat Screen (`Chat.js`)
The **Chat Screen** is where real-time messaging happens. It supports sending and receiving text, images, and location data. It uses Firebase Firestore to store messages and Firebase Storage for image uploads.

**Key Features**:
- Real-time messaging with Firestore integration.
- Image and location message support.
- Displays chat messages with user info and timestamp.
- Handles online/offline modes using Firestore network status.

### Custom Actions (`CustomActions.js`)
The **Custom Actions** component allows users to pick an image from their gallery, take a photo, or share their location in the chat. It utilizes the device's camera and location services.

**Key Features**:
- Lets users choose an image from the gallery or take a photo.
- Sends location data as a map inside the chat.
- Integrates with Firebase Storage for image uploads.

---

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (https://nodejs.org/)
- **npm** (Node Package Manager, comes with Node.js)
- **Expo CLI** (Optional, for easy app development)

## Installation

1. Clone this repository:
    ```bash
    git clone <your-repository-url>
    ```
   
2. Navigate to the project directory:
    ```bash
    cd chat-app
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the app:
    ```bash
    npm start
    ```

   Alternatively, if you're using Expo, you can use:
   ```bash
   npx expo start

## Firebase Setup
To use Firebase with this app, you'll need to set up a Firebase project and replace the Firebase configuration in the App.js file.

Go to the Firebase Console.
Create a new Firebase project.
Add Firebase Authentication, Firestore, and Firebase Storage to your project.
Copy the Firebase configuration and paste it into the firebaseConfig object in App.js.
Usage
Once the app is running, you'll be able to:

Sign up and log in anonymously to the app using Firebase Authentication.
Send messages, images, and locations in real-time.
View a list of past messages.
See other users' locations on a map when they share it.

## Troubleshooting
If you face issues with the app, ensure that:

You have granted the necessary permissions for location and camera access.
Your Firebase project is properly set up and configured.
You're connected to the internet when sending real-time data. If you're offline, the app will store messages locally and sync when the connection is restored.

## Dependencies
firebase: For interacting with Firebase services like Firestore and Firebase Storage.
@react-navigation/native: For navigation between screens.
react-native-maps: For displaying the user's location on a map.
@react-native-community/netinfo: To monitor the network connection status.
expo-image-picker: To allow users to pick images from their device gallery.
