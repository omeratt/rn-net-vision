// import { registerNetVisionDevMenu } from '@omeratt/rn-net-vision';
import { useNetVision } from '@omeratt/rn-net-vision';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  useNetVision();

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Hello NetVision',
        body: 'This is a test request body',
        userId: 123,
      }),
    });
    fetch('https://sellme.app/feed/63ad9ff1623d856c886d918d', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetch('https://sellme.app/feed', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Cache-Control': 'no-cache',
      },
    });
    fetch('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'method': 'GET',
        'Content-Type': 'application/json',
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome To Net Vision!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 32,
    color: '#000',
    letterSpacing: 2,
  },
});
