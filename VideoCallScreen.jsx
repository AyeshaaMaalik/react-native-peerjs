// VideoCallScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';
import Peer from 'react-native-peerjs';

const VideoCallScreen = () => {
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localStream = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    // Initialize PeerJS
    const peer = new Peer({
      host: 'peerjs.com', // or 'your-server-hostname.com' if you self-host PeerServer
      secure: true,
      port: 443,
      path: '/',
      debug: 3,
    });

    peerRef.current = peer;

    // Get a unique Peer ID
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setPeerId(id);
    });

    // When a call is received, answer it and get remote stream
    peer.on('call', (call) => {
      call.answer(localStream.current); // Answer with the local stream
      call.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream); // Receive the remote stream
      });
    });

    // Clean up the peer connection when component unmounts
    return () => peer.disconnect();
  }, []);

  const startLocalStream = async () => {
    // Access local camera and microphone
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    localStream.current = stream;
  };

  const makeCall = (remotePeerId) => {
    // Make a call to the specified peer
    const call = peerRef.current.call(remotePeerId, localStream.current);
    call.on('stream', (remoteStream) => {
      setRemoteStream(remoteStream); // Receive the remote stream
    });
  };

  return (
    <View style={styles.container}>
      <Text>My Peer ID: {peerId}</Text>
      <Button title="Start Local Stream" onPress={startLocalStream} />

      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
        />
      )}

      <Button
        title="Call Remote Peer"
        onPress={() => makeCall('REMOTE_PEER_ID')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideo: {
    width: 300,
    height: 300,
  },
});

export default VideoCallScreen;
