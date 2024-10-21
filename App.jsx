import React, { useEffect, useState } from 'react';
import { SafeAreaView, TextInput, Button, Text, View, StyleSheet } from 'react-native';
import Peer from 'react-native-peerjs';

const App = () => {
  const [peerId, setPeerId] = useState(null);
  const [connectedPeerId, setConnectedPeerId] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [message, setMessage] = useState('');
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);

  useEffect(() => {
    const peerInstance = new Peer();
    setPeer(peerInstance);

    peerInstance.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setPeerId(id);
    });

    peerInstance.on('connection', (connection) => {
      console.log('Incoming connection from: ', connection.peer);
      setConn(connection);

      connection.on('data', (data) => {
        console.log('Received:', data);
        setReceivedMessage(data);
      });
    });

    return () => {
      if (peerInstance) {
        peerInstance.destroy();
      }
    };
  }, []);

  const connectToPeer = () => {
    if (peer && connectedPeerId) {
      const connection = peer.connect(connectedPeerId);
      setConn(connection);

      connection.on('open', () => {
        console.log('Connected to:', connectedPeerId);
      });

      connection.on('data', (data) => {
        console.log('Received:', data);
        setReceivedMessage(data);
      });
    }
  };

  const sendMessage = () => {
    if (conn) {
      conn.send(message);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Peer ID: {peerId}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Peer ID to connect"
        value={connectedPeerId}
        onChangeText={setConnectedPeerId}
      />
      <Button title="Connect to Peer" onPress={connectToPeer} />

      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />

      <View style={styles.messageContainer}>
        <Text style={styles.receivedTitle}>Received Message:</Text>
        <Text style={styles.receivedMessage}>{receivedMessage}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  messageContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  receivedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  receivedMessage: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default App;
